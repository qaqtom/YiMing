import type { Viewer } from "cesium";
import { defineStore } from "pinia";
import { Cartesian3, Math as CesiumMath, Primitive } from 'cesium'
import { addScene } from "./addScene";
import type { Ref } from "vue";
import url from '@/baseURL'
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
                url: `${url}/upc-png/233.png`,
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