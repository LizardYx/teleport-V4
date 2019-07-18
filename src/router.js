import Vue from 'vue';
import Router from 'vue-router';
import store from "./store/store";

Vue.use(Router);

function lazyLoadView(viewAddress) {
    return () => import(/* webpackChunkName: "view-request" */ `./views/${viewAddress}.vue`);
}

function initCommonVuex() {
    store.commit('common/updateLogin', localStorage.getItem('isLogin'));
    store.commit('common/updateToken', localStorage.getItem('token'));
    store.commit('common/updateUserInfo', localStorage.getItem('userInfo'));
}

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'login',
            meta: {
                needLogin: false
            },
            component: lazyLoadView('login'),
        },{
            path: '/bind-oath',
            name: 'bind-oath',
            meta: {
                needLogin: false
            },
            component: lazyLoadView('bind-oath'),
        },{
            path: '/modules-main',
            name: 'modules-main',
            meta: {
                needLogin: true
            },
            component: lazyLoadView('modules/main'),
        }
    ],
});

//路由守卫，权限验证
router.beforeEach((to, from, next) =>{
    initCommonVuex();
    if (to.meta.needLogin) { //判断该路由是否需要登录权限
        if (store.state.common.isLogin) {
            next(); //执行跳转
        }else { //无权限，跳转登录页面
            next({
                path: '/',
            })
        }
    }else {
        next(); //执行跳转
    }
});

export default router;
