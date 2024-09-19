import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'

import ThreejsIndex from '../views/Threejs-demo/index.vue'
import ThreejsDemo1 from '../views/Threejs-demo/demo1.vue'
import ThreejsDemo2 from '../views/Threejs-demo/demo2.vue'


export const routes = [
  {
    path: '/',
    redirect: '/cesium',
  },
  {
    path: '/cesium',
    name: '/cesium',
    component: () => import('@//views/Cesium-demo/index.vue'),
    redirect: '/cesium/climaVis', // 默认重定向到地图视图  
    meta: {
      icon: "i-ep-menu",
      title: 'cesium'
    },
    children: [
      {
        path: 'climaVis',
        component: () => import("@/views/Cesium-demo/ClimaVis.vue"),
        meta: {
          title: '天气模拟',
          activePath: '/cesium/climaVis'
        }
      },
      {
        path: 'measure',
        component: () => import('@/views/Cesium-demo/Measure.vue'),
        meta: {
          title: '测量',
          activePath: '/cesium/measure'
        }
      },
      {
        path: 'geoJsonRender',
        component: () => import('@/views/Cesium-demo/GeoJsonRender.vue'),
        meta: {
          title: 'geojson渲染',
          activePath: '/cesium/geoJsonRender'
        }
      },
      {
        path: 'tilesLoader',
        component: () => import('@/views/Cesium-demo/TilesLoader.vue'),
        meta: {
          title: 'WTMS瓦片加载',
          activePath: '/cesium/tilesLoader'
        }
      },
      {
        path: 'pngRender',
        component: () => import('@/views/Cesium-demo/pngRender.vue'),
        meta: {
          title: 'png拉伸渲染',
          activePath: '/cesium/pngRender'
        }
      },
      {
        path: 'echartsAndTiles',
        component: () => import('@/views/Cesium-demo/EchartsAndTiles.vue'),
        meta: {
          title: '数据联动',
          activePath: '/cesium/echartsAndTiles'
        }
      },
      {
        path: 'water',
        component: () => import('@/views/Cesium-demo/Water.vue'),
        meta: {
          title: '水面渲染',
          activePath: '/cesium/water'
        }
      },
    ],
  },
  {
    path: '/threejs',
    component: ThreejsIndex,
    redirect: '/threejs/demo1', // 默认重定向到地图视图 
    meta: {
      icon: "i-ep-menu",
      title: 'threejs'
    },
    children: [
      {
        path: 'demo1',
        component: ThreejsDemo1, // Three.js 3D模型视图 
        meta: {
          title: 'demo1',
          activePath: '/threejs/demo1'
        }
      },
      {
        path: 'demo2',
        component: ThreejsDemo2, // Three.js 动画视图 
        meta: {
          title: 'demo2',
          activePath: '/threejs/demo2'
        }
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

export default router
