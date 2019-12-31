import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/css/common.scss'
import i18n from './assets/lang/i18n'
import App from './App.vue';
import router from './router';
import store from './store/store';
import IconSvg from './components/icon-svg'
import '../public/lib/iconfont/iconfont.js'

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.component('icon-svg', IconSvg);

new Vue({
    i18n,
    router,
    store,
    render: h => h(App),
}).$mount('#app');
