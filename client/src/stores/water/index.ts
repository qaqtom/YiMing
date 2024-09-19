import type { Geometry, Viewer } from "cesium";
import { defineStore } from "pinia";
import {
    EllipsoidTerrainProvider, Cartesian3, Math as CesiumMath,
    PolygonGeometry, PolygonHierarchy, GeometryInstance,
    ColorGeometryInstanceAttribute, Color, ShowGeometryInstanceAttribute,
    Primitive, EllipsoidSurfaceAppearance, Material
} from 'cesium'
import axios from 'axios'
import url from '@/baseURL'
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
            const response = await axios.get(`${url}/json/shandon_water.geojson`);
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
                        id: `polygon-${i}`,
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
                                    normalMap: `${url}/materials/waterNormals.jpg`,
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