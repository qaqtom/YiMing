<template>
    <HightCode :code/>
    <div class="climateContainer">
        <Panel size="medium" title="气候模拟">
            <div class="content">
                <div class="list">
                    <div class="item">
                        <div class="index">1</div>
                        <div class="name">雨</div>
                        <el-slider v-model="rainValue" @change="updateRain" :min="0" :max="500" />
                    </div>
                </div>
                <div class="list">
                    <div class="item">
                        <div class="index">2</div>
                        <div class="name">雪</div>
                        <el-slider v-model="snowValue" @change="updateSnow" :min="0" :max="350" />
                    </div>
                </div>
                <div class="list">
                    <div class="item">
                        <div class="index">3</div>
                        <div class="name">雾</div>
                        <el-slider v-model="fogValue" @change="updateFog" :min="0" :max="1.6" :step="0.1" />
                    </div>
                </div>
                <div class="list">
                    <div class="item">
                        <div class="index">4</div>
                        <div class="name">启动太阳光照</div>
                        <!-- <el-slider v-model="fogValue" @change="updateFog" :min="0" :max="1" :step="0.1" /> -->
                        <el-switch v-model="globalLight" @change="updateGlobalIllumination" />
                    </div>
                </div>
            </div>
        </Panel>
    </div>
</template>

<script setup lang="ts">
import Panel from '@/components/Panel.vue'
import { useClimateStore } from '@/stores/climateStore/index'
import { ref,onBeforeUnmount,onMounted, watch} from 'vue'
import { useViewerStore } from '@/stores/cesiumStore/index'
import { storeToRefs } from 'pinia'
import type { Viewer } from 'cesium'
import HightCode from '@/components/Code/Code.vue';
type Arrayable<T> = T | T[]
const climateStore = useClimateStore()
const { data } = climateStore

const viewerStore = useViewerStore()
// const viewer: Viewer = viewerStore.viewer as unknown as Viewer
const { viewer } = storeToRefs(viewerStore)

const rainValue = ref<number>(Number(data.find((climate) => climate.name === '雨')?.value));
const snowValue = ref<number>(Number(data.find((climate) => climate.name === '雪')?.value));  
const fogValue = ref<number>(Number(data.find((climate) => climate.name === '雾')?.value));  
const globalLight = ref<boolean>(Boolean(data.find((climate) => climate.name === '全球光照')?.value));

const updateRain = (value: Arrayable<number>) => {
    climateStore.updateRain(viewer.value as Viewer, value as number)
}

const updateSnow = (value: Arrayable<number>) => {
    climateStore.updateSnow(viewer.value as Viewer, value as number)
}

const updateFog = async (value: Arrayable<number>) => {
    climateStore.updateFog(viewer.value as Viewer, value as number)
}

const updateGlobalIllumination = (value:  boolean | string | number) => {
    climateStore.updateGlobalIllumination(viewer.value as Viewer, value as boolean)
}

onBeforeUnmount(()=>{
    climateStore.updateRain(viewer.value as Viewer, 0)
    climateStore.updateSnow(viewer.value as Viewer, 0)
    fogValue.value && climateStore.updateFog(viewer.value as Viewer, 0)
    climateStore.updateGlobalIllumination(viewer.value as Viewer, false)
})

const code = `
//---------------------------------vue模板代码----------------------------------------------------
<HightCode :code/>
<div class="climateContainer">
    <Panel size="medium" title="气候模拟">
        <div class="content">
            <div class="list">
                <div class="item">
                    <div class="index">1</div>
                    <div class="name">雨</div>
                    <el-slider v-model="rainValue" @change="updateRain" :min="0" :max="500" />
                </div>
            </div>
            <div class="list">
                <div class="item">
                    <div class="index">2</div>
                    <div class="name">雪</div>
                    <el-slider v-model="snowValue" @change="updateSnow" :min="0" :max="350" />
                </div>
            </div>
            <div class="list">
                <div class="item">
                    <div class="index">3</div>
                    <div class="name">雾</div>
                    <el-slider v-model="fogValue" @change="updateFog" :min="0" :max="1.6" :step="0.1" />
                </div>
            </div>
            <div class="list">
                <div class="item">
                    <div class="index">4</div>
                    <div class="name">启动太阳光照</div>
                    <el-switch v-model="globalLight" @change="updateGlobalIllumination" />
                </div>
            </div>
        </div>
    </Panel>
</div>

//---------------------------------typescript代码----------------------------------------------------
import Panel from '@/components/Panel.vue'
import { useClimateStore } from '@/stores/climateStore/index'
import { ref,onBeforeUnmount,onMounted, watch} from 'vue'
import { useViewerStore } from '@/stores/cesiumStore/index'
import { storeToRefs} from 'pinia'
import type { Viewer } from 'cesium'
import HightCode from '@/components/Code/Code.vue';
type Arrayable<T> = T | T[]
const climateStore = useClimateStore()
const { data } = climateStore

const viewerStore = useViewerStore()
// const viewer: Viewer = viewerStore.viewer as unknown as Viewer
const { viewer } = storeToRefs(viewerStore)

const rainValue = ref<number>(Number(data.find((climate) => climate.name === '雨')?.value));
const snowValue = ref<number>(Number(data.find((climate) => climate.name === '雪')?.value));  
const fogValue = ref<number>(Number(data.find((climate) => climate.name === '雾')?.value));  
const globalLight = ref<boolean>(Boolean(data.find((climate) => climate.name === '全球光照')?.value));

const updateRain = (value: Arrayable<number>) => {
    climateStore.updateRain(viewer.value as Viewer, value as number)
}

const updateSnow = (value: Arrayable<number>) => {
    climateStore.updateSnow(viewer.value as Viewer, value as number)
}

const updateFog = async (value: Arrayable<number>) => {
    climateStore.updateFog(viewer.value as Viewer, value as number)
}

const updateGlobalIllumination = (value:  boolean | string | number) => {
    climateStore.updateGlobalIllumination(viewer.value as Viewer, value as boolean)
}

onBeforeUnmount(()=>{
    climateStore.updateRain(viewer.value as Viewer, 0)
    climateStore.updateSnow(viewer.value as Viewer, 0)
    fogValue.value && climateStore.updateFog(viewer.value as Viewer, 0)
    climateStore.updateGlobalIllumination(viewer.value as Viewer, false)
})
const code = "....."

//---------------------------------仓库代码----------------------------------------------------
import { defineStore } from 'pinia'
import renderParticle from './particleSystem'
import { PostProcessStage } from 'cesium'
import { fogShader } from './glsl'
import type { Viewer } from 'cesium'
import type { IClimateState } from './type'

export const useClimateStore = defineStore('climate', {
  state: (): IClimateState => ({
    // 定义状态数据，每个气候类型都有一个默认值0
    data: [
      { name: '雨', value: 0 },
      { name: '雪', value: 0 },
      { name: '雾', value: 0 },
      { name: '全球光照', value: false },
    ],
    particleRain: null,
    particleSnow: null,
    fogStage: null,
  }),
  actions: {
    // 更新“雨”的值
    updateRain(viewer: Viewer, value: number) {
      const rainObject = this.data.find((climate: any) => climate.name === '雨')
      rainObject!.value = value
      if (rainObject!.value === 0 && this.particleRain) {
        // 用户调至0——想要移除
        viewer.scene.primitives.remove(this.particleRain);
        this.particleRain = null
        return
      }
      if (this.particleRain) {
        //已经有值了，要调整
        this.particleRain.emissionRate = value
      } else {
        //没有值，初始化
        this.particleRain = renderParticle({
          viewer,
          url: '/materials/雨滴.png',
          speed: [50, 100],
          emissionRate: value,
          fly: Boolean(value)
        });
      }
    },

    // 更新“雪”的值
    updateSnow(viewer: Viewer, value: number) {
      const snowObject = this.data.find((climate: any) => climate.name === '雪')
      snowObject!.value = value
      if (snowObject!.value === 0 && this.particleSnow) {
        viewer.scene.primitives.remove(this.particleSnow);
        this.particleSnow = null
        return
      }
      if (this.particleSnow) {
        this.particleSnow.emissionRate = value
      } else {
        this.particleSnow = renderParticle({
          viewer,
          url: "/materials/雪花.png",
          speed: [1, 10],
          emissionRate: value,
          fly: Boolean(value)
        });
      }
    },

    // 更新“雾”的值
    updateFog(viewer: Viewer, value: number) {
      const fogObject = this.data.find((climate: any) => climate.name === '雾')
      fogObject!.value = value
      if (fogObject!.value === 0 && this.fogStage) {
        viewer.scene.postProcessStages.remove(this.fogStage);
        this.fogStage = null
        return
      }
      if (this.fogStage) {
        //更新uniform
        this.fogStage.uniforms.fogFactorDenominator = (1.7 - value);
      } else {
        this.fogStage = new PostProcessStage({
          name: "fog",
          //sampleMode:PostProcessStageSampleMode.LINEAR,
          fragmentShader: fogShader,
          uniforms: {
            fogFactorDenominator: (1.7 - value), // 初始化uniform
          },
        });
        viewer.scene.postProcessStages.add(this.fogStage);
      }
    },

    // 更新“全球光照”的值
    updateGlobalIllumination(viewer: Viewer, value: boolean) {
      const globalIllumination = this.data.find((climate) => climate.name === '全球光照')
      globalIllumination!.value = value
      viewer.scene.globe.enableLighting = value;
    },
  },
})


//---------------------------------粒子代码(已封装成ts文件)-----------------------------------
import {
  Cartesian3,
  Matrix4,
  ParticleSystem,
  Particle,
  Cartesian2,
  Math as CesiumMath,
  SphereEmitter,
  Color,
} from 'cesium'

import type { particleOptionType } from './type.ts'

export default function renderParticle({
  viewer,
  url = '/雪花.png',
  speed = [10, 50],
  position = Cartesian3.fromDegrees(120.17118065585795, 35.94180290187531, 2000),
  fly = false,
  snowRadius = 3000.0,
  emissionRate = 100.0,
  minimumSnowImageSize = new Cartesian2(10, 10),
  maximumSnowImageSize = new Cartesian2(20, 20),
}: particleOptionType) {
  function snowUpdate(particle: Particle) {
    //计算提供的笛卡尔坐标系的标准化形式
    /**
     * @param 参数1 ----要标准化的笛卡尔坐标
     * @param 参数2 ----结果存储对象
     */
    Cartesian3.normalize(particle.position, snowGravityScratch)
    Cartesian3.multiplyByScalar(
      snowGravityScratch, //要缩放的笛卡尔坐标
      CesiumMath.randomBetween(-speed[0], -speed[1]), 
      snowGravityScratch
    )
    Cartesian3.add(particle.position, snowGravityScratch, particle.position)
  }

  const modelMatrix: Matrix4 = Matrix4.fromTranslation(position)
  //创建Cartesian3对象，用于在粒子系统回调函数中动态更新例子的位置
  const snowGravityScratch = new Cartesian3()
  type ParticleSystemType = ConstructorParameters<typeof ParticleSystem>[0]
  const snowOption: ParticleSystemType = {
    modelMatrix: modelMatrix,
    lifetime: 15.0,
    emitter: new SphereEmitter(snowRadius),
    startScale: 0.5,
    endScale: 1.0,
    image: url,
    emissionRate: emissionRate,
    startColor: Color.WHITE.withAlpha(1.0),
    endColor: Color.WHITE.withAlpha(0.5),
    minimumImageSize: minimumSnowImageSize,
    maximumImageSize: maximumSnowImageSize,
    updateCallback: snowUpdate,
  }
  const particle = new ParticleSystem(snowOption)
  viewer.scene.primitives.add(particle)
  if (fly) {
    viewer.camera.flyTo({
      destination: position,
    })
  }

  return particle
}
//---------------------------------着色器（雾）----------------------------------------------------
export const fogShader = '
#version 300 es
precision highp float;
uniform sampler2D colorTexture;
uniform sampler2D depthTexture;
uniform float fogFactorDenominator; // 新增的uniform
in vec2 v_textureCoordinates;
out vec4 fragColor;

void main(void)
{
  vec4 origcolor = texture(colorTexture, v_textureCoordinates);
  vec4 fogcolor = vec4(0.8, 0.8, 0.8, 0.5);

  float depth = czm_readDepth(depthTexture, v_textureCoordinates);
  vec4 depthcolor = texture(depthTexture, v_textureCoordinates);

  float f = (depthcolor.r - 0.22) / fogFactorDenominator; // 使用uniform
  if (f < 0.0) f = 0.0;
  else if (f > 1.0) f = 1.0;

  fragColor = mix(origcolor, fogcolor, f);
}
'
//---------------------------------ts类型----------------------------------------------------
import type { Viewer, Cartesian3, Cartesian2, ParticleSystem, PostProcessStage } from 'cesium'

export interface particleOptionType {
  viewer: Viewer
  url?: string
  speed?: [number, number]
  position?: Cartesian3
  fly?: Boolean
  emissionRate?: number
  snowRadius?: number
  minimumSnowImageSize?: Cartesian2
  maximumSnowImageSize?: Cartesian2
}

export interface IClimateState {
  data: {
    name: string;
    value: number | boolean;
  }[],
  particleRain: ParticleSystem | null,
  particleSnow: ParticleSystem | null,
  fogStage: PostProcessStage | null,
};


`
</script>

<style lang="less" scoped>
.climateContainer{
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
