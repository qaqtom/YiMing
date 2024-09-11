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
  snowStage: PostProcessStage | null,
  rainStage: PostProcessStage | null,
};