<!-- HomnePage.vue -->
<template>
    <div>
        <div class="title-section">
            <h1>专业课程思政案例资源库</h1>
        </div>

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

        <div class="container">
            <div class="column">
                <h2>案例资源库简介：</h2>
                <p>内容区域</p>
                <img src="https://via.placeholder.com/400x300" alt="描述性文本">
            </div>

            <div class="column">
                <h2>相关链接：</h2>
                <p>内容区域</p>
                <img src="https://via.placeholder.com/400x300" alt="描述性文本">
            </div>

            <div class="column">
                <h2>各专业简介：</h2>
                <p>内容区域</p>
                <img src="https://via.placeholder.com/400x300" alt="描述性文本">
            </div>
        </div>
    </div>
</template>

<script>

export default {
  data() {
    return {
      role:''
    };
  },
  mounted() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.role = user.role
  }
};

</script>

<style scoped>
/* 添加相应的样式 */
.title-section {
    position: relative;
    height: 150px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url('@/assets/mynevigation.jpg');
    /* 你可以暂时使用一张你手头上的图片 */
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