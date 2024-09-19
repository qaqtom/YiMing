<template>
    <button @click="toggleCode" class="toggle-button">
        {{ panelState ? '隐藏代码' : '显示代码' }}
    </button>
    <div class="hljs-container" codetype="Vue" v-code ref="panelWrapper">
        <highlightjs language="JavaScript" :autodetect="false" :code="code" />
    </div>
    <!-- <highlightjs language="JavaScript" :autodetect="false" :code /> -->
</template>

<script setup lang="ts">
import vCode from './line';
import { ref, defineProps } from 'vue';
defineProps({
    code: {
        type: String,
        default: '暂无代码'
    }
})


let panelState = ref(true) // true表示显示
const panelWrapper = ref<HTMLElement>()
const toggleCode = () => {
    if (panelState.value) {
        //需要隐藏
        panelWrapper.value!.style.maxWidth = '0'; // 设置为0  
        panelWrapper.value!.style.padding = '0'; // 可以选择是否设置padding  
        panelState.value = false; 
    } else {
        // 需要显示
        // panelWrapper.value!.style.display = 'flex'
        panelWrapper.value!.style.maxWidth = '800px'; // 设置为一个足够大的值  
        panelWrapper.value!.style.padding = '30px 10px 2px 0'; // 恢复padding  
        panelState.value = true;
    }
};  
</script>


<style scoped>
@import "./code.css";

.toggle-button {
    margin-bottom: 10px;
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    position: absolute;
    left: 200px;
    top: 0px;
    z-index: 4;
}
.toggle-button:hover{
    color:rgb(53, 53, 104)
}
</style>