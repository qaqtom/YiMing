//router/index.js
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/components/Login.vue';
import Register from '@/components/Register.vue';
import HomePage from '@/components/HomePage.vue';
import CaseInquiry from '@/components/Inquire.vue';
import Correct from '@/components/Correct.vue';
import CaseModification from '@/components/CaseLibraryEntry.vue';
import SystemManagement from '@/components/SystemManagement.vue';
import App from '@/App.vue'; // 使用 `@` 表示项目的 src 目录


// 定义路由
const routes = [
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/', component: HomePage, meta: { requiresAuth: true, allowedRoles: ['user', 'admin','superadmin'] } },
    { path: '/homepage', component: HomePage, meta: { requiresAuth: true, allowedRoles: ['user', 'admin','superadmin'] } },
    { path: '/inquire', component: CaseInquiry, meta: { requiresAuth: true, allowedRoles: ['user', 'admin','superadmin'] } },
    { path: '/correct', component: Correct, meta: { requiresAuth: true, allowedRoles: ['user', 'admin','superadmin'] } },
    { path: '/caselibraryentry', component: CaseModification, meta: { requiresAuth: true, allowedRoles: ['user', 'admin','superadmin'] } },
    { path: '/systemmanagement', component: SystemManagement, meta: { requiresAuth: true, allowedRoles: ['admin','superadmin'] } },
    { path: '/:pathMatch(.*)*', redirect: '/login' } // 对应 Vue 3 的通配符路由
];

// 创建路由实例
const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

// 导航守卫：检查是否需要认证和角色
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!token) {
            next('/login');
        } else if (to.matched.some(record => record.meta.allowedRoles && !record.meta.allowedRoles.includes(user.role))) {
            next('/homepage'); // Redirect to homepage if no permission
        } else {
            next();
        }
    } else {
        next();
    }
});

// 创建并挂载 Vue 应用
const app = createApp(App);

// 使用路由
app.use(router);

// 挂载应用
app.mount('#app');

export default router;
