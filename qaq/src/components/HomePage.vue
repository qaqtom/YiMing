<!-- HomePage.vue -->
<template>
  <div>
    <div class="title-section">
      <h1>专业课程思政案例资源库</h1>
    </div>

    <header>
      <div class="navbar">
        <a href="/" class="current">首页</a>
        <a href="/inquire">案例查询</a>
        <a href="/caselibraryentry" v-if="role === 'admin'">案例录入</a>
        <a href="/correct" v-if="role === 'admin'">案例修改</a>
        <a href="/systemmanagement" v-if="role === 'superadmin'">系统管理</a>
        <a href="/logout">退出登录</a>
      </div>
    </header>

    <div class="container">
        <el-card style="width: 100%" shadow="hover">
            <template #header><h2 style="margin: 0;padding: 0;">案例资源库简介：</h2></template>
            <el-row :gutter="20" align="middle" justify="center">
                <el-col :span="10">
                    <el-carousel :interval="2000" trigger="click">
                        <el-carousel-item v-for="item in introduction" :key="item.id">
                            <el-image style="width: 100%; height: 100%" :src="item.img" fit="cover" />
                        </el-carousel-item>
                    </el-carousel>
                </el-col>
                <el-col :span="14">
                    <h3 style="color: #2c3e50;margin: 0;padding: 0;text-align:left" >专业案例思政资源库简介</h3>  
                    <div style="text-align:left;text-indent: 2em;">
                        本资源库是一个专注于海洋类、测绘工程、地理信息科学、电子信息工程和通信工程等领域的在线教育平台，旨在为学生和专业人士提供一个丰富的学习资源和案例分析的集合。通过精心挑选的案例研究，致力于展示科技在社会发展和国家建设中的实际应用，同时融入思政教育元素，培养学生的社会责任感和创新精神。  
                    </div>

                    <h3 style="color: #2c3e50;margin: 0;padding: 0;text-align:left" >核心特点</h3>  
                    <div style="text-align:left;text-indent: 2em;">
                        跨学科案例：涵盖海洋类、测绘工程、地理信息科学、电子信息工程和通信工程等多个专业领域的实际案例。
                    </div>
                    <div style="text-align:left;text-indent: 2em;">
                        思政融合：将专业知识与思政教育相结合，强调技术背后的社会价值和伦理考量。
                    </div>
                    <div style="text-align:left;text-indent: 2em;">
                        互动学习：提供讨论区和反馈机制，鼓励学生和教育工作者之间的交流与合作。
                    </div>
                    <div style="text-align:left;text-indent: 2em;">
                        持续更新：定期更新内容，确保案例和资源的时效性和相关性。
                    </div>

                    <h3 style="color: #2c3e50;margin: 0;padding: 0;text-align:left" >目标用户</h3>  
                    <div style="text-align:left;text-indent: 2em;">
                        高等教育学生：为相关专业的学生提供实践指导和深入学习的机会。 
                    </div>
                    <div style="text-align:left;text-indent: 2em;">
                        教育工作者：为教师提供丰富的教学资源和案例，以增强课程的吸引力和实用性。
                    </div>
                    <div style="text-align:left;text-indent: 2em;">
                        行业专业人士：为在职人员提供继续教育和专业发展的平台。
                    </div>
                </el-col>
            </el-row>
        </el-card>
        
        <br />
        <br />
        <br />
        <el-card style="width: 100%" shadow="hover">
        <template #header><h2 style="margin: 0;padding: 0;">相关名人：</h2></template>
            <el-row :gutter="20" align="middle" justify="center">
                <el-col :span="8">
                    <el-carousel type="card" trigger="click" @change="introChange" :autoplay="false">
                        <el-carousel-item v-for="item in famousPeople" :key="item.id">
                            <el-image style="width: 100%; height: 300px" :src="item.img" fit="contain" />
                        </el-carousel-item>
                    </el-carousel>
                </el-col>

                <el-col :span="16">
                    <div style=" margin: auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);height: 447px; overflow-y: auto;">  
                        <h3 style="text-align: center; color: #2980b9; margin: 10px 0;">{{ currentPeople.name }}</h3>  
                        <p style="text-align: center; font-style: italic; color: #555;">{{ currentPeople.job }}</p>  

                        <div style="text-align: left; text-indent: 2em;">  
                            {{ currentPeople.desc }}  
                        </div>  

                        <div style="text-align: left; font-weight: bold; font-size: 1.2em; margin-top: 20px; color: #2980b9;">主要贡献</div>
                        <template v-for="item1 in currentPeople.contribute">
                            <div style="text-align: left; margin-left: 20px; margin-top: 5px;">{{ item1 }}</div> 
                        </template>

                        
                        <div style="text-align: left; font-weight: bold; font-size: 1.2em; margin-top: 20px; color: #2980b9;">荣誉与成就</div>
                        <template v-for="item2 in currentPeople.honor">
                            <div style="text-align: left; margin-left: 20px; margin-top: 5px;">{{ item2 }}</div> 
                        </template>
                        

                        <div style="text-align: left; font-weight: bold; font-size: 1.2em; margin-top: 20px; color: #2980b9;">代表著作</div>
                        <template v-for="item3 in currentPeople.work">
                            <div style="text-align: left; margin-left: 20px; margin-top: 5px;">{{ item3 }}</div> 
                        </template>
                    </div>  
                    <!-- <div style="text-align:left;text-indent: 2em;">
                        本资源库是一个专注于海洋类、测绘工程、地理信息科学、电子信息工程和通信工程等领域的在线教育平台，旨在为学生和专业人士提供一个丰富的学习资源和案例分析的集合。通过精心挑选的案例研究，致力于展示科技在社会发展和国家建设中的实际应用，同时融入思政教育元素，培养学生的社会责任感和创新精神。  
                    </div> -->
                </el-col>
            </el-row>
        </el-card>
        <br />
        <br />
        <br />
        <el-card style="width: 100%" shadow="hover">  
            <template #header>  
                <h2 style="margin: 0; padding: 0;">友情链接：</h2>  
            </template>
            <div class="urlContainer">
                <div>  
                    <a href="https://www.csgpc.org/list/216.html" target="_blank" style="text-decoration: none; color: #409EFF;">中国测绘学会</a>  
                </div>  
                <div>  
                    <a href="https://casad.cas.cn/ysxx2022/ysmd/qtys/" target="_blank" style="text-decoration: none; color: #409EFF;">中国科学院学部与院士</a>  
                </div>  
                <div>  
                    <a href="https://www.upc.edu.cn/" target="_blank" style="text-decoration: none; color: #409EFF;">中国石油大学（华东）</a>  
                </div>  
            </div>
            
        </el-card>  

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElCard,ElCol,ElRow,ElCarousel,ElCarouselItem,ElImage } from 'element-plus';
const role = ref('');

const introduction = [
    {id:'1',img:'/2.jpg',content:''},
    {id:'2',img:'/3.jpg',content:''},
    {id:'3',img:'/4.jpg',content:''},
]

const famousPeople = [
    {
        id: '1', img: '/ldr.jpg', content: {
            name: '李德仁院士',
            job: '中国科学院院士 | 中国工程院院士 | 武汉大学教授',
            desc: '李德仁院士是中国遥感与地理信息系统领域的奠基人之一，长期致力于推动科技创新和人才培养。他的工作对卫星遥感、摄影测量以及地理信息系统（GIS）在各个行业的应用产生了深远影响。',
            contribute: ['技术创新：在遥感技术、数字摄影测量领域取得突破，推动中国遥感科技发展。', 'GIS应用：促进地理信息系统在城市规划、资源管理等方面的广泛应用。', '教育贡献：培养大批优秀人才，推动了中国遥感与GIS学科的建设。'],
            honor: ['国家自然科学奖、国家科技进步奖获得者', '国际公认的遥感与地理信息科学专家'],
            work:['《摄影测量学》','《遥感技术与应用》']
        }
    },
    {id:'2',img:'/lxl.jpg',content:{
            name: '刘先林院士',
            job: '中国工程院院士 | 中国测绘科学研究院研究员',
            desc: '刘先林院士是中国测绘科技领域的杰出代表，他的研究和发明极大地推动了中国测绘技术的进步和创新。',
            contribute: ['技术创新：成功研发多项航测仪器，填补国内空白，提升测绘效率和精度。', '仪器研发：研制出解析测图仪和数字摄影测量工作站，推动中国测绘仪器的自主研制和产业化。'],
            honor: ['国家科技进步一等奖获得者', '中国测绘科技事业的重要推动者'],
            work:['《航测仪器研制与应用》']
        }
    },
    {id:'3',img:'/gjy.jpg',content:{
            name: '龚健雅院士',
            job: '中国科学院院士 | 武汉大学教授',
            desc: '龚健雅院士在摄影测量与遥感领域做出了卓越贡献，是中国地理信息科学的领军人物。',
            contribute: ['技术创新：在地理信息系统（GIS）的理论和应用方面取得重要成果，推动了GIS技术的发展。', '学术领导：作为多个重要学术机构的负责人，引领中国地理信息科学的研究方向。','教育贡献：培养了众多GIS领域的专业人才，对中国地理信息教育做出了显著贡献。'],
            honor: ['国家科技进步奖获得者', '国际摄影测量与遥感学会（ISPRS）Dolezal成就奖得主'],
            work:['《地理信息系统原理与方法》']
        }
    },
    {id:'4',img:'/cjy.jpg',content:{
            name: '陈俊勇院士',
            job: '中国科学院院士 | 中国工程院院士 | 同济大学兼职教授',
            desc: '陈俊勇院士是中国测绘学界的杰出科学家，他的研究为大地测量学的发展奠定了坚实的基础。',
            contribute: ['技术创新：推导了世界“1980年大地参考系”参数计算公式，为测绘学提供了重要的数学工具', '学术贡献：在大地测量、GPS技术应用等方面做出了开创性的工作，推动了中国测绘学科的进步。','教育贡献：培养了一大批测绘领域的高级人才，对中国测绘教育产生了深远影响。'],
            honor: ['国家科技进步二等奖获得者', '中国现代大地测量学的开拓者和带头人之一'],
            work:['《大地测量学》']
        }
    },
]

let currentPeople = ref(famousPeople[0].content)
const introChange = (current,pre)=>{
    currentPeople.value = famousPeople[current].content
}


onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  role.value = user.role;
});
</script>

<style scoped>
.urlContainer{
    display: flex;
    justify-content: space-around;
}
/* 添加相应的样式 */
.title-section {
  position: relative;
  height: 150px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url('@/assets/1.jpg');
}

/* .title-section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
} */

/* .title-section h1 {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
  color: white;
  text-align: center;
  width: 100%;
} */
.title-section h1 {  
  position: absolute;  
  top: 50%;  
  transform: translateY(-50%);  
  z-index: 1;  
  color: white; /* 文字颜色 */  
  text-align: center;  
  width: 100%;  
  text-shadow:   
    -1px -1px 0 rgba(0, 0, 0, 0.5),  
     1px -1px 0 rgba(0, 0, 0, 0.5),  
    -1px  1px 0 rgba(0, 0, 0, 0.5),  
     1px  1px 0 rgba(0, 0, 0, 0.5); /* 描边阴影，使用黑色添加对比度 */  
} 

body {
  font-family: Arial, sans-serif;
  font-size: 16px;
  color: #333;
  background-color: #fff;
}

h1 {
  text-align: center;
  padding: 20px 0;
}

header{
    padding: 0 !important
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
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  margin: 20px;
}

.column {
  flex: 1;
  min-width: calc(50% - 20px);
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  background-color: #f0f0f0;
}

@media screen and (max-width: 768px) {
  .column {
    flex-basis: 100%;
  }
}

img {
  max-width: 100%;
  height: auto;
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
