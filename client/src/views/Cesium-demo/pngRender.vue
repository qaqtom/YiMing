<template>
    <HightCode :code/>
    <div class="pngRenderContainer">
        <Panel size="medium" title="png拉伸渲染">
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
        <ColorLegend id="legend" v-if="legendVisible" :colors="colorBarConfig?.colors" :max="colorBarConfig?.max"
            :min="colorBarConfig?.min" :unit="colorBarConfig?.unit" style="opacity: 0.7;"></ColorLegend>
    </div>
</template>

<script setup lang="ts">
import { useViewerStore } from '@/stores/cesiumStore'
import { storeToRefs } from 'pinia';
import { onBeforeUnmount,ref } from 'vue';
import { Viewer } from 'cesium';
import { usePngRenderStore } from '@/stores/pngRenderStore';
import HightCode from '@/components/Code/Code.vue';
import ColorLegend from '@/components/ColorLegend.vue'
interface ColorLegendType {
    colors: string[],
    max: number,
    min: number,
    unit: string,
}
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
const pngRenderStore = usePngRenderStore()
const legendVisible = ref(false)
const colorBarConfig = ref<ColorLegendType>({
    colors: [],
    max: 0,
    min: 0,
    unit:'',
})

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
        pngRenderStore.init(viewer.value as Viewer,colorBarConfig)
        open()
        legendVisible.value = true
    } else {
        pngRenderStore.destroy(viewer.value as Viewer)
        legendVisible.value = false
    }
}

onBeforeUnmount(() => {
    pngRenderStore.destroy(viewer.value as Viewer)
});
const code = `
-------------------------------template代码-------------------------------
<div class="pngRenderContainer">
    <Panel size="medium" title="png拉伸渲染">
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
    <ColorLegend id="legend" v-if="legendVisible" :colors="colorBarConfig?.colors" :max="colorBarConfig?.max"
        :min="colorBarConfig?.min" :unit="colorBarConfig?.unit" style="opacity: 0.7;"></ColorLegend>
</div>
-------------------------------script代码-------------------------------
import { useViewerStore } from '@/stores/cesiumStore'
import { storeToRefs } from 'pinia';
import { onBeforeUnmount,ref } from 'vue';
import { Viewer } from 'cesium';
import { usePngRenderStore } from '@/stores/pngRenderStore';
import HightCode from '@/components/Code/Code.vue';
import ColorLegend from '@/components/ColorLegend.vue'
interface ColorLegendType {
    colors: string[],
    max: number,
    min: number,
    unit: string,
}
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
const pngRenderStore = usePngRenderStore()
const legendVisible = ref(false)
const colorBarConfig = ref<ColorLegendType>({
    colors: [],
    max: 0,
    min: 0,
    unit:'',
})

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
        pngRenderStore.init(viewer.value as Viewer,colorBarConfig)
        open()
        legendVisible.value = true
    } else {
        pngRenderStore.destroy(viewer.value as Viewer)
        legendVisible.value = false
    }
}

onBeforeUnmount(() => {
    pngRenderStore.destroy(viewer.value as Viewer)
});
-------------------------------仓库代码-------------------------------
import type { Viewer } from "cesium";
import { defineStore } from "pinia";
import {  Cartesian3, Math as CesiumMath, Primitive } from 'cesium'
import { addScene } from "./addScene";
import type { Ref } from "vue";
interface stateType {
    primitive: null | Primitive
}
interface ColorLegendType {
    colors: string[],
    max: number,
    min: number,
    unit: string,
}
type LegendType = Ref<ColorLegendType>

export const usePngRenderStore = defineStore('pngRender', {
    state: (): stateType => ({
        primitive: null
    }),
    actions: {
        async init(viewer: Viewer, colorBarConfig: LegendType) {
            if (!viewer) {
                return
            }
            const position = Cartesian3.fromDegrees(
                120.170748622423,
                35.94259894562,
                7000,
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
            
            viewer.scene.globe.depthTestAgainstTerrain = false;
            this.primitive = await addScene({
                viewer,
                url: '/upc-png/233.png',
                colorRange: "ndvi",
                colorBarConfig
            })
        },

        destroy(viewer: Viewer) {
            this.primitive && viewer.scene.primitives.remove(this.primitive);
            this.primitive = null
        },
    }
})
-------------------------------addScene代码-------------------------------
import type { Viewer } from "cesium"
import axios from "axios"
import { Resource } from 'cesium'
import { name2clr_arr, name2clr } from './color'
import single_VolumeRenderingPrimitive from './single_VolumeRenderingPrimitive.js'

interface option{
    viewer: Viewer,
    url: string,
    colorRange: string,
    colorBarConfig:any
}

function convertPngToJson(filePath:any) {
    if (typeof filePath !== 'string') {
        throw new Error('Input must be a string');
    }
    return filePath.replace(/\.png$/, '.json');
}  

export async function addScene(options: option) {
    let response = await axios.get(convertPngToJson(options.url))

    let jsonData = response.data
    let image = await Resource.fetchImage({ url: options.url })

    let colorScheme = name2clr_arr(options.colorRange)
    let colors = name2clr(options.colorRange)

    let primitive = new single_VolumeRenderingPrimitive(options.viewer.scene, {
        data: image,
        show: true,
        valueFilter: {
            vmax: jsonData.maxVal[0],
            vmin: jsonData.minVal[0],
        },
        colorScheme: colorScheme,
        height: 0.01,
        xGridSize: jsonData.xLen[0],
        yGridSize: jsonData.yLen[0],
        xInterval: jsonData.xCell[0],
        yInterval: -jsonData.yCell[0],
        xLength: jsonData.xLen[0] * jsonData.xCell[0],
        yLength: -jsonData.yLen[0] * jsonData.yCell[0],
        originX: jsonData.xOri[0],
        originY: jsonData.yOri[0],
    })

    options.colorBarConfig.value = {
        colors: Object.assign([], colors),
        max: jsonData.maxVal[0],
        min: jsonData.minVal[0],
        unit: jsonData.unit[0],
    }

    return options.viewer.scene.primitives.add(primitive)
}
-------------------------------color.ts代码-------------------------------
const __color_map__ = [
    { name: 'blackbody', clr: '#000000,#E60000,#E6D200,#FFFFFF,#A0C8FF' },
    { name: 'summer', clr: '#008066,#FFFF66' },

    { name: 'lightblue', clr: '#005aa7,#fffde4' },
    {
        name: 'picnic',
        clr: '#0000FF,#3399FF,#66CCFF,#99CCFF,#CCCCFF,#FFFFFF,#FFCCFF,#FF99FF,#FF66CC,#FF6666,#FF0000',
    },
    { name: 'copper', clr: '#000000,#FFA066,#FFC77F' },
    { name: 'spring', clr: '#FF00FF,#FFFF00' },
    { name: 'greys', clr: '#000000,#FFFFFF' },
    { name: 'autumn', clr: '#FF0000,#FFFF00' },
    {
        name: 'yiorrd',
        clr: '#800026,#BD0026,#E31A1C,#FC4E2A,#FD8D3C,#FEB24C,#FED976,#FFEDA0,#FFFFCC',
    },
    { name: 'earth', clr: '#000082,#00B4B4,#28D228,#E6E632,#784614,#FFFFFF' },
    { name: 'portland', clr: '#0C3383,#0A88BA,#F2D338,#F28F38,#D91E1E' },
    { name: 'bluered', clr: '#0000FF,#FF0000' },
    {
        name: 'rainbow',
        clr: '#96005A,#0000C8,#0019FF,#0098FF,#2CFF96,#97FF00,#FFEA00,#FF6F00,#FF0000',
    },
    { name: 'winter', clr: '#0000FF,#00FF80' },
    { name: 'Custom', clr: '#51853F,#E5DE50,#DEB774,#B04E39,#BA0500,#BA133A' },
    { name: 'jet2', clr: '#003CAA,#05FFFF,#FFFF00,#FA0000,#800000' },
    { name: 'jet', clr: '#000083,#003CAA,#05FFFF,#FFFF00,#FA0000,#800000' },
    { name: 'rdbu', clr: '#050AAC,#6A89F7,#BEBEBE,#DCAA84,#E6915A,#B20A1C' },
    { name: 'hot', clr: '#000000,#E60000,#FFD200,#FFFFFF' },
    {
        name: 'electric',
        clr: '#000000,#1E0064,#780064,#A05A00,#E6C800,#FFFADC',
    },
    { name: 'aqua', clr: '#00007f,#7fffff' },
    { name: 'yrb', clr: '#007fff,#ff0000,#ffff7f' },
    { name: 'torrential', clr: '#3eba3e,#61b8ff,#0001fd,#f800f8' },
    { name: 'rgb', clr: '#0000ff,#ffff00,#ff0000' },
    {
        name: 'wind',
        clr: '#003CAA,#05FFFF,#FFFF00,#FA7F00,#FA0000,#BC0000,#800000',
    },
    {
        name: 'bright',
        clr: '#0877CF,#EFF3FF,#A05146,#FFFFCC,#005A32,#F2F0F7,#4A1486,#FFFFB2,#91003F,#CDC2CE,#6E016B',
    },
    {
        name: 'temperature',
        clr: '#37385C,#394674,#3E58B1,#5CA7CF,#5A7E7A,#8AC689,#BBE32B,#E8B13A,#E04F26,#CC2A2D,#7B1F23',
    },
    {
        name: 'eledensity',
        clr: '#0E0945,#020186,#0035B9,#0085FC,#01C1FF,#88F189,#FFFF01,#FDBB00,#FF4100,#FA0001,#89280C',
    },
    {
        name: 'panoply',
        clr: '#040ED8,#2050FF,#4196FF,#6DC1FF,#86D9FF,#9CEEFF,#AFF5FF,#CEFFFF,#FFFE47,#FFEB00,#FFC400,#FF9000,#FF4800,#FF0000,#D50000,#9E0000',
    },
    {
        name: 'windgl',
        clr: '#3288bd,#66c2a5,#abdda4,#e6f598,#fee08b,#fdae61,#f46d43,#d53e4f',
    },
    {
        name: 'radar',
        clr: '#0000ef,#419df1,#64e7eb,#6dfa3d,#00d800,#019001,#ffff00,#e7c000,#ff9000,#ff0000,#d60000,#c00000,#ff00f0,#9600b4,#ad90f0',
    },
    {
        name: "white_to_green",
        clr: "#FFFFFF,#E0F8E0,#C0F0C0,#A0E8A0,#80E080,#60D060,#40B040,#20A020,#008000"
    },
    { name: 'ndvi', clr: '#FF0000,#FF6F00,#FFD700,#C0FF00,#00FF00' }
]

// 将颜色字符串（十六进制色码）转换为一个数组，
// 数组中每个元素对应于颜色的 RGB 分量，以值在 0 - 1 范围内表示
function clr2arr(clr: string[]) {
    if (!(clr instanceof Array)) {
        clr = [clr]
    }
    const arr = clr
        .join()
        .replace(/[,#]/g, '')
        .match(/.{1,2}/g) || []
    const ret = arr.map(function (i) {
        let r = 0
        try {
            r = parseInt(i, 16) / 255.0
        } catch (err) {
            console.log('🚀 ~ file: Utils.js:189 ~ ret ~ err:', err)
        }
        return r
    })
    return ret
}

//根据颜色名称查找并返回对应的颜色值
export function name2clr(colorname: string) {
    const colorItem = __color_map__.find((item) => {
        return item.name === colorname;
    });

    if (colorItem) {
        return colorItem.clr.split(',');
    }
}

//将颜色名称转换为颜色值的数组
//然后将该字符串传递给 clr2arr 函数进行处理
//这个函数总的作用就是将一堆十六进制的颜色值转为RGB数组
export function name2clr_arr(colorname: string) {
    return clr2arr(name2clr(colorname))
}
-------------------------------着色器代码-------------------------------
//#define VERT_SR 12.
#version es 300
#define VERT_SR 6.
uniform float voHeight;
uniform float origin_x;
uniform float origin_y;
uniform float x_length;
uniform float y_length;
vec2 decodeValue(vec4 cv){
    float a=(cv.r+cv.g+cv.b)/3.;
    return vec2(a,cv.w);
}
vec2 getValue(vec3 pos){
    vec2 uv=pos.xy;
    if(uIsMask&&texture(uMaskTex,uv).a<.5)
    return vec2(-1.,0.);
    return decodeValue(texture(uDataTex,(uv)).xyzw);
}

vec4 computeColorVR(float val){
    if(uIsFilter&&(val<uFilterRange.x||val>uFilterRange.y)||val<-.9)
    return vec4(0.,0.,0.,0.);
    int i=0;
    int n=int(uNColorScheme);
    for(int k=0;k<16;k++){
        if(k==n-2||uGradPos[k+1]>val){
            float vmin=uGradPos[k];
            float span=uGradPos[k+1]-vmin;
            vec3 clr=LINEAR_INTERP(uColorScheme[k],uColorScheme[k+1],(val-vmin)/span);
            return vec4(clr,1.);
        }
    }
    return vec4(0.,0.,0.,0.);
}
vec2 lnglat2grid(vec2 lnglat){
    float d=lnglat.x/czm_pi*180.-origin_x;
    float l=origin_y-lnglat.y/czm_pi*180.;
    if(d<0.){
        d=360.+d;
    }
    vec2 xy=vec2(abs(d),l);
    xy/=vec2(x_length,y_length);
    return clamp(xy,0.,1.);
}

#ifdef _VS_
out vec3 vPos;
in vec4 position;
void main(){
    vec2 lnglat=position.xy;
    float height=voHeight;
    height*=uHeightMag;
    vPos=wgs84ToCartesian(vec3(lnglat,height));
    gl_Position=czm_viewProjection*vec4(vPos,1.);
}

#endif

#ifdef _FS_
in vec3 vPos;
out vec4 fragColor;
void main(){
    vec3 cart=cartesianToWgs84(vPos);
    vec3 uvl=vec3(lnglat2grid(cart.xy),cart.z);
    vec2 val=getValue(uvl);
    vec4 nclr,clr=computeColorVR(val.x);
    float threshold=.05;// 调整这个阈值以适应你的需求
    
    // 根据阈值调整 alpha 值
    float alpha=(val.x<threshold)?0.:clr.a;
    
    // 设置 fragColor，确保过黑像素被透明
    fragColor=vec4(clr.rgb,val.y*alpha*.5);
}

#endif
-------------------------------BasePrimitive.js代码-------------------------------
-------------------------------single_VolumeRenderingPrimitives.js代码--------------
特殊原因，暂不开源
-------------------------------css代码-------------------------------
.pngRenderContainer{
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
.pngRenderContainer{
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