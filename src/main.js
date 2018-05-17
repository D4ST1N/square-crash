import Vue         from 'vue';
import App         from './App.vue';
import { version } from '../package';

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  data() {
    return {
      version,
    }
  },
}).$mount('#app');
