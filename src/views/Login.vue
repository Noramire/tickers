<template>
  <v-main class="blue lighten-5">
    <v-container
      fill-height
    >
      <v-layout
        align-center
        justify-center
      >
        <t-form />
      </v-layout>
    </v-container>
  </v-main>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import TForm from '@/components/TForm.vue';

@Component({
  components: {
    TForm,
  },
})
export default class Login extends Vue {}
</script>
