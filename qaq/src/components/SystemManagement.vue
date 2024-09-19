<!-- SystemManagement.vue -->
<template>
    <div class="title-section">
        <h1>专业课程思政案例资源库</h1>
    </div>
    <div>
        <header>
            <div class="navbar">
                <a href="/">首页</a>
                <a href="/inquire">案例查询</a>
                <a href="/caselibraryentry" v-if="role == 'admin'">案例录入</a>
                <a href="/correct" v-if="role == 'admin'">案例修改</a>
                <a href="/systemmanagement" v-if="role == 'superadmin'">系统管理</a>
                <a href="/logout">退出登录</a>
            </div>
        </header>

        <div>
            <h1>系统管理</h1>
        </div>

        <div class="container">
            <h2>用户列表</h2>
            <table class="system-management-table">
                <thead>
                    <tr>
                        <th>用户名</th>
                        <th>角色</th>
                        <th>身份码</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in users" :key="user.id">
                        <td>{{ user.username }}</td>
                        <td>{{ user.role }}</td>
                        <td>{{ user.identity_code || '无' }}</td>
                        <td>
                            <button @click="editUser(user)">编辑</button>
                            <button @click="deleteUser(user.id)">删除</button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div v-if="selectedUser">
                <h2>编辑用户</h2>
                <form @submit.prevent="updateUser">
                    <label for="edit_username">用户名:</label>
                    <input type="text" id="edit_username" v-model="selectedUser.username" required>

                    <label for="edit_password">密码:</label>
                    <input type="password" id="edit_password" v-model="selectedUser.password">

                    <label for="edit_role">角色:</label>
                    <select id="edit_role" v-model="selectedUser.role">
                        <option value="user">普通用户</option>
                        <option value="admin">管理员</option>
                    </select>

                    <label for="edit_identity_code">身份码:</label>
                    <input type="text" id="edit_identity_code" v-model="selectedUser.identity_code">

                    <button type="submit">更新用户</button>
                </form>
            </div>
        </div>

        <footer>
            &copy; 案例资源库
        </footer>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            users: [],
            selectedUser: null,
            role:""
        };
    },

    mounted() {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        this.role = user.role
    },
    async created() {
        await this.fetchUsers();
    },
    methods: {
        async fetchUsers() {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/api/users', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.success) {
                    this.users = response.data.users;
                } else {
                    alert('获取用户列表失败');
                }
            } catch (error) {
                console.error('获取用户列表失败:', error);
                alert('请求失败，请稍后再试');
            }
        },
        editUser(user) {
            this.selectedUser = { ...user }; // Create a copy of the user object
        },
        async updateUser() {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.put(`/api/users/${this.selectedUser.id}`, this.selectedUser, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.success) {
                    await this.fetchUsers();
                    this.selectedUser = null;
                } else {
                    alert('更新用户失败');
                }
            } catch (error) {
                console.error('更新用户失败:', error);
                alert('请求失败，请稍后再试');
            }
        },
        async deleteUser(userId) {
            if (confirm('确定要删除该用户吗？')) {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.delete(`/api/users/${userId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        await this.fetchUsers();
                    } else {
                        alert('删除用户失败');
                    }
                } catch (error) {
                    console.error('删除用户失败:', error);
                    alert('请求失败，请稍后再试');
                }
            }
        }
    }
};
</script>



<style scoped>
/* Include styles from the original HTML */
body {
    font-family: Arial, sans-serif;
    background-color: #f0f0f0;
}

.title-section {
    position: relative;
    height: 150px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url('@/assets/mynevigation.jpg');
}

.title-section::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
}

.title-section h1 {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;
    color: white;
    text-align: center;
    width: 100%;
}

.navbar {
    background-color: #333;
    overflow: hidden;
}

.navbar a {
    float: left;
    display: block;
    color: white;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
}

.navbar a:hover {
    background-color: #ddd;
    color: black;
}

.container {
    width: 90%;
    max-width: 800px;
    margin: 0 auto;
    background-color: #ffffff;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
    text-align: center;
    margin-bottom: 20px;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
}

th,
td {
    padding: 10px;
    text-align: center;
    border: 1px solid #ccc;
}

tr:nth-child(even) {
    background-color: #f2f2f2;
}

button {
    padding: 10px 20px;
    background-color: #333;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 5px;
}

button:hover {
    background-color: #555;
}

footer {
    text-align: center;
    padding: 20px;
    background-color: #333;
    color: white;
}

.system-management-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

.system-management-table th,
.system-management-table td {
    padding: 10px;
    text-align: center;
    border: 1px solid #ccc;
}

.system-management-table tr:nth-child(even) {
    background-color: #f2f2f2;
}

.system-management-table th {
    background-color: #333;
    color: white;
}

.system-management-table td:last-child {
    text-align: right;
}

form {
    margin-top: 20px;
}

form label {
    display: block;
    margin-bottom: 10px;
}

form input,
form select {
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

form button {
    width: auto;
    padding: 10px 20px;
    background-color: #333;
    color: #fff;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
}

form button:hover {
    background-color: #555;
}
</style>
