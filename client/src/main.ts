import "./index.css";

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// import 'highlight.js/styles/stackoverflow-light.css'
// import hljs from 'highlight.js/lib/core';
// import javascript from 'highlight.js/lib/languages/javascript';
// import hljsVuePlugin from "@highlightjs/vue-plugin";

// hljs.registerLanguage('javascript', javascript);
import 'highlight.js/styles/atom-one-dark.css'
import 'highlight.js/lib/common'
import hljsVuePlugin from '@highlightjs/vue-plugin'




const app = createApp(App)
// app.component("hljsVuePlugin", hljsVuePlugin);//全局注册
app.use(hljsVuePlugin)
app.use(createPinia())
app.use(router)
app.mount('#app')
