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