import { DateTime } from 'luxon';

export const differenceOfDays = (start_date, end_date) => {
  return Math.floor(
    end_date.startOf('day').diff(start_date.startOf('day'), 'days').values.days,
  );
};

export const differenceOfWeeks = (start_date, end_date) => {
  return Math.floor(
    end_date.startOf('week').diff(start_date.startOf('week'), 'weeks').values
      .weeks,
  );
};

export const differenceOfMonths = (start_date, end_date) => {
  return Math.floor(
    end_date.startOf('month').diff(start_date.startOf('month'), 'months').values
      .months,
  );
};

export const fromISO = (str) => {
  return DateTime.fromISO(str);
};

export const fromPreviousFormat = (str, previousFormat) => {
  return DateTime.fromFormat(str, previousFormat);
};

export const sortDateTimes = (d1, d2) => {
  return d1 < d2 ? -1 : d1 > d2 ? 1 : 0;
};

export const toISO = (str) => {
  return str?.replace(' ', 'T');
};

export const reformatDate = (date, returnDateTime) => {
  if (!date) return 'N/A';

  return returnDateTime ? fromISO(toISO(date)) : fromISO(toISO(date)).toLocaleString();
};
