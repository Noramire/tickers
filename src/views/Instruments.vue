<template>
  <div class="overflow-hidden">
    <t-app-bar
      scroll-target="scrolling-techniques"
    />
    <v-sheet
      id="scrolling-techniques"
      class="t-sheet"
    >
      <v-container>
        <t-filter
          v-model="filter"

          :max-date="maxDate"
          :min-date="minDate"
          :types-items="typesItems"
        />
        <t-data
          v-model="ticker"

          :filter="filter"
          :loading="tableLoading"
          :tickers="tickers"
        />
        <v-card>
          <t-chart
            :filter="filter"
            :ticker="ticker"
          />
        </v-card>
      </v-container>
    </v-sheet>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import moment from 'moment';
import TAppBar from '@/components/TAppBar.vue';
import TChart from '@/components/TChart.vue';
import TData from '@/components/TData.vue';
import TFilter from '@/components/TFilter.vue';
import {
  getData,
  Ticker,
  Filter,
} from '@/tools';
import { SET_FILTER } from '@/store/mutation-types';

@Component({
  components: {
    TAppBar,
    TChart,
    TFilter,
    TData,
  },
})
export default class Instruments extends Vue {
  typesItems: string[] = [];

  tableLoading = true;
  ticker: Ticker | null = null;

  minDate: number = 0;
  maxDate: number = 0;
  tickers: Ticker[] = [];
  async mounted() {
    const rawTickers = await getData();
    const types: Record<string, boolean> = {};

    let minDate = 0;
    let maxDate = 0;

    this.tickers = rawTickers.map((ticker) => {
      types[(ticker.type ?? '')] = true;

      const newTicker = {
        ticker: ticker.ticker ?? '',
        county: ticker.county ?? '',
        name: ticker.name ?? '',
        type: ticker.type ?? '',
        series: (ticker.series ?? [])
          .map(({ raw_date, value }, i, array) => {
            let k = i;
            while (array[k].value == null && k > 0) {
              k -= 1;
            }

            return ({
              isValueNull: value == null,
              value: value == null ? array[k].value : value,
              date: moment(raw_date, 'YYYYMMDD').valueOf(),
            });
          })
          .sort((a, b) => (
            a.date - b.date
          )),
      };

      if (minDate == 0 || minDate > newTicker.series[0].date) {
        minDate = newTicker.series[0].date;
      }

      if (maxDate == 0 || maxDate < newTicker.series[newTicker.series.length - 1].date) {
        maxDate = newTicker.series[newTicker.series.length - 1].date;
      }

      return newTicker;
    });

    this.typesItems = Object.keys(types);
    this.minDate = minDate;
    this.maxDate = maxDate;
    this.tableLoading = false;
  }

  get filter() {
    return this.$store.state.filter;
  }

  set filter(filter: Filter) {
    this.$store.commit(SET_FILTER, filter);
  }
}
</script>

<style lang="scss">
.t-sheet {
  padding-top: 150px;
  overflow-y: auto;
  max-height: 100vh;
}
</style>
