import type { Viewer } from "cesium";
import { defineStore } from "pinia";
import { EllipsoidTerrainProvider, Cartesian3,Math as CesiumMath } from 'cesium'
import MeasureTool from './measure.js'
interface measureType {
    data: {
        name: string;
        value: number | boolean;
    } [],
}

export const useMeasureStore = defineStore('measure', {
    state: (): measureType => ({
        data: [
            { name: '雨', value: 0 },
            { name: '雪', value: 0 },
            { name: '雾', value: 0 },
            { name: '全球光照', value: false },
        ],
    }),
    actions: {
        init(viewer: Viewer) {
            viewer.scene.terrainProvider = new EllipsoidTerrainProvider({});
            const position = Cartesian3.fromDegrees(
                120.17118065585795,
                35.94180290187531,
                2000,
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
            const measure = new MeasureTool(viewer);

            
        },
        destroy() {
            
        },
    }
})