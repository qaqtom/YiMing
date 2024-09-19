<template>
    <HightCode :code/>
    <div class="container">
        <Panel size="medium" title="山东水系渲染">
            <div class="content">
                <div class="list">
                    <div class="item">
                        <!-- <div class="index">1</div> -->
                        <div class="name">加载</div>
                        <el-switch v-model="isRender" @change="handleRender" />
                    </div>
                </div>
            </div>
        </Panel>
    </div>
</template>

<script setup lang="ts">
import { useViewerStore } from '@/stores/cesiumStore'
import { storeToRefs } from 'pinia';
import { onBeforeUnmount,ref } from 'vue';
import { Viewer } from 'cesium';
import { useWaterStore } from '@/stores/water';
import HightCode from '@/components/Code/Code.vue';
const open = () => {
  ElNotification.success({
    title: '成功',
    message: '渲染成功',
    offset: 500,
  })
}

const viewerStore = useViewerStore()
let { viewer } = storeToRefs(viewerStore)
const isRender = ref(false)
const waterStore = useWaterStore()


const handleRender = (value: boolean | string | number) => {
    if (value) {
        if (!viewer.value) {
            ElNotification.error({
                title: '失败',
                message: '渲染失败,cesium实例未加载完毕，请稍后重试',
                offset: 500,
            })
            isRender.value = false
            return
        }
        waterStore.init(viewer.value as Viewer)
        open()
    } else {
        waterStore.destroy(viewer.value as Viewer)
    }
}

onBeforeUnmount(() => {
    waterStore.destroy(viewer.value as Viewer)
});
const code = `
------------------------------------template代码------------------------------------
<div class="container">
    <Panel size="medium" title="山东水系渲染">
        <div class="content">
            <div class="list">
                <div class="item">
                    <!-- <div class="index">1</div> -->
                    <div class="name">加载</div>
                    <el-switch v-model="isRender" @change="handleRender" />
                </div>
            </div>
        </div>
    </Panel>
</div>
------------------------------------script代码------------------------------------
import { useViewerStore } from '@/stores/cesiumStore'
import { storeToRefs } from 'pinia';
import { onBeforeUnmount,ref } from 'vue';
import { Viewer } from 'cesium';
import { useWaterStore } from '@/stores/water';
import HightCode from '@/components/Code/Code.vue';
const open = () => {
  ElNotification.success({
    title: '成功',
    message: '渲染成功',
    offset: 500,
  })
}

const viewerStore = useViewerStore()
let { viewer } = storeToRefs(viewerStore)
const isRender = ref(false)
const waterStore = useWaterStore()


const handleRender = (value: boolean | string | number) => {
    if (value) {
        if (!viewer.value) {
            ElNotification.error({
                title: '失败',
                message: '渲染失败,cesium实例未加载完毕，请稍后重试',
                offset: 500,
            })
            isRender.value = false
            return
        }
        waterStore.init(viewer.value as Viewer)
        open()
    } else {
        waterStore.destroy(viewer.value as Viewer)
    }
}

onBeforeUnmount(() => {
    waterStore.destroy(viewer.value as Viewer)
});
------------------------------------仓库代码------------------------------------
import type { Geometry, Viewer } from "cesium";
import { defineStore } from "pinia";
import {
    EllipsoidTerrainProvider, Cartesian3, Math as CesiumMath,
    PolygonGeometry, PolygonHierarchy, GeometryInstance,
    ColorGeometryInstanceAttribute, Color, ShowGeometryInstanceAttribute,
    Primitive, EllipsoidSurfaceAppearance, Material
} from 'cesium'
import axios from 'axios'
interface measureType {
    primitive: any
}


export const useWaterStore = defineStore('waterStore', {
    state: (): measureType => ({
        primitive: null
    }),
    actions: {
        async init(viewer: Viewer) {
            if (!viewer) {
                return
            }
            viewer.scene.globe.depthTestAgainstTerrain = true;
            viewer.scene.terrainProvider = new EllipsoidTerrainProvider({});
            const position = Cartesian3.fromDegrees(
                119.43822553168705,
                35.73731181061261,
                50000,
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

            // 读取外部geojson文件
            const response = await axios.get('/json/shandon_water.geojson');
            const geojsonData = response.data;

            let instances: GeometryInstance[] = [];


            const features = geojsonData.features
            for (let i = 0; i < features.length; i++) {
                const curFeatures = features[i]
                for (let j = 0; j < curFeatures.geometry.coordinates.length; j++) {
                    const polygonArray = curFeatures.geometry.coordinates[j]
                        .toString().split(",").map(Number)
                    const polygon = new PolygonGeometry({
                        polygonHierarchy: new PolygonHierarchy(Cartesian3.fromDegreesArray(polygonArray)),//经纬度->笛卡尔坐标
                        vertexFormat: EllipsoidSurfaceAppearance.VERTEX_FORMAT,
                        extrudedHeight: 100
                    })
                    const geometry = PolygonGeometry.createGeometry(polygon) as Geometry
                    const color = Color.fromRandom({ alpha: 0.6 });
                    instances.push(new GeometryInstance({
                        geometry: geometry,
                        attributes: {
                            color: ColorGeometryInstanceAttribute.fromColor(color),
                            show: new ShowGeometryInstanceAttribute(true)
                        }
                    }))
                }
            }
            this.primitive = viewer.scene.primitives.add(
                new Primitive({
                    asynchronous: false,
                    releaseGeometryInstances: false,
                    geometryInstances: instances,
                    appearance: new EllipsoidSurfaceAppearance({
                        material: new Material({
                            fabric: {
                                type: "Water",
                                uniforms: {
                                    baseWaterColor: new Color(
                                        64 / 255.0,
                                        157 / 255.0,
                                        253 / 255.0,
                                        0.6
                                    ),
                                    normalMap: "/materials/waterNormals.jpg",
                                    frequency: 1000.0,
                                    animationSpeed: 0.1,
                                    amplitude: 10,
                                    specularIntensity: 8,
                                },
                            },
                        }),
                        translucent: true,
                    })
                })
            )
        },
        destroy(viewer: Viewer) {
            viewer.scene.globe.depthTestAgainstTerrain = false;
            viewer.scene.primitives.remove(this.primitive);
            this.primitive = null
        },
    }
})
------------------------------------css代码------------------------------------
.container{
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
.container{
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