<template>
  <v-card
    elevation="1"
    class="mb-10"
  >
    <v-card-title>Данные</v-card-title>
    <v-data-table
      v-model="currentTicker"
      :headers="headers"
      :items="filteredTickers"
      :loading="loading"
      single-select
      item-key="ticker"
      show-select
    >
      <template #[`item.dif`]="{ item }">
        {{ getDifferenceValue(item) }}
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, VModel } from 'vue-property-decorator';
import type { Ticker } from '@/tools/types';
import { binarySearch } from '@/tools';

export type Filter = {
  startDate: number | null;
  endDate: number | null;
  types: string[];
};

@Component
export default class TData extends Vue {
  @VModel({ required: true }) ticker!: Ticker | null;
  @Prop({ required: true }) filter!: Filter;
  @Prop({ required: true }) loading!: boolean;
  @Prop({ default: [] }) tickers!: Ticker[];

  headers = [
    { text: 'Тикер', value: 'ticker' },
    { text: 'Название компании', value: 'name' },
    {
      text: 'Тип компании',
      value: 'type',
    },
    { text: 'Страна', value: 'county' },
    { text: 'Изменение за период', value: 'dif' },
  ];

  get currentTicker() {
    return this.ticker ? [this.ticker] : [];
  }

  set currentTicker(tickers: Ticker[]) {
    if (tickers.length > 0) [this.ticker] = tickers;
    else this.ticker = null;
  }

  get filteredTickers(): Ticker[] {
    const companyTypes: Record<string, boolean> = {};
    this.filter.types.forEach((name) => {
      companyTypes[name] = true;
    });

    if (this.filter.types.length == 0) return this.tickers;

    return this.tickers.filter((ticker) => companyTypes[ticker.type]);
  }

  getDifferenceValue({ series }: Ticker) {
    if (this.filter.startDate && this.filter.endDate) {
      const startValue = binarySearch(series, this.filter.startDate);
      const endValue = binarySearch(series, this.filter.endDate);

      return (endValue - startValue).toFixed(2);
    }

    return (series[series.length - 1].value - series[series.length - 2].value).toFixed(2);
  }
}
</script>

<style lang="scss">
.t-filter .t-filter__inner {
  display: grid;
  grid-auto-flow: row;
  gap: 10px;
  grid-template-columns: 3fr 1fr 1fr;
  padding: 25px;
}
</style>
