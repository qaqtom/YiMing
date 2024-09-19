<template>
    <div class="mainContainer">
        <div class="code">
            <router-view /> <!-- 渲染子路由 -->
        </div>
        <div id="cesiumContainer"></div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { Viewer, Ion,ScreenSpaceEventHandler,Cartographic,ScreenSpaceEventType,Math as cesiumMath,ImageryLayer,WebMapTileServiceImageryProvider,createWorldTerrainAsync } from 'cesium';
import { useViewerStore } from '@/stores/cesiumStore/index'
onMounted(() => {
    init();
})
Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlZjdlNTE2Mi05MjE4LTQ1OGMtOGQ1ZS0wODdiNzI5YWQxYzYiLCJpZCI6MjI5NDYzLCJpYXQiOjE3MjEzOTA3OTR9.Vyt-kvvNogPDPw4y74AMwsJDHUUBuhHtwyGDuCBDtSw"
const init = async () => {
    const viewer = new Viewer("cesiumContainer", {
        //是否显示 信息窗口
        infoBox: false,
        //是否显示 搜索框
        geocoder: false,
        //是否显示 home
        // homeButton: false,
        //是否显示 2d->3d
        sceneModePicker: false,
        //是否显示 图层选择器
        baseLayerPicker: false,
        //是否显示 帮助按钮
        navigationHelpButton: false,
        //-------------------------------------底部的
        //是否显示 播放
        animation: false,
        //是否显示 时间轴
        timeline: false,
        //是否显示 全屏
        fullscreenButton: false,
        shouldAnimate: true,

        baseLayer: new ImageryLayer(
            new WebMapTileServiceImageryProvider({
                url: 'http://t{s}.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=5e3ccd9c1bb8a99f8dfe06948174dcc5',
                subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
                layer: 'tdtBasicLayer',
                style: 'default',
                format: 'image/jpeg',
                tileMatrixSetID: 'GoogleMapsCompatible',
                maximumLevel: 18,
            }),
            {}
        ),
    })

    viewer.terrainProvider = await createWorldTerrainAsync({
            requestVertexNormals: true, //开启地形光照
            // requestWaterMask: true, // 开启水面波纹
        }),

    //抗锯齿
    viewer.scene.postProcessStages.fxaa.enabled = true
    // 去除logo
    const logo = viewer.cesiumWidget.creditContainer as HTMLElement
    logo.style.display = "none";
    // 显示帧率
    viewer.scene.debugShowFramesPerSecond = true;
    viewer.scene.globe.depthTestAgainstTerrain = true;


    const viewerStore = useViewerStore();
    viewerStore.initViewer(viewer)

    // 监听点击事件，拾取坐标
//   const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);
//   handler.setInputAction((e) => {
//     const clickPosition = viewer.scene.camera.pickEllipsoid(e.position);
//     const randiansPos = Cartographic.fromCartesian(clickPosition);
//     console.log(
//       "经度：" +
//         cesiumMath.toDegrees(randiansPos.longitude) +
//         ", 纬度：" +
//         cesiumMath.toDegrees(randiansPos.latitude)
//     );
//   }, ScreenSpaceEventType.LEFT_CLICK);
}
</script>

<style scoped>
/* #cesiumContainer {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;
}
.mainContainer{

}
.code{
    height: 100%;
    width: 200px;
} */
.mainContainer {
    display: flex;
    /* 使用 flex 布局 */
    height: 100%;
    /* 使其占据整个视口高度 */
}

.code {
    height: 100%;
    /* 使代码区域的高度为 100% */
    width: auto;
    /* 确定代码区域的宽度 */
    background-color: #f0f0f0;
    /* 给代码区域一个背景色，以便更易看到 */
}

#cesiumContainer {
    flex-grow: 1;
    /* 让cesiumContainer占据剩余空间 */
    position: relative;
    /* 设为相对定位以避免影响布局 */
    overflow: hidden;
    /* 确保内容不溢出 */
}

:deep(.hljs) {
    font-family: "emoji";
}
</style>