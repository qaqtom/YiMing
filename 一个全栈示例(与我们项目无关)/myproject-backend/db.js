// db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    // password: 'Qc020912.',
    // password: '12345678',
    password: '1234',
    database: 'zysjk',
    port: 3306, // 确保端口号正确
});


module.exports = pool;
