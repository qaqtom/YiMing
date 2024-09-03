<template>
    <el-menu active-text-color="#ffd04b" background-color="#545c64" class="el-menu-vertical-demo" text-color="#fff"
        :collapse="isCollapse" :default-openeds="defaultOpenArr" :default-active="activePath">

        <el-sub-menu popper-class="pop-item" v-for="item in routesList" :key="item.path" :index="item.path">
            <template #title>
                <!-- <el-icon>
                    <component :is="item.meta?.icon"></component>
                </el-icon> -->
                <el-icon>
                    <i-ep-menu />
                </el-icon>
                <span>{{ item.meta?.title }}</span>
            </template>
            <template v-if="item.children && item.children.length">
                <el-menu-item v-for="el in item.children" :key="el.meta?.activePath"
                    @click="linkTo(item.path + '/' + el.path)" :index="el.meta?.activePath">
                    {{ el.meta?.title }}
                </el-menu-item>
            </template>
        </el-sub-menu>
    </el-menu>
</template>

<script setup lang="ts">

import { ref, defineProps, watch } from 'vue'
import { useRouter, useRoute } from "vue-router";
import { routes } from '@/router/index'
const props = defineProps({
    isCollapse: {
        type: Boolean,
        default: true
    }
})

const router = useRouter();
const route = useRoute();
const activePath = ref();
const routesList = routes.splice(1) // 从index 1开始获取路由

watch(
    () => route.meta.activePath,
    (newPath, oldPath) => {
        if (newPath !== oldPath) {
            activePath.value = newPath;
        }
    },
    {
        immediate: true,
    }
);
const linkTo = (path: any) => {
    activePath.value = path;
    router.push({
        path,
    });
};

const defaultOpenArr = routes.map((item) => item.path);
</script>

<style scoped lang="less">

.el-menu-vertical-demo:not(.el-menu--collapse) {
    min-height: 100vh;
    position: relative;
    padding-bottom: 30px;
    width: 150px;
}

.el-menu--collapse {
    min-height: 100vh;
}

.el-menu-vertical-demo {
    border: none;

    .el-sub-menu {
        border: none;
    }
}
</style>
