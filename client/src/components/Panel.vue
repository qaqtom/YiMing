<template>  
    <div :class="['panel', size, { 'panel-indented': isIndented }]">  
        <div class="panel-header">  
            <button class="panel-button" @click="handleClick"></button>  
            <div class="panel-title">{{ title }}</div>  
        </div>  
        <div class="panel-content">  
            <slot></slot>  
        </div>  
    </div>  
</template>  

<script setup>  
import { ref } from 'vue';  

defineProps({  
    title: String,  
    size: {  
        type: String,  
        default: 'small'  
    }  
})  

const isIndented = ref(false); // 状态变量，用于控制缩进  

const handleClick = () => {  
    isIndented.value = !isIndented.value; // 切换缩进状态  
}  
</script>  

<style lang="less" scoped>  
.panel {  
    width: 300px;  
    transition: transform 0.2s; // 添加平滑过渡效果  

    &.small {  
        background-image: url('/images/panel-small.svg');  
        height: 234px;  
    }  

    &.medium {  
        background-image: url('/images/panel-medium.svg');  
        height: 284px;  
    }  

    &.large {  
        background-image: url('/images/panel-large.svg');  
        height: 729px;  
    }  

    // 添加缩进效果  
    &.panel-indented {  
        transform: translateX(260px); // 整个容器向右缩进  
    }  

    .panel-header {  
        display: flex;  
        padding: 9px 9px 0 9px;  
        gap: 16px;  
    }  

    .panel-button {  
        background-color: transparent;  
        background-image: url('/images/panel-button.svg');  
        background-position: center;  
        background-repeat: no-repeat;  
        width: 32px;  
        height: 32px;  
        box-sizing: border-box;  
        align-items: center;  
        outline: none;  
        cursor: pointer;  
        border: none;  
        color: #ffffff;  
        transition: transform 0.2s; // 如果需要给按钮添加平滑过渡效果  
    }  

    .panel-title {  
        color: #FFFFFF;  
        font-size: 24px;  
        font-weight: bold;  
    }  

    .panel-content {  
        padding: 8px 12px 8px 15px;  
    }  
}  
</style>