<template>  
  <div>  
    <div class="title-section">  
      <h1>专业课程思政案例资源库</h1>  
    </div>  
    <header>  
      <div class="navbar">  
        <a href="/">首页</a>  
        <a href="/inquire" class="current">案例查询</a>  
        <a href="/caselibraryentry" v-if="role === 'admin'">案例录入</a>  
        <a href="/correct" v-if="role === 'admin'">案例修改</a>  
        <a href="/systemmanagement" v-if="role === 'superadmin'">系统管理</a>  
        <a href="/logout">退出登录</a>  
      </div>  
    </header>  
    <div class="container">  
      <h1>案例查询</h1>  
      <el-form :model="filters" label-width="auto" style="max-width: 600px;" size="large">  
        <el-form-item label="专业:" prop="professional">  
          <el-select v-model="filters.professional" placeholder="请选择">  
            <el-option  
              v-for="option in options.professionals"  
              :key="option"  
              :label="option"  
              :value="option"  
            />  
          </el-select>  
        </el-form-item>  

        <el-form-item label="课程:" prop="course">  
          <el-select v-model="filters.course" placeholder="请选择">  
            <el-option  
              v-for="option in options.courses"  
              :key="option"  
              :label="option"  
              :value="option"  
            />  
          </el-select>  
        </el-form-item>  

        <el-form-item label="名人:" prop="celebrity">  
          <el-select v-model="filters.celebrity" placeholder="请选择">  
            <el-option  
              v-for="option in options.famous_people"  
              :key="option"  
              :label="option"  
              :value="option"  
            />  
          </el-select>  
        </el-form-item>  

        <el-form-item label="思政精神:" prop="ideology">  
          <el-select v-model="filters.ideology" placeholder="请选择">  
            <el-option  
              v-for="option in options.ideologies"  
              :key="option"  
              :label="option"  
              :value="option"  
            />  
          </el-select>  
        </el-form-item>  

        <el-form-item label="案例:" prop="case">  
          <el-select v-model="filters.case" placeholder="请选择">  
            <el-option  
              v-for="option in options.cases"  
              :key="option"  
              :label="option"  
              :value="option"  
            />  
          </el-select>  
        </el-form-item>  

        <el-form-item label="其他:">  
          <el-input v-model="filters.other" placeholder="搜索关键字"></el-input>  
        </el-form-item>  

        <el-form-item>
          <div class="search">
            <el-button type="primary" @click="search">搜索</el-button>  
            <el-button @click="clearFilters">清空</el-button> 
          </div>
        </el-form-item>  
      </el-form>  

      <div v-if="Object.keys(results).length" style="width: 100%;">  
        <h2>查询结果</h2>  
        <div v-for="(resultSet, key) in results" :key="key">  
          <h3>{{ getLabelForKey(key) }}</h3>  
          <el-table v-if="resultSet.length > 0" :data="resultSet" style="width: 100%" border>  
            <el-table-column prop="index" label="序号" align="center">  
              <template v-slot="scope">  
                {{ scope.$index + 1 }}  
              </template>  
            </el-table-column> 
            <el-table-column  
              v-for="header in Object.keys(resultSet[0]).filter(h => h !== 'course_url' &&  h !== 'course_name')"  
              :key="header"  
              :prop="header"  
              :label="translatedHeaders[header] || header"
              align="center"
            />
            
            <el-table-column prop="course_name" label="课程名称" align="center" v-if="key === 'professional'">
              <template v-slot="scope">
                <a :href="scope.row.course_url || baseURL" target="_blank">{{ scope.row.course_name }}</a>
              </template>
            </el-table-column>
            
          </el-table>  
        </div>  
      </div>  
    </div>  
    <footer>  
      推荐搜索：专业：课程：名人：思政精神：案例：其他：  
    </footer>  
  </div>
</template>  

<script setup>
import { ref,onMounted } from 'vue';
import axios from 'axios';
import { ElForm,ElSelect,ElInput, ElOption,ElButton,ElTable,ElTableColumn,ElFormItem} from 'element-plus';
import { ElNotification } from 'element-plus'
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

const baseURL = "https://www.upc.edu.cn/"
const role = ref("");  
const filters = ref({  
  professional: '',  
  course: '',  
  celebrity: '',  
  ideology: '',  
  case: '',  
  other: ''  
});  
const results = ref({});  
const options = ref({  
  professionals: [],  
  courses: [],  
  famous_people: [],  
  ideologies: [],  
  cases: []  
});
  
const translatedHeaders = {  
  'professional': '专业',  
  'course': '课程',  
  'celebrity': '名人',  
  'ideology': '思政精神',  
  'case': '案例',  
  'major': '专业',  
  'course_name': '课程名称',  
  'knowledge_points': '知识点',  
  'case_study': '案例研究',  
  'spirit': '精神',  
};  

onMounted(() => {  
  const user = JSON.parse(localStorage.getItem('user') || '{}');  
  role.value = user.role;  
  fetchOptions(); 
});  


const fetchOptions = () => {  
  Promise.all([
    axios.get('http://localhost:5000/api/professionals').then(response => {
      options.value.professionals = response.data.map(item => item.major);
    }),
    axios.get('http://localhost:5000/api/courses').then(response => {
      options.value.courses = response.data.map(item => item.description);
    }),
    axios.get('http://localhost:5000/api/famous_people').then(response => {
      options.value.famous_people = response.data.map(item => item.description);
    }),
    axios.get('http://localhost:5000/api/cases').then(response => {
      options.value.cases = response.data.map(item => item.description);
    })
  ]).catch(error => {
    console.error('Error fetching options:', error);
  });
};

let params
const search = async () => {  
  results.value = {};  
  try {  
    params = {  
      professional: filters.value.professional || null,  
      course: filters.value.course || null,  
      celebrity: filters.value.celebrity || null,  
      ideology: filters.value.ideology || null,  
      case: filters.value.case || null,  
      other: filters.value.other || null  
    };
    if (Object.values(params).every(value => value === null)) {
      errorOpen("请填写搜索必要信息");
      return
    }
    const response = await axios.get('http://localhost:5000/api/search', { params });
    successOpen("查询成功")
    results.value = response.data;
  } catch (error) {  
    console.error('Error fetching search results:', error);  
  }  
};  

const clearFilters = () => {  
  filters.value = {  
    professional: '',  
    course: '',  
    celebrity: '',  
    ideology: '',  
    case: '',  
    other: ''  
  };  
  results.value = {};  
};  

const getLabelForKey = (key) => {
  const labels = {  
    professional: params.professional,  
    course: params.course,  
    celebrity: params.celebrity,  
    ideology: params.ideology,  
    case: params.case,  
    other: params.other  
  };  
  return labels[key] || key;  
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

.container {
  width: 80%;
  margin: 0 auto;
  background-color: #ffffff;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
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

</style>
