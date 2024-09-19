import type { Viewer } from "cesium";
import { defineStore } from "pinia";
import { EllipsoidTerrainProvider, Cartesian3, Math as CesiumMath } from 'cesium'
import MeasureTool from './measure.js'
interface measureType {
    data: {
        name: string;
        value: boolean;
    }[],
    measure: any
}

export const useMeasureStore = defineStore('measure', {
    state: (): measureType => ({
        data: [
            { name: '空间距离', value: false },
            { name: '空间面积', value: false },
        ],
        measure: null
    }),
    actions: {
        init(viewer: Viewer) {
            if (!viewer) {
                return
            }
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
            this.measure = new MeasureTool(viewer);
        },
        updateDistance(e: boolean) {
            this.data[0].value = e
            if (e) {
                if (this.data[1].value) {
                    this.destroy()
                }
                this.measure.drawLineMeasureGraphics({
                    clampToGround: true,
                    callback: () => { },
                });
            } else {
                this.destroy()
            }
        },
        updateArea(e: boolean) {
            this.data[1].value = e
            if (e) {
                if (this.data[0].value) {
                    this.destroy()
                }
                this.measure.drawAreaMeasureGraphics({
                    clampToGround: true,
                    callback: () => { },
                });
            } else {
                this.destroy()
            }
        },
        destroy() {
            this.measure && this.measure._drawLayer.entities.removeAll();
        },
    }
})