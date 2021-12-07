import type { Episode } from './types';

/**
 * Бинарный поиск в упорядоченном множестве.
 * Необходимо для нахождения ближайшего тикера со
 * сложностью O(log N).
 *
 * @param {Episode[]} series тикеры.
 * @param {number} time искомая дата.
 * @returns {number} значение тикера во время даты time или ближайшего зн-я к ней.
 */
export const binarySearch = (series: Episode[], time: number): number => {
  let min = 0;
  let max = series.length - 1;
  let guess = -1;

  while (min <= max) {
    guess = Math.floor((min + max) / 2);

    if (series[guess].date == time) {
      return series[guess].value;
    }

    if (series[guess].date < time) {
      min = guess + 1;
    } else {
      max = guess - 1;
    }
  }

  if (max < 0) {
    return series[min].value;
  }

  if (min >= series.length) {
    return series[max].value;
  }

  return Math.abs(series[min].date - time) < Math.abs(time - series[max].date)
    ? series[min].value
    : series[max].value;
};
