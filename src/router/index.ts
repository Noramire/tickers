import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Instruments from '@/views/Instruments.vue';
import store from '@/store';
import { validateUser } from '@/tools';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Instruments',
    component: Instruments,
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(async (to, from, next) => {
  const { isAuthenticated } = store.getters;
  if (isAuthenticated && await validateUser()) {
    if (to.name == 'Login') next({ name: 'Instruments' });
    else next();
  } else if (to.name != 'Login') {
    next({ name: 'Login' });
  } else next();
});

export default router;
