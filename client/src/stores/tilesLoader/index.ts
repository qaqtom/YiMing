import type { Viewer } from "cesium";
import { defineStore } from "pinia";
import { UrlTemplateImageryProvider, Cartesian3, Math as CesiumMath, ImageryLayer, Color } from 'cesium'
interface stateType {
    layer: null | ImageryLayer
}
import url from '@/baseURL'

export const useTilesLoaderStore = defineStore('tilesLoader', {
    state: (): stateType => ({
        layer: null
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
                url: `${url}/tiles/upc/{z}/{x}/{y}.png`,
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