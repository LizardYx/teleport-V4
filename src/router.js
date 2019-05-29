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
            name: 'Login',
            component: lazyLoadView('Login'),
        },
        {
            path: '/bind-authenticator',
            name: 'bind-authenticator',
            component: lazyLoadView('bind-authenticator'),
        },
    ],
});
