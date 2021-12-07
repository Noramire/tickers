<template>
  <v-card
    elevation="1"
    color="indigo"
    class="mb-10 t-filter"
    dark
    flat
  >
    <div
      class="t-filter__inner"
    >
      <v-select
        v-model="types"
        :items="typesItems"
        flat
        filled
        multiple
        solo-inverted
        label="Тип компании"
        hide-details
      >
        <template #selection="{ item }">
          <v-chip v-if="filter.types.length <= 2">
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
        @blur="onStartDateBlured"
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
        @blur="onEndDateBlured"
      />
    </div>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import moment from 'moment';
import { Prop, VModel } from 'vue-property-decorator';
import type { Filter } from '@/tools/types';

@Component
export default class TFilter extends Vue {
  @VModel({ required: true }) filter!: Filter;
  @Prop({ default: [] }) typesItems!: string[];
  @Prop({ required: true }) minDate!: number;
  @Prop({ required: true }) maxDate!: number;

  startDate = '';
  endDate = '';

  mounted() {
    this.startDate = moment(this.filter.startDate).format('YYYY-MM-DD');
    this.endDate = moment(this.filter.endDate).format('YYYY-MM-DD');
  }

  get types() {
    return this.filter.types;
  }

  set types(types: string[]) {
    this.filter = { ...this.filter, types };
  }

  onStartDateBlured() {
    const startDate = moment(this.startDate, 'YYYY-MM-DD', true);

    if (startDate.isValid()) {
      const date = Math.min(
        Math.max(startDate.valueOf(), this.minDate),
        this.filter.endDate ?? this.maxDate,
      );

      this.filter = { ...this.filter, startDate: date };
      this.startDate = moment(date).format('YYYY-MM-DD');
      return;
    }

    this.startDate = '';
    this.filter = { ...this.filter, startDate: null };
  }

  onEndDateBlured() {
    const endDate = moment(this.endDate, 'YYYY-MM-DD', true);

    if (endDate.isValid()) {
      const date = Math.min(
        Math.max(endDate.valueOf(), this.filter.startDate ?? this.minDate),
        this.maxDate,
      );

      this.filter = { ...this.filter, endDate: date };
      this.endDate = moment(date).format('YYYY-MM-DD');
      return;
    }

    this.endDate = '';
    this.filter = { ...this.filter, endDate: null };
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
