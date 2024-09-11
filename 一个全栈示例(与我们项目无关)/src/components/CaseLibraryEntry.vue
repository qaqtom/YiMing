<template>
    <div>
        <div class="title-section">
            <h1>专业课程思政案例资源库</h1>
        </div>

        <header>
            <div class="navbar">
                <a href="/">首页</a>
                <a href="/inquire">案例查询</a>
                <a href="/caselibraryentry" v-if="role === 'admin'" class="current">案例录入</a>
                <a href="/correct" v-if="role === 'admin'">案例修改</a>
                <a href="/systemmanagement" v-if="role === 'superadmin'">系统管理</a>
                <a href="/logout">退出登录</a>
            </div>
        </header>

        <div class="container">
            <h1>案例录入</h1>

            <!-- 选择录入类型 -->
            <div class="form-group">
                <label>请选择录入类型：</label>
                <el-select
                    v-model="entryType"
                    placeholder="请选择录入类型："
                    size="large"
                    style="width: 240px"
                >
                <el-option label="课程录入" value="course"/>
                <el-option label="名人录入" value="famous"/>
                <el-option label="案例录入" value="case"/>
                </el-select>
            </div>


            <el-form label-width="138px" size="large" v-if="entryType === 'course'">
                <el-form-item label="专业：" >
                    <el-select v-model="form.major" placeholder="请选择专业">
                        <el-option v-for="option in majors" :key="option.major" :label="option.major" :value="option.major" />
                    </el-select>
                </el-form-item>

                <el-form-item label="课程名称：">
                    <el-input v-model="form.course" placeholder="请输入课程名称"/>
                </el-form-item>

                <el-form-item label="知识点：">
                    <el-input v-model="form.knowledge_points" :rows="5" type="textarea" placeholder="请输入知识点" />
                </el-form-item>

                <el-form-item label="案例：" >
                    <el-input v-model="form.case_study" :rows="5" type="textarea" placeholder="请输入案例"/>
                </el-form-item>

                <el-form-item label="精神：" >
                    <el-input v-model="form.spirit" :rows="5" type="textarea" placeholder="请输入精神"/>
                </el-form-item>
                
                <el-form-item >
                    <div class="search">
                        <el-button type="primary" @click="handleSubmit">提交</el-button>  
                        <el-button @click="resetForm">清空</el-button> 
                    </div>
                </el-form-item>
            </el-form>

            
            

            <!-- 名人录入表单 -->
            <el-form label-width="138px" size="large" v-if="entryType === 'famous'">
                <el-form-item label="名人名称：" >
                    <el-input v-model="form.famousName" placeholder="请输入名人名称"/>
                </el-form-item>

                <el-form-item label="研究领域：" >
                    <el-input v-model="form.research_field" placeholder="请输入研究领域"/>
                </el-form-item>

                <el-form-item label="具体信息：" >
                    <el-input v-model="form.specific" :rows="5" type="textarea" placeholder="请输入具体信息"/>
                </el-form-item>

                <el-form-item label="资料链接：" >
                    <el-input v-model="form.materials_url" placeholder="请输入资料链接"/>
                </el-form-item>

                <el-form-item label="精神：" >
                    <el-input v-model="form.spirit" :rows="5" type="textarea" placeholder="请输入精神"/>
                </el-form-item>

                <el-form-item >
                    <div class="search">
                        <el-button type="primary" @click="handleSubmit">提交</el-button>  
                        <el-button @click="resetForm">清空</el-button> 
                    </div>
                </el-form-item>
            </el-form>


            <!-- 案例录入表单 -->
            <el-form label-width="138px" size="large" v-if="entryType === 'case'">
                <el-form-item label="案例名称：" >
                    <el-input v-model="form.caseName" placeholder="请输入案例名称"/>
                </el-form-item>


                <el-form-item label="知识点：" >
                    <el-input v-model="form.knowledge_points" :rows="5" type="textarea" placeholder="请输入知识点"/>
                </el-form-item>

                <el-form-item label="案例描述：" >
                    <el-input v-model="form.case_study" :rows="5" type="textarea" placeholder="请输入案例描述"/>
                </el-form-item>


                <el-form-item label="精神：" >
                    <el-input v-model="form.spirit" :rows="5" type="textarea" placeholder="请输入精神"/>
                </el-form-item>


                <el-form-item >
                    <div class="search">
                        <el-button type="primary" @click="handleSubmit">提交</el-button>  
                        <el-button @click="resetForm">清空</el-button> 
                    </div>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script setup>

import { ref, onMounted } from 'vue';
import axios from 'axios';
import { ElOption,ElSelect,ElForm,ElFormItem,ElInput,ElButton,ElNotification } from 'element-plus';
const successOpen = (message) => {
  ElNotification.success({
    title: '成功',
    message,
    offset: 100,
    duration:2000
  })
}
const errorOpen = (message) => {
  ElNotification.error({
    title: '错误',
    message,
    offset: 100,
    duration:2000
  })
}
// Reactive state
const role = ref('');
const entryType = ref('course');
const form = ref({
    major: '',
    course: '',
    knowledge_points: '',
    case_study: '',
    spirit: '',
    famousName: '',
    research_field: '',
    specific: '',
    materials_url: '',
    caseName: '',
});
const majors = ref([]);

// Initialize data
onMounted(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    role.value = user.role;

    const fetchMajors = async () => {
        try {
            const response = await axios.get('/api/professionals');
            majors.value = response.data;
        } catch (error) {
            console.error('Error fetching majors:', error);
        }
    };

    fetchMajors();
});

// Methods
const handleSubmit = async () => {
    try {
        let response;
        const data = { ...form.value }; // 克隆表单数据

        if (entryType.value === 'course') {
            response = await axios.post('/api/add-course', data);
        } else if (entryType.value === 'famous') {
            response = await axios.post('/api/add-famous', data);
        } else if (entryType.value === 'case') {
            response = await axios.post('/api/add-case', data);
        }
        if (!response.data.success) {
            errorOpen(response.data.message)
        }else{
            successOpen(response.data.message)
        }
        
        resetForm();
    } catch (error) {
        console.error('Error during submission:', error);
        alert('提交失败，请重试。');
    }
};

const resetForm = () => {
    form.value = {
        major: '',
        course: '',
        knowledge_points: '',
        case_study: '',
        spirit: '',
        famousName: '',
        research_field: '',
        specific: '',
        materials_url: '',
        caseName: ''
    };
};
</script>

<style scoped>
body {
    font-family: Arial, sans-serif;
    background-color: #f0f0f0;
}



header{
    padding: 0 !important
}

.title-section {
    position: relative;
    height: 150px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url('../assets/mynevigation.jpg');
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
    display: flex;
    flex-direction: column;
    
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
    align-items: center;
    gap: 10px;
    margin-bottom: 1em;
}

/* label {
    width: 120px;
    text-align: right;
    margin-right: 10px;
} */

input[type="text"],
textarea,
select {
    flex-grow: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    font-family: Arial, sans-serif;
    color: #333;
    line-height: 1.5;
}

textarea {
    resize: vertical;
    min-height: 50px;
}

.search{
    margin:0 auto
}

footer {
    text-align: center;
    padding: 20px;
    background-color: #333;
    color: white;
}

header {
    background-color: #333;
    color: white;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

header a {
    color: white;
    text-decoration: none;
}

header ul {
    list-style-type: none;
    display: flex;
}

header li {
    margin-right: 20px;
}

.error-message {
    color: red;
    margin-top: 5px;
}

.success-message {
    color: green;
    margin-top: 5px;
}

.loading-spinner {
    margin-top: 10px;
    font-weight: bold;
}

.message-success {
    color: green;
    font-weight: bold;
    margin-top: 10px;
    text-align: center;
}

.message-error {
    color: red;
    font-weight: bold;
    margin-top: 10px;
    text-align: center;
}
</style>
