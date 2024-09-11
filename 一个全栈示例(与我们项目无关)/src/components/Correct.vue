<template>
    <div class="title-section">
        <h1>专业课程思政案例资源库</h1>
    </div>

    <header>
        <div class="navbar">
            <a href="/">首页</a>
            <a href="/inquire">案例查询</a>
            <a href="/caselibraryentry" v-if="role === 'admin'">案例录入</a>
            <a href="/correct" v-if="role === 'admin'" class="current">案例修改</a>
            <a href="/systemmanagement" v-if="role === 'superadmin'">系统管理</a>
            <a href="/logout">退出登录</a>
        </div>
    </header>

    <div class="container">
        <h1>反馈意见</h1>

        <el-form label-width="138px" size="large" label-position="top">
            <el-form-item label="反馈类型：" required>
                <el-select v-model="feedbackType" placeholder="请选择专业">
                    <el-option value="suggestion" label="建议"/>
                    <el-option value="issue" label="问题"/>
                    <el-option value="other" label="其他"/>
                </el-select>
            </el-form-item>


            <el-form-item label="反馈内容：" required>
                <el-input v-model="feedbackContent" :rows="5" type="textarea" placeholder="请输入反馈内容" />
            </el-form-item>

            <el-form-item label="联系方式（可选）：">
                <el-input v-model="contactInfo" placeholder="邮箱或电话"/>
            </el-form-item>
            
            <el-form-item >
                <div class="search">
                    <el-button type="primary" @click="submitFeedback">提交</el-button>  
                    <el-button @click="resetForm">清空</el-button> 
                </div>
            </el-form-item>
        </el-form>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { ElOption,ElSelect,ElForm,ElFormItem,ElInput,ElButton,ElNotification } from 'element-plus';
const feedbackType = ref('');
const feedbackContent = ref('');
const contactInfo = ref('');
const role = ref('');
const successOpen = (message) => {
  ElNotification.success({
    title: '成功',
    message,
    offset: 100,
    duration:2000
  })
}
// Initialize role on mount
onMounted(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    role.value = user.role;
});

const submitFeedback = async () => {
    try {
        const feedbackData = {
            content: feedbackContent.value,
            contact_info: contactInfo.value
        };

        let apiUrl = '';

        if (feedbackType.value === 'suggestion') {
            apiUrl = '/api/feedback/suggestion';
        } else if (feedbackType.value === 'issue') {
            apiUrl = '/api/feedback/issue';
        } else if (feedbackType.value === 'other') {
            apiUrl = '/api/feedback/other';
        }

        const response = await axios.post(apiUrl, feedbackData);

        if (response.data.success) {
            successOpen("反馈提交成功，谢谢您的宝贵意见！")
            resetForm();
        } else {
            alert('反馈提交失败，请稍后再试。');
        }
    } catch (error) {
        console.error('提交反馈时出错:', error);
        alert('提交反馈时出错，请稍后再试。');
    }
};

const resetForm = () => {
    feedbackType.value = '';
    feedbackContent.value = '';
    contactInfo.value = '';
};
</script>



<style scoped>
body {
    font-family: Arial, sans-serif;
    background-color: #f0f0f0;
}
select {
    height: 30px; /* 调整为你希望的高度 */
    line-height: 50px; /* 使文字垂直居中 */
    padding: 5px; /* 调整内边距 */
    font-size: 16px; /* 根据需要调整字体大小 */
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

.navbar a.current{
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
    margin-bottom: 20px;
}

h1 {
    text-align: center;
    margin-bottom: 20px;
}

form {
    display: flex;
    flex-direction: column;
    gap: 1em;
}

.form-group {
    display: flex;
    flex-direction: column;
}

input[type="text"],
textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

textarea {
    resize: vertical;
    min-height: 50px;
}

/* button {
    padding: 10px 20px;
    background-color: #333;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #555;
}

button:disabled {
    background-color: #999;
    cursor: not-allowed;
}

.button-group {
    display: flex;
    justify-content: space-between;
} */

.search{
    margin:0 auto
}
.feedback {
    margin-top: 30px;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
}

.feedback.success {
    background-color: #dff0d8;
    color: #3c763d;
}

.feedback.error {
    background-color: #f2dede;
    color: #a94442;
}

footer {
    text-align: center;
    padding: 20px;
    background-color: #333;
    color: white;
}

.error {
    color: red;
    font-size: 0.9em;
}
</style>
