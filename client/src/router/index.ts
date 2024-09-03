import { createRouter, createWebHistory } from 'vue-router'

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
        path: 'demo1',
        component: () => import('@/views/Cesium-demo/demo1.vue'),
        meta: {
          title: 'demo1',
          activePath: '/cesium/demo1'
        }
      }
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
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
