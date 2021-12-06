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
        <v-card
          elevation="1"
          color="indigo"
          class="mb-10 t-toolbar"
          dark
          flat
        >
          <div
            class="t-toolbar__inner"
          >
            <v-select
              v-model="currentTypes"
              :items="typeItems"
              flat
              filled
              multiple
              solo-inverted
              label="Тип компании"
              hide-details
            >
              <template #selection="{ item }">
                <v-chip v-if="currentTypes.length <= 2">
                  {{ item }}
                </v-chip>
                <v-chip v-else>
                  {{ item.substr(0, 10) }}...
                </v-chip>
              </template>
            </v-select>
            <v-text-field
              v-model="startDate"
              v-mask="'####-##-##'"
              label="Дата: начало"
              placeholder="YYYY-MM-DD"
              persistent-hint
              flat
              filled
              solo-inverted
              hide-details
              append-icon="mdi-calendar"
              @blur="startDate = getDateMid(startDate, minDate, endDate)"
            />
            <v-text-field
              v-model="endDate"
              v-mask="'####-##-##'"
              label="Дата: конец"
              placeholder="YYYY-MM-DD"
              persistent-hint
              flat
              filled
              solo-inverted
              hide-details
              append-icon="mdi-calendar"
              @blur="endDate = getDateMid(endDate, startDate, maxDate)"
            />
          </div>
        </v-card>
        <v-card
          elevation="1"
        >
          <v-card-title>Данные</v-card-title>
          <v-data-table
            v-model="currentTickers"
            :headers="headers"
            :items="filteredTickers"
            :loading="tableLoading"
            single-select
            item-key="ticker"
            show-select
          >
            <template #[`item.dif`]="{ item }">
              {{ getDifferenceValue(item) }}
            </template>
          </v-data-table>
        </v-card>
        <v-card>
          <t-chart
            :series="currentSeries"
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
import { getData, Ticker, binarySearch, Episode } from '@/tools';

@Component({
  components: {
    TAppBar,
    TChart,
  },
})
export default class Instruments extends Vue {
  tableLoading = true;
  headers = [
    { text: 'Тикер', value: 'ticker' },
    { text: 'Название компании', value: 'name' },
    {
      text: 'Тип компании',
      value: 'type',
    },
    { text: 'Страна', value: 'county' },
    { text: 'Изменение за день', value: 'dif' },
  ];
  tickers: Ticker[] = [];
  get filteredTickers(): Ticker[] {
    const companyTypes: Record<string, boolean> = {};
    this.currentTypes.forEach((name) => {
      companyTypes[name] = true;
    });

    if (this.currentTypes.length == 0) return this.tickers;

    return this.tickers.filter((ticker) => companyTypes[ticker.type]);
  }

  typeItems: string[] = [];
  currentTypes: string[] = [];

  minDate: string = '';
  maxDate: string = '';
  async mounted() {
    const rawTickers = await getData();
    const types: Record<string, boolean> = {};

    let minDate = 0;
    let maxDate = 0;

    this.tickers = rawTickers.map((ticker) => {
      types[ticker.type] = true;

      const newTicker = {
        ...ticker,
        series: ticker.series
          .map(({ raw_date, value }) => ({
            value,
            date: moment(raw_date, 'YYYYMMDD').valueOf(),
          }))
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

    this.typeItems = Object.keys(types);
    this.minDate = moment(minDate).format('YYYY-MM-DD');
    this.maxDate = moment(maxDate).format('YYYY-MM-DD');
    this.tableLoading = false;
  }

  currentTickers: Ticker[] = [];
  get currentSeries(): Episode[] {
    return this.currentTickers.length > 0 ? this.currentTickers[0].series : [];
  }

  startDate: string = '';
  endDate: string = '';
  getDateMid(inputDate: string, minDate: string, maxDate: string) {
    const date = moment(inputDate, 'YYYY-MM-DD', true);

    let min = minDate;
    let max = maxDate;
    if (!moment(minDate).isValid()) min = this.minDate;
    if (!moment(maxDate).isValid()) max = this.maxDate;

    if (date.isValid()) {
      if (date.isBefore(min)) {
        return min;
      }

      if (date.isAfter(max)) {
        return max;
      }

      return inputDate;
    }

    return '';
  }

  getDifferenceValue({ series }: Ticker) {
    const startDate = moment(this.startDate, 'YYYY-MM-DD', true);
    const endDate = moment(this.endDate, 'YYYY-MM-DD', true);

    if (startDate.isValid() && endDate.isValid()) {
      const startValue = binarySearch(series, startDate.valueOf());
      const endValue = binarySearch(series, endDate.valueOf());

      return (endValue - startValue).toFixed(2);
    }

    return (series[series.length - 1].value - series[series.length - 2].value).toFixed(2);
  }
}
</script>

<style lang="scss">
.t-sheet {
  padding-top: 150px;
  overflow-y: auto;
  max-height: 100vh;
}

.t-toolbar .t-toolbar__inner {
  display: grid;
  grid-auto-flow: row;
  gap: 10px;
  grid-template-columns: 3fr 1fr 1fr;
  padding: 25px;
}
</style>
