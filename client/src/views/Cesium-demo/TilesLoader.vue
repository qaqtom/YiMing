<template>
    <HightCode :code/>
    <div class="measureContainer">
        <Panel size="medium" title="WMTS瓦片加载">
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
import { useTilesLoaderStore } from '@/stores/tilesLoader';
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
const tilesLoaderStore = useTilesLoaderStore()

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
        tilesLoaderStore.init(viewer.value as Viewer)
        open()
    } else {
        tilesLoaderStore.destroy(viewer.value as Viewer)
    }
}

onBeforeUnmount(() => {
    tilesLoaderStore.destroy(viewer.value as Viewer)
});
const code = `
----------------------------template代码----------------------------------
<div class="measureContainer">
    <Panel size="medium" title="WMTS瓦片加载">
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
----------------------------script代码----------------------------------
import { useViewerStore } from '@/stores/cesiumStore'
import { storeToRefs } from 'pinia';
import { onBeforeUnmount,ref,watch } from 'vue';
import { Viewer } from 'cesium';
import { useTilesLoaderStore } from '@/stores/tilesLoader';
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
const tilesLoaderStore = useTilesLoaderStore()

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
        tilesLoaderStore.init(viewer.value as Viewer)
        open()
    } else {
        tilesLoaderStore.destroy(viewer.value as Viewer)
    }
}

onBeforeUnmount(() => {
    tilesLoaderStore.destroy(viewer.value as Viewer)
});
----------------------------仓库代码----------------------------------
import type { Viewer } from "cesium";
import { defineStore } from "pinia";
import { UrlTemplateImageryProvider, Cartesian3, Math as CesiumMath, ImageryLayer, Color } from 'cesium'
interface stateType {
    layer: null | ImageryLayer
}

export const useTilesLoaderStore = defineStore('tilesLoader', {
    state: (): stateType => ({
        layer:null
    }),
    actions: {
        init(viewer: Viewer) {
            if (!viewer) {
                return
            }
            const position = Cartesian3.fromDegrees(
                120.170748622423,
                35.94259894562,
                10000,
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
            let provider = new UrlTemplateImageryProvider({
                url: "/tiles/upc/{z}/{x}/{y}.png",
            })
            this.layer = new ImageryLayer(provider)
            this.layer.colorToAlpha = new Color(120 / 255, 136 / 255, 118 / 255, 1.0)
            viewer.imageryLayers.add(this.layer)
        },
        
        destroy(viewer: Viewer) {
            this.layer && viewer.imageryLayers.remove(this.layer)
            this.layer = null
        },
    }
})
----------------------------css代码----------------------------------
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