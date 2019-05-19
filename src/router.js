import Vue from 'vue';
import Router from 'vue-router';
import Login from './views/Login.vue';
import bindAuthenticator from './views/bind-authenticator.vue';

Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'Login',
            component: Login,
        },
        {
            path: '/bind-authenticator',
            name: 'bind-authenticator',
            component: bindAuthenticator,
        },
        // {
        //   path: '/about',
        //   name: 'about',
        //   // route level code-splitting
        //   // this generates a separate chunk (about.[hash].js) for this route
        //   // which is lazy-loaded when the route is visited.
        //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
        // },
    ],
});
