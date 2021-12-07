type User = {
  email: string;
  password?: string;
};

type Episode = {
  raw_date?: string;
  date: number;
  value: number;
  isValueNull: boolean;
};

type Ticker = {
  ticker: string;
  county: string;
  name: string;
  type: string;
  series: Episode[]
};

type Filter = {
  startDate: number | null;
  endDate: number | null;
  types: string[];
};

export type {
  User,
  Ticker,
  Episode,
  Filter,
};
