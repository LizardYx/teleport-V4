import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

function lazyLoadView(viewAddress) {
    return () => import(/* webpackChunkName: "view-request" */ `./views/${viewAddress}.vue`);
}

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'login',
            component: lazyLoadView('login'),
        },{
            path: '/bind-oath',
            name: 'bind-oath',
            component: lazyLoadView('bind-oath'),
        },{
            path: '/modules-main',
            name: 'modules-main',
            component: lazyLoadView('modules/main'),
        }
    ],
});
