<template>
  <div id="cesiumContainer">
  </div>
</template>
<script setup>
import { onMounted } from "vue";
import * as Cesium from 'cesium';
onMounted(() => {
  let viewer = new Cesium.Viewer("cesiumContainer",)
})
</script>
<style>
#cesiumContainer {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
