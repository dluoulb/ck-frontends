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

export const reformatDate = (date, returnDateTime = false, format = 'DateTime.DATE_SHORT') => {
  if (!date) return 'N/A';

  return returnDateTime
    ? fromISO(toISO(date))
    : fromISO(toISO(date)).toLocaleString(format);
};
