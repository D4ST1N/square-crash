import Vue         from 'vue';
import App         from './App.vue';
import getText     from './resources/utils/getText';
import locale      from './resources/utils/localeChanger';

Vue.config.productionTip = false;
Vue.prototype.$text = getText;
locale.init();

new Vue({
  render: h => h(App),
}).$mount('#app');
