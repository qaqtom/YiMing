//vue.config.js
const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        // pathRewrite: { '^/api': '' }, // 可选: 如果你希望去掉路径前缀
      },
      // '/ws': {
      //   target: 'ws://127.0.0.1:5000',
      //   ws: true,
      //   changeOrigin: true,
      //   pathRewrite: { '^/ws': '' }, // 可选: 如果你希望去掉路径前缀
      // }
    },
  }
});
