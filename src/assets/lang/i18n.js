import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n);

const messages = {
    'zh_CN': require('./zh'),   // 中文语言包
    'en_US': require('./en')    // 英文语言包
};

const i18n =  new VueI18n({
    locale : localStorage.getItem('locale') || 'zh_CN', // set locale 默认显示中文
    messages : messages // set locale messages
});

export default i18n;
