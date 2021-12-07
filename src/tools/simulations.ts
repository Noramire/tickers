import store from '@/store';
import { User, Ticker } from './types';

/**
 * Симулирует запрос к бэкенду с помощью почты и пароля.
 *
 * @param {string} email      почта.
 * @param {string} password   пароль.
 * @returns вернет пользователя, если данные правильные, иначе - null.
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
 * Симулирует валидацию пользователя.
 *
 * @param {string} [email] почта.
 * @returns вовзращает true, если валидация верна.
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

/**
 * Симулирует запрос к бэкенду для получения data.json.
 *
 * @returns возвращает содержание data.json.
 */
const getData = async () => {
  if (await validateUser()) {
    const response = new Promise<Partial<Ticker>[]>((res) => {
      setTimeout(async () => {
        const r = await fetch('/data.json', { method: 'GET' });
        res(await r.json());
      }, 1000);
    });

    return response;
  }

  return [];
};

export {
  authenticateUser,
  validateUser,
  getData,
};
