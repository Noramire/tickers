import Vue from 'vue';
import Component from 'vue-class-component';
import VueApexCharts from 'vue-apexcharts';
import VueMask from 'v-mask';
import App from './App.vue';
import store from './store';
import vuetify from './plugins/vuetify';
import router from './router';

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate',
]);

Vue.use(VueMask);
Vue.use(VueApexCharts);
Vue.config.productionTip = false;

new Vue({
  store,
  vuetify,
  router,
  render: (h) => h(App),
}).$mount('#app');
