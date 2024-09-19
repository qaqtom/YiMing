import { fileURLToPath, URL } from 'node:url'
import cesium from 'vite-plugin-cesium';

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'


//按需导入组件
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

//按需导入图标
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue(),
    cesium(),
    AutoImport({
      resolvers: [
        ElementPlusResolver(),
        //自动导入图标组件
        IconsResolver({ prefix: 'Icon' }),
      ]
    }),
    Components({
      resolvers: [
        //自动注册图标组件
        IconsResolver({ enabledCollections: ['ep'] }),
        ElementPlusResolver()
      ]
    }),

    Icons({
      autoInstall: true
    })
  ],
  css: {
    preprocessorOptions: {
      less: {
        math: "always", // 括号内才使用数学计算
        globalVars: {
          // 全局变量
          mainColor: "red",
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
