import Vue from 'vue';
import Component from 'vue-class-component';

import App from './App.vue';
import store from './store';
import vuetify from './plugins/vuetify';
import router from './router';

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate',
]);

Vue.config.productionTip = false;

new Vue({
  store,
  vuetify,
  router,
  render: (h) => h(App),
}).$mount('#app');
