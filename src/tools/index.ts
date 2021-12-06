import store from '@/store';

type User = {
  email: string;
  password?: string;
};

type Episode = {
  raw_date?: string;
  date: number;
  value: number;
};

type Ticker = {
  ticker: string;
  county: string;
  name: string;
  type: string;
  series: Episode[]
};

/**
 * симулирует запрос к бэкенду с помощью почты и пароля
 *
 * @param {string} email      почта
 * @param {string} password   пароль
 * @returns вернет пользователя, если данные правильные, иначе - null
 */
const authenticateUser = async (email: string, password: string) => {
  const response = new Promise<User | null>((res) => {
    setTimeout(() => {
      if (email.trim() == 'invest@invest.rhonda' && password.trim() == '123456') {
        res({ email: email.trim() });
      } else {
        res(null);
      }
    }, 1000);
  });

  return response;
};

/**
 * симулирует валидацию пользователя
 * тут должна быть работа с сессиями
 *
 * @param {string} [email] почта
 * @returns вовзращает true, если валидация верна
 */
const validateUser = async () => {
  const { user } = store.state;

  const response = new Promise<boolean>((res) => {
    setTimeout(() => {
      if (user?.email?.trim() == 'invest@invest.rhonda') {
        res(true);
      } else {
        res(false);
      }
    }, 100);
  });

  return response;
};

const getData = async () => {
  if (await validateUser()) {
    const response = new Promise<Ticker[]>((res) => {
      setTimeout(async () => {
        const r = await fetch('/data.json', { method: 'GET' });
        res(await r.json());
      }, 1000);
    });

    return response;
  }

  return [];
};

const binarySearch = (series: Episode[], time: number): number => {
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

  if (series.length >= 2) {
    const guess1 = series[guess + 1] ? guess + 1 : guess - 1;

    return Math.abs(series[guess].date - time)
      >= Math.abs(series[guess1].date - time)
      ? series[guess1].value
      : series[guess].value;
  }

  return series[guess].value;
};

export {
  authenticateUser,
  validateUser,
  getData,
  binarySearch,
};

export type {
  User,
  Ticker,
  Episode,
};
