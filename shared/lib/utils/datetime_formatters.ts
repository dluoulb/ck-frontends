import { DateTime } from 'luxon';

export const fromISO = (str) => {
  return DateTime.fromISO(str);
};

export const sortDateTimes = (date1, date2) => {
  const d1 = fromISO(date1);
  const d2 = fromISO(date2);
  return d1 < d2 ? -1 : d1 > d2 ? 1 : 0;
};

export const toISO = (str) => {
  return str?.replace(' ', 'T');
};

export const reformatDate = (
  date,
  returnDateTime = false,
  format = 'DateTime.DATE_SHORT'
) => {
  if (!date) return 'N/A';

  return returnDateTime
    ? fromISO(toISO(date))
    : fromISO(toISO(date)).toLocaleString(format);
};

export const differenceOfDays = (start_date, end_date) => {
  return Math.floor(start_date.diff(end_date, 'days').toObject().days);
};

export const formatShortDate = (date: string) => {
  if (!date) return '';
  return DateTime.fromISO(toISO(date)).toFormat('M/d/yy');
};

export const addMonths = (date: string | Date, months: number): string => {
  let dt: DateTime;
  if (!date || typeof months !== 'number') return '';
  if (typeof date === 'string') {
    dt = DateTime.fromISO(toISO(date));
  } else if (date instanceof Date) {
    dt = DateTime.fromJSDate(date);
  } else {
    return '';
  }
  return dt.plus({ months }).toISO();
};