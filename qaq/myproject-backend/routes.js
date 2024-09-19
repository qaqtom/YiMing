//routes.js
const express = require('express');
const router = express.Router();
const pool = require('./db');
const pinyin = require('pinyin').default;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { default: axios } = require('axios');

const SECRET_KEY = '666888';
// 获取课程描述列表
router.get('/courses', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT description FROM course');
        res.json(rows);
    } catch (error) {
        res.status(500).send('Error fetching courses: ' + error.message);
    }
});

// 获取案例描述列表
router.get('/cases', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT description FROM cases');
        res.json(rows);
    } catch (error) {
        res.status(500).send('Error fetching cases: ' + error.message);
    }
});

// 获取名人描述列表
router.get('/famous_people', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT description FROM famous_people');
        res.json(rows);
    } catch (error) {
        res.status(500).send('Error fetching famous people: ' + error.message);
    }
});

// 获取专业描述列表
router.get('/professionals', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT DISTINCT major FROM pyfa');
        res.json(rows);
    } catch (error) {
        res.status(500).send('Error fetching professionals: ' + error.message);
    }
});

// 查询逻辑
router.get('/search', async (req, res) => {
    const { professional, course, celebrity, ideology, case: caseName, other } = req.query;

    try {
        const results = {};

        if (professional) {
            // 专业查询
            const [rows] = await pool.query(
                'SELECT major, course_name, course_url FROM pyfa WHERE major = ?',
                [professional]
            );
            results.professional = rows.map(row => {
                const { id, ...rest } = row;
                return rest;
            });
        }

        // 通用查询逻辑
        const queries = [
            { filter: course, type: 'course' },
            { filter: celebrity, type: 'celebrity' },
            { filter: ideology, type: 'ideology' },
            { filter: caseName, type: 'case' },
            { filter: other, type: 'other' }
        ];

        for (const query of queries) {
            if (query.filter) {
                const [mappingRows] = await pool.query(
                    'SELECT table_name FROM table_mapping WHERE text_name = ?',
                    [query.filter]
                );

                if (mappingRows.length === 0) {
                    return res.status(404).send(`No mapping found for this text_name: ${query.filter}`);
                }

                const tableName = mappingRows[0].table_name;
                const [rows] = await pool.query(`SELECT * FROM ${tableName}`);
                console.log(rows)
                results[query.type] = rows.map(row => {
                    const { id, ...rest } = row;
                    return rest;
                });
            }
        }

        res.json(results);
    } catch (error) {
        res.status(500).send('Error fetching data: ' + error.message);
    }
});

// 公共插入逻辑函数
async function insertEntry(type, data) {
    if (!validateData(type, data)) {
        return { success: false, message: '必填字段为空，录入失败。' };
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction(); // 开始事务

        const tableName = generateTableName(
            type === 'course' ? data.course :
                type === 'famous' ? data.famousName :
                    type === 'case' ? data.caseName : ''
        );
        const createTableSQL = generateCreateTableSQL(type, tableName);

        await connection.query(createTableSQL);

        let insertSQL;
        if (type === 'course') {
            const knowledge_points = data.knowledge_points || '';
            const case_study = data.case_study || '';
            const spirit = data.spirit || '';

            await connection.query(
                'INSERT INTO pyfa (`major`, `course_name`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `major` = VALUES(`major`), `course_name` = VALUES(`course_name`)',
                [data.major, data.course]
            );

            await connection.query(
                'INSERT INTO course (`description`) VALUES (?) ON DUPLICATE KEY UPDATE `description` = VALUES(`description`)',
                [data.course]
            );

            await connection.query(
                'INSERT INTO table_mapping (`text_name`, `table_name`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `table_name` = VALUES(`table_name`)',
                [data.course, tableName]
            );

            insertSQL = 'INSERT INTO ?? (`knowledge_points`, `case_study`, `spirit`) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE `knowledge_points` = VALUES(`knowledge_points`), `case_study` = VALUES(`case_study`), `spirit` = VALUES(`spirit`)';
            await connection.query(insertSQL, [
                tableName,
                knowledge_points,
                case_study,
                spirit
            ]);
        } else if (type === 'famous') {
            const research_field = data.research_field || '';
            const specific = data.specific || '';
            const materials_url = data.materials_url || '';
            const spirit = data.spirit || '';

            insertSQL = 'INSERT INTO ?? (`research_field`, `specific`, `materials_url`, `spirit`) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE `research_field` = VALUES(`research_field`), `specific` = VALUES(`specific`), `materials_url` = VALUES(`materials_url`), `spirit` = VALUES(`spirit`)';
            await connection.query(insertSQL, [
                tableName,
                research_field,
                specific,
                materials_url,
                spirit
            ]);
            await connection.query(
                'INSERT INTO famous_people (`description`) VALUES (?) ON DUPLICATE KEY UPDATE `description` = VALUES(`description`)',
                [data.famousName]
            );
            await connection.query(
                'INSERT INTO table_mapping (`text_name`, `table_name`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `table_name` = VALUES(`table_name`)',
                [data.famousName, tableName]
            );
        } else if (type === 'case') {
            const knowledge_points = data.knowledge_points || '';
            const case_study = data.case_study || '';
            const spirit = data.spirit || '';

            insertSQL = 'INSERT INTO ?? (`knowledge_points`, `case_study`, `spirit`) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE `knowledge_points` = VALUES(`knowledge_points`), `case_study` = VALUES(`case_study`), `spirit` = VALUES(`spirit`)';
            await connection.query(insertSQL, [
                tableName,
                knowledge_points,
                case_study,
                spirit
            ]);
            await connection.query(
                'INSERT INTO cases (`description`) VALUES (?) ON DUPLICATE KEY UPDATE `description` = VALUES(`description`)',
                [data.caseName]
            );
            await connection.query(
                'INSERT INTO table_mapping (`text_name`, `table_name`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `table_name` = VALUES(`table_name`)',
                [data.caseName, tableName]
            );
        }

        await connection.commit(); // 提交事务

        return { success: true, message: '录入成功！' };
    } catch (error) {
        await connection.rollback(); // 回滚事务
        console.error('Error during insert:', error);
        return { success: false, message: '录入失败，请检查输入或重试。' };
    } finally {
        connection.release(); // 释放连接
    }
}
// 路由处理逻辑
router.post('/add-course', async (req, res) => {
    console.log('Received Data:', req.body); // Debugging line
    const result = await insertEntry('course', req.body);
    res.json(result);
});

router.post('/add-famous', async (req, res) => {
    console.log('Received Data:', req.body); // Debugging line
    const result = await insertEntry('famous', req.body);
    res.json(result);
});

router.post('/add-case', async (req, res) => {
    console.log('Received Data:', req.body); // Debugging line
    const result = await insertEntry('case', req.body);
    res.json(result);
});

// 根据内容生成表名（基于拼音首字母）
function generateTableName(content) {
    const initials = pinyin(content, { style: pinyin.STYLE_FIRST_LETTER })
        .map(item => item[0])
        .join('')
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, ''); // 过滤非字母数字字符

    return initials.length > 0 ? initials.slice(0, 64) : 'default_table';
}

// 生成创建表的SQL语句
function generateCreateTableSQL(type, tableName) {
    let createTableSQL;
    if (type === 'course') {
        createTableSQL = `
            CREATE TABLE IF NOT EXISTS \`${tableName}\` (
                id INT AUTO_INCREMENT PRIMARY KEY,
                knowledge_points TEXT,
                case_study TEXT,
                spirit TEXT
            )
        `;
    } else if (type === 'famous') {
        createTableSQL = `
            CREATE TABLE IF NOT EXISTS \`${tableName}\` (
                id INT AUTO_INCREMENT PRIMARY KEY,
                research_field TEXT,
                 \`specific\` TEXT,
                materials_url TEXT,
                spirit TEXT
            )
        `;
    } else if (type === 'case') {
        createTableSQL = `
            CREATE TABLE IF NOT EXISTS \`${tableName}\` (
                id INT AUTO_INCREMENT PRIMARY KEY,
                knowledge_points TEXT,
                case_study TEXT,
                spirit TEXT
            )
        `;
    }
    return createTableSQL;
}

// 数据验证函数
function validateData(type, data) {
    if (type === 'course' && !data.course) return false;
    if (type === 'famous' && !data.famousName) return false;
    if (type === 'case' && !data.caseName) return false;
    return true;
}
// 处理建议反馈
router.post('/feedback/suggestion', async (req, res) => {
    const { content, contact_info } = req.body;
    try {
        await pool.query('INSERT INTO Suggestions (content, contact_info) VALUES (?, ?)', [content, contact_info]);
        res.json({ success: true });
    } catch (error) {
        console.error('Error inserting suggestion:', error);
        res.status(500).json({ success: false, message: '提交失败' });
    }
});

// 处理问题反馈
router.post('/feedback/issue', async (req, res) => {
    const { content, contact_info } = req.body;
    try {
        await pool.query('INSERT INTO Issues (content, contact_info) VALUES (?, ?)', [content, contact_info]);
        res.json({ success: true });
    } catch (error) {
        console.error('Error inserting issue:', error);
        res.status(500).json({ success: false, message: '提交失败' });
    }
});

// 处理其他反馈
router.post('/feedback/other', async (req, res) => {
    const { content, contact_info } = req.body;
    try {
        await pool.query('INSERT INTO Others (content, contact_info) VALUES (?, ?)', [content, contact_info]);
        res.json({ success: true });
    } catch (error) {
        console.error('Error inserting other:', error);
        res.status(500).json({ success: false, message: '提交失败' });
    }
});

// 中间件：验证 JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        console.warn(`Missing token for request: ${req.originalUrl}`);
        //return res.sendStatus(401);
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        // if (err) {
        //     console.error(`Invalid token: ${token}`);
        //     return res.sendStatus(403);
        // }
        req.user = user;
        next();
    });
};

// 应用中间件
router.use(authenticateToken);

// 中间件：检查用户权限
const authorizeRole = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        console.log('Unauthorized access:', req.query);
        
        return res.sendStatus(403); // Forbidden
    }
    next();
};
//用户注册
router.post('/register', async (req, res) => {
    const { username, password, identityCode } = req.body;
    console.log('Received data:', { username, password, identityCode });

    try {
        const [existingUser] = await pool.query('SELECT * FROM Users WHERE username = ?', [username]);
        console.log('Existing user:', existingUser);
        if (existingUser.length > 0) {
            return res.status(400).json({ success: false, message: '用户已存在' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hashed password:', hashedPassword);
        var role = "user";
        if(identityCode === '8888'){
            role = "admin"
        }
        await pool.query('INSERT INTO Users (username, password, role, identity_code) VALUES (?, ?, ?, ?)', [username, hashedPassword, role, identityCode || null]);

        res.json({ success: true });
    } catch (error) {
        console.error('注册失败:', error);
        res.status(500).json({ success: false, message: '注册失败' });
    }
});


// 用户登录
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body)
    try {
        const [rows] = await pool.query('SELECT * FROM Users WHERE username = ?', [username]);
        if (rows.length === 0) {
            return res.status(400).json({ success: false, message: '用户名或密码错误' });
        }

        const user = rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: '用户名或密码错误' });
        }

        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '1h' });

        res.json({ success: true, token, user: { id: user.id, username: user.username, role: user.role } });
    } catch (error) {
        console.error('登录失败:', error);
        res.status(500).json({ success: false, message: '登录失败' });
    }
});

// 获取用户信息（需要登录）
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const [user] = await pool.query('SELECT * FROM Users WHERE id = ?', [req.user.id]);
        if (user.length === 0) {
            return res.status(404).json({ success: false, message: '用户未找到' });
        }

        res.json({ success: true, user: user[0] });
    } catch (error) {
        console.error('获取用户信息失败:', error);
        res.status(500).json({ success: false, message: '获取用户信息失败' });
    }
});

// 获取所有用户（管理员可用）
router.get('/users', authenticateToken, authorizeRole(['admin','superadmin']), async (req, res) => {
// router.get('/users', async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id, username, role, identity_code, created_at FROM Users');
        res.json({ success: true, users });
    } catch (error) {
        console.error('获取用户列表失败:', error);
        res.status(500).json({ success: false, message: '获取用户列表失败' });
    }
});

// 编辑用户信息（管理员可用）
router.put('/users/:id', authenticateToken, authorizeRole(['admin','superadmin']), async (req, res) => {
    const { id } = req.params;
    const { username, password, role, identityCode } = req.body;

    try {
        const updates = [];
        const params = [];

        if (username) {
            updates.push('username = ?');
            params.push(username);
        }
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updates.push('password = ?');
            params.push(hashedPassword);
        }
        if (role) {
            updates.push('role = ?');
            params.push(role);
        }
        if (identityCode) {
            updates.push('identity_code = ?');
            params.push(identityCode);
        }

        if (updates.length === 0) {
            return res.status(400).json({ success: false, message: '没有提供任何更新信息' });
        }

        params.push(id);
        await pool.query(`UPDATE Users SET ${updates.join(', ')} WHERE id = ?`, params);
        res.json({ success: true });
    } catch (error) {
        console.error('更新用户失败:', error);
        res.status(500).json({ success: false, message: '更新用户失败' });
    }
});

// 删除用户（管理员可用）
router.delete('/users/:id', authenticateToken, authorizeRole(['admin','superadmin']), async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query('DELETE FROM Users WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (error) {
        console.error('删除用户失败:', error);
        res.status(500).json({ success: false, message: '删除用户失败' });
    }
});
module.exports = router;
