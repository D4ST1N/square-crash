import Vue         from 'vue';
import App         from './App.vue';
import { version } from '../package';
import getText     from './resources/utils/getText';

Vue.config.productionTip = false;
Vue.prototype.$text = getText;
window.locale = 'ua';

new Vue({
  render: h => h(App),
  data() {
    return {
      version,
    }
  },
}).$mount('#app');
