<!-- Login.vue -->
<template>
    <div class="title-section">
        <h1>专业课程思政案例资源库</h1>
    </div>
    <form @submit.prevent="submitForm">
        <h2>系统登录</h2>
        <label for="username">用户名:</label>
        <input type="text" id="username" v-model="username" placeholder="请输入用户名" required>

        <label for="password">密码:</label>
        <input type="password" id="password" v-model="password" placeholder="请输入密码" required>

        <button type="submit">登录</button>
        <button type="button" @click="goToRegister">注册</button>
    </form>
</template>

<script>
import { mapActions } from 'vuex';
import axios from 'axios';

export default {
    data() {
        return {
            username: '',
            password: '',
        };
    },

    methods: {
        ...mapActions(['login']), // 使用 Vuex 的 login action
        async submitForm() {
            try {
                const response = await axios.post('http://127.0.0.1:5000/api/login', {
                    username: this.username,
                    password: this.password
                });

                if (response.data.success) {
                    this.login({ token: response.data.token, user: response.data.user }); // 调用 Vuex 的 login action
                    this.$router.push({ path: '/homepage' });
                } else {
                    alert("用户名或密码错误！");
                }
            } catch (error) {
                console.error('登录失败:', error);
                alert("登录请求失败，请稍后再试！");
            }
        },
        goToRegister() {
            this.$router.push({ path: '/register' });
        }
    }
};
</script>




<style scoped>
body {
    font-family: Arial, sans-serif;
    background-color: #f0f0f0;
}

form {
    width: 300px;
    margin: 0 auto;
    padding: 20px;
    background-color: #fff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

label {
    display: block;
    margin-bottom: 10px;
}

input[type="text"],
input[type="password"] {
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

button {
    width: 100%;
    padding: 10px;
    background-color: #333;
    color: #fff;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
}

button:hover {
    background-color: #555;
}
</style>