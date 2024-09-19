<!-- Register.vue -->
<template>
    <div class="title-section">
        <h1>专业课程思政案例资源库</h1>
    </div>
    <form @submit.prevent="submitFormRegister">
        <h2>用户注册</h2>
        <label for="username">用户名:</label>
        <input type="text" id="username" v-model="username" required placeholder="请输入用户名">

        <label for="password">密码:</label>
        <input type="password" id="password" v-model="password" required placeholder="请输入密码"
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="密码至少需要8个字符，包括大写、小写字母和数字">

        <label for="confirm_password">确认密码:</label>
        <input type="password" id="confirm_password" v-model="confirmPassword" required placeholder="请再次输入密码">

        <label for="identity_code">身份码:</label>
        <input type="text" id="identity_code" v-model="identityCode" placeholder="选填">

        <button type="submit">确认注册</button>
        <button type="button" @click="goToLogin">返回登录</button>
    </form>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            username: '',
            password: '',
            confirmPassword: '',
            identityCode: ''
        };
    },
    methods: {
        async submitFormRegister() {
            if (this.password !== this.confirmPassword) {
                alert("两次输入的密码不一致！");
                return;
            }

            try {
                const response = await axios.post('http://127.0.0.1:5000/api/register', {
                    username: this.username,
                    password: this.password,
                    identityCode: this.identityCode
                });

                if (response.data.success) {
                    this.$router.push({ path: '/login' });
                } else {
                    alert("注册失败，请稍后再试！");
                }
            } catch (error) {
                console.error('注册失败:', error);
                alert("注册请求失败，请稍后再试！");
            }
        },
        goToLogin() {
            this.$router.push({ path: '/login' });
        }
    }
};
</script>

<style scoped>
/* 样式保持不变 */
</style>

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