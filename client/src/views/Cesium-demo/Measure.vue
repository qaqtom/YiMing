<template>
    <div>

    </div>
</template>

<script setup lang="ts">
import { useViewerStore } from '@/stores/cesiumStore'
import { storeToRefs } from 'pinia';
import { onBeforeMount } from 'vue';

const viewerStore = useViewerStore()
let { viewer } = storeToRefs(viewerStore)

onBeforeMount(() => {
  
});


</script>

<style scoped>

</style>