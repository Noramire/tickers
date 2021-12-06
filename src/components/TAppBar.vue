<template>
  <v-app-bar
    color="indigo darken-2"
    dark
    absolute
    shrink-on-scroll
    prominent
    :scroll-target="'#' + scrollTarget"
  >
    <v-app-bar-nav-icon />
    <v-app-bar-title>
      Инструменты
    </v-app-bar-title>
    <v-spacer />
    <v-menu
      bottom
      left
      rounded
      offset-y
    >
      <template #activator="{ on, attrs }">
        <v-btn
          icon
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          link
          @click="logout"
        >
          <v-list-item-title>Выйти из аккаунта</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { REMOVE_USER } from '@/store/mutation-types';

@Component({
  props: { scrollTarget: String },
})
export default class TAppBar extends Vue {
  logout() {
    this.$store.commit(REMOVE_USER);
    this.$router.push({ name: 'Login' });
  }
}
</script>
