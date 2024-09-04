<script lang="ts" setup>
import Menu from '@/components/Menu.vue'
import { ref } from 'vue'
const isCollapse = ref(false)
const handleMenuClick = () => {
  isCollapse.value = !isCollapse.value
}

</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <el-icon @click="handleMenuClick" class="menuClick">
          <i-ep-menu />
        </el-icon>
        <span class="ziti">GIS开源学习平台</span>
      </el-header>
      <el-container>
        <el-aside>
          <el-scrollbar>
            <Menu :isCollapse="isCollapse" />
          </el-scrollbar>
        </el-aside>
        <el-main class="main">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped lang="less">
.el-header {
  height: 50px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: rgba(0, 255, 255, 0.171);
  .ziti {
    margin-left: 30px
  }
}

.el-container {
  height: 100vh;
  overflow: hidden;
}

.el-main {
  padding: 0 !important;
  position: relative;
  width: 100%;
}

.el-aside {
  width: auto;
}

.menuClick{
  cursor: pointer;
}
</style>
