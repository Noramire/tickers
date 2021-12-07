<template>
  <apex-charts
    ref="chart"
    type="line"
    :options="options"
    :series="series"
  />
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch, Ref } from 'vue-property-decorator';
import ApexCharts from 'vue-apexcharts';
import { ApexOptions } from 'apexcharts';
import { Ticker, Filter } from '@/tools';

@Component({
  components: {
    'apex-charts': ApexCharts,
  },
})
export default class TChart extends Vue {
  @Ref() readonly chart: any;
  @Prop({ required: true }) filter!: Filter;
  @Prop({ required: true }) ticker!: Ticker | null;

  options: ApexOptions = {
    xaxis: {
      type: 'datetime',
    },
    fill: {
      type: 'gradient',
    },
    tooltip: {
      x: {
        format: 'dd MMM yyyy',
      },
    },
    annotations: { xaxis: [{}, {}] },
  };

  series: any[] = [];

  mounted() {
    if (this.ticker) {
      this.onTickerChanged(this.ticker);
      this.updateAnnotations();
    }
  }

  @Watch('ticker')
  onTickerChanged(ticker: Ticker) {
    if (ticker == null) return;

    this.series = [{
      name: 'series',
      data: ticker.series.flatMap((episode) => [[episode.date, episode.value]]),
    }];
  }

  @Watch('filter')
  updateAnnotations() {
    const xaxis = [];

    if (this.filter.startDate) {
      xaxis.push({
        x: this.filter.startDate,
        label: { text: 'Дата: начало' },
      });
    }

    if (this.filter.endDate) {
      xaxis.push({
        x: this.filter.endDate,
        label: { text: 'Дата: конец' },
      });
    }

    this.chart.updateOptions({
      annotations: {
        xaxis,
      },
    });
  }
}
</script>
