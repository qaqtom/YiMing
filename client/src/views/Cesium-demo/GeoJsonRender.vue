<template>
    <HightCode :code/>
    <div class="measureContainer" ref="panelDom">
        <Panel size="medium" title="渲染geojson">
            <div class="content">
                <div class="list">
                    <div class="item">
                        <!-- <div class="index">1</div> -->
                        <div class="name">渲染</div>
                        <el-switch v-model="isRender" @change="handleRender" />
                    </div>
                </div>
            </div>
        </Panel>
    </div>
</template>

<script setup lang="ts">
import { useViewerStore } from '@/stores/cesiumStore'
import { useGeoJsonRenderStore } from '@/stores/geoJsonRenderStore'
import { storeToRefs } from 'pinia';
import { onBeforeUnmount,ref,onMounted, watch, onBeforeMount } from 'vue';
import type { Viewer } from 'cesium';
import HightCode from '@/components/Code/Code.vue';
const open = () => {
  ElNotification.success({
    title: '成功',
    message: '渲染成功',
    offset: 500,
  })
}

const viewerStore = useViewerStore()
const geoJsonRenderStore = useGeoJsonRenderStore()
const { isRender } = storeToRefs(geoJsonRenderStore)
let { viewer } = storeToRefs(viewerStore)

geoJsonRenderStore.init(viewer.value as Viewer) 

const panelDom = ref<HTMLElement>(); 
watch(viewer, (current, pre) => {
    if (!pre) {
        geoJsonRenderStore.init(viewer.value as Viewer) 
    }
})
const handleRender = (value: boolean | string | number) => {
    if (value) {
        const loadingInstance = ElLoading.service({
            target:panelDom.value,
            text: "渲染中，请稍后",
            background: 'rgba(0, 0, 0, 0.7)',
        })
        setTimeout(() => {
            geoJsonRenderStore.render(viewer.value as Viewer)
            loadingInstance.close()
            open()
        }, 500);
        
    } else {
        geoJsonRenderStore.destroy(viewer.value as Viewer)
    }
}

onBeforeUnmount(() => {
    isRender.value = false
    geoJsonRenderStore.destroy(viewer.value as Viewer)
});
const code = `
------------------------------template代码------------------------------
<div class="measureContainer" ref="panelDom">
    <Panel size="medium" title="渲染geojson">
        <div class="content">
            <div class="list">
                <div class="item">
                    <!-- <div class="index">1</div> -->
                    <div class="name">渲染</div>
                    <el-switch v-model="isRender" @change="handleRender" />
                </div>
            </div>
        </div>
    </Panel>
</div>
------------------------------<script>代码------------------------------
import { useViewerStore } from '@/stores/cesiumStore'
import { useGeoJsonRenderStore } from '@/stores/geoJsonRenderStore'
import { storeToRefs } from 'pinia';
import { onBeforeUnmount,ref,onMounted, watch, onBeforeMount } from 'vue';
import type { Viewer } from 'cesium';
import HightCode from '@/components/Code/Code.vue';

const viewerStore = useViewerStore()
const geoJsonRenderStore = useGeoJsonRenderStore()
const { isRender } = storeToRefs(geoJsonRenderStore)
let { viewer } = storeToRefs(viewerStore)

geoJsonRenderStore.init(viewer.value as Viewer) 

const panelDom = ref<HTMLElement>(); 
watch(viewer, (current, pre) => {
    if (!pre) {
        geoJsonRenderStore.init(viewer.value as Viewer) 
    }
})
const handleRender = (value: boolean | string | number) => {
    if (value) {
        const loadingInstance = ElLoading.service({
            target:panelDom.value,
            text: "渲染中，请稍后",
            background: 'rgba(0, 0, 0, 0.7)',
        })
        setTimeout(() => {
            geoJsonRenderStore.render(viewer.value as Viewer)
            loadingInstance.close()
        }, 500);
        
    } else {
        geoJsonRenderStore.destroy(viewer.value as Viewer)
    }
}

onBeforeUnmount(() => {
    isRender.value = false
    geoJsonRenderStore.destroy(viewer.value as Viewer)
});
------------------------------pinia仓库代码------------------------------
import type { Geometry, Viewer } from "cesium";
import { defineStore } from "pinia";
import {
    EllipsoidTerrainProvider, Cartesian3, Math as CesiumMath, LabelCollection,
    PolygonGeometry, PolygonHierarchy, PerInstanceColorAppearance, GeometryInstance,
    ColorGeometryInstanceAttribute, Color, ShowGeometryInstanceAttribute, BlendOption,
    VerticalOrigin, HorizontalOrigin,
    Primitive
} from 'cesium'
import axios from 'axios'
interface measureType {
    isRender: boolean
    jsonData: any
    labelCollection: any,
    primitive:any
}

const colorArrs = [
    "AQUAMARINE",
    "BEIGE",
    "CORNFLOWERBLUE",
    "DARKORANGE",
    "GOLD",
    "GREENYELLOW",
    "LIGHTPINK",
    "ORANGERED",
    "YELLOWGREEN",
    "TOMATO",
];

export const useGeoJsonRenderStore = defineStore('geoJsonRenderStore', {
    state: (): measureType => ({
        isRender: false,
        jsonData: {},
        labelCollection: null,
        primitive:null
    }),
    actions: {
        async init(viewer: Viewer) {
            if (!viewer) {
                return
            }
            viewer.scene.terrainProvider = new EllipsoidTerrainProvider({});
            const position = Cartesian3.fromDegrees(
                120.17118065585795,
                35.94180290187531,
                200000,
            )
            viewer.camera.flyTo({
                destination: position,
                orientation: {
                    heading: CesiumMath.toRadians(0.0), // 朝向
                    pitch: CesiumMath.toRadians(-90.0), // 俯仰
                    roll: 0.0,
                },
                duration: 2.0, // 飞行持续时间，单位：秒
            });
            const resp1 = await axios.get('/json/qingdaoArea.geojson')
            const resp2 = await axios.get("/json/areaPoint.geojson");
            this.jsonData.features = resp1.data.features
            this.jsonData.point = resp2.data
            
        },
        render(viewer: Viewer) {
            this.labelCollection = viewer.scene.primitives.add(
                new LabelCollection()
            );
            //features是一个数组，分别存放黄岛区、市南区数据
            //features里的geometry的coordinates也是一个数组，分别是一个区内的一个个多边形
            const features = this.jsonData.features
            const point = this.jsonData.point
            let instances = [];
            const areaPointCenter = [];
            for (let i = 0; i < features.length; i++) {
                const curFeatures = features[i]
                for (let j = 0; j < curFeatures.geometry.coordinates.length; j++) {
                    const polygonArray = curFeatures.geometry.coordinates[j]
                        .toString().split(",").map(Number)
                    const polygon = new PolygonGeometry({
                        polygonHierarchy: new PolygonHierarchy(Cartesian3.fromDegreesArray(polygonArray)),//经纬度->笛卡尔坐标
                        vertexFormat: PerInstanceColorAppearance.VERTEX_FORMAT,
                        extrudedHeight: 100
                    })
                    const geometry = PolygonGeometry.createGeometry(polygon) as Geometry
                    const color = Color[colorArrs[i] as keyof typeof Color] as Color;  
                    instances.push(new GeometryInstance({
                        geometry: geometry,
                        attributes: {
                            color: ColorGeometryInstanceAttribute.fromColor(Color.fromAlpha(color, 0.6)),
                            show: new ShowGeometryInstanceAttribute(true)
                        }
                    }))
                }
                //寻找中心点，添加标签
                const p = point.features.find((item: any) => item["properties"]["ID"] == curFeatures["properties"]["id"])
                // const p = point.features.find(
                //     (item:any) => item.properties["ID"] == curFeatures["properties"]["id"]
                // );
                const longitude = p["geometry"]["coordinates"][0]
                const latitude = p["geometry"]["coordinates"][1]
                const carter3Position = Cartesian3.fromDegrees(
                    longitude,
                    latitude,
                    1500
                )
                areaPointCenter.push([longitude, latitude]);
                this.labelCollection.add({
                    text: curFeatures["properties"]["name"],
                    font: "bold 15px Microsoft YaHei",
                    blendOption: BlendOption.TRANSLUCENT, // 半透明，提高性能2倍
                    position: carter3Position,
                    // 竖直对齐方式
                    verticalOrigin: VerticalOrigin.CENTER,
                    // 水平对齐方式
                    horizontalOrigin: HorizontalOrigin.LEFT,
                })
            }
            // 合并单个geometry,提高渲染效率
            this.primitive = new Primitive({
                releaseGeometryInstances: false,
                geometryInstances: instances,
                appearance: new PerInstanceColorAppearance({
                    translucent: true,// 当 true 时，几何体应该是半透明的，因此 PerInstanceColorAppearance#renderState 启用了 alpha 混合。
                    closed: false// 当 true 时，几何体应该是关闭的，因此 PerInstanceColorAppearance#renderState 启用了背面剔除。
                }),
                asynchronous: false
            });
            viewer.scene.primitives.add(this.primitive)
        },
        destroy(viewer: Viewer) {
            viewer.scene.primitives.remove(this.primitive);
            viewer.scene.primitives.remove(this.labelCollection);
            this.primitive = null
            this.labelCollection = null
        },
    }
})
---------------------------------css代码----------------------------------------------------
.measureContainer{
    position:absolute;
    right:0;
    top:100px;
    z-index:100;
}
.content {
    padding: 20px;
}

.sub-title {
    color: #ffffff;
    background-color: #043272;
    display: inline-block;
    padding: 8px 16px;
    font-size: 14px;
}

.list {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .item {
        display: flex;
        align-items: center;
        gap: 16px;
        cursor: pointer;
        /* 设置光标为指针 */

        .index {
            width: 21px;
            height: 21px;
            padding: 0 4px;
            background-color: rgba(255, 119, 52, 0.5);
            border: 1px solid rgba(255, 119, 52, 1);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            flex: 0;
        }

        .name {
            color: #ffffff;
            font-size: 16px;
        }
    }
}
`
</script>

<style lang="less" scoped>
.measureContainer{
    position:absolute;
    right:0;
    top:100px;
    z-index:100;
}
.content {
    padding: 20px;
}

.sub-title {
    color: #ffffff;
    background-color: #043272;
    display: inline-block;
    padding: 8px 16px;
    font-size: 14px;
}

.list {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .item {
        display: flex;
        align-items: center;
        gap: 16px;
        cursor: pointer;
        /* 设置光标为指针 */

        .index {
            width: 21px;
            height: 21px;
            padding: 0 4px;
            background-color: rgba(255, 119, 52, 0.5);
            border: 1px solid rgba(255, 119, 52, 1);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            flex: 0;
        }

        .name {
            color: #ffffff;
            font-size: 16px;
        }
    }
}
</style>