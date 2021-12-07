/* eslint-disable no-param-reassign */
import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import Cookies from 'js-cookie';
import type { User, Filter } from '@/tools';
import { SET_USER, REMOVE_USER, SET_FILTER } from './mutation-types';

Vue.use(Vuex);

type StoreContent = {
  user: Partial<User> | null;
  filter: Filter;
};

export default new Vuex.Store<StoreContent>({
  state: {
    user: null,
    filter: {
      endDate: null,
      startDate: null,
      types: [],
    },
  },
  mutations: {
    [SET_USER]: (state, { email }: User) => {
      state.user = { email };
    },
    [REMOVE_USER]: (state) => {
      state.user = null;
    },
    [SET_FILTER]: (state, filter: Filter) => {
      state.filter = { ...filter };
    },
  },
  getters: {
    isAuthenticated: (state) => !!(state?.user?.email),
  },
  plugins: [
    createPersistedState({
      storage: {
        getItem: (key) => (Cookies.get(key)),
        setItem: (key, value) => (
          Cookies.set(key, value, { expires: 3, secure: true })
        ),
        removeItem: (key) => (Cookies.remove(key)),
      },
    }),
  ],
});
