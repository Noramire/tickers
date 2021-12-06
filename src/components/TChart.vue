<template>
  
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import ApexCharts from 'vue-apexcharts';
import { Episode } from '@/tools';

@Component({
  components: {
    'apex-charts': ApexCharts,
  },
  props: {
    series: Array,
  },
})
export default class TChar extends Vue {

}
</script>
