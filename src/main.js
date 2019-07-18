import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/css/common.scss'
import App from './App.vue';
import router from './router';
import store from './store/store';

Vue.config.productionTip = false;
Vue.use(ElementUI);

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app');

// init common vuex
store.commit('common/updateLogin', localStorage.getItem('isLogin'));
store.commit('common/updateToken', localStorage.getItem('token'));
store.commit('common/updateUserInfo', localStorage.getItem('userInfo'));
