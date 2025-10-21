/**
 * Format a dollar value using standard browser built-ins
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat
 */
export const formatCurrency = (value, removeDecimal = false) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: removeDecimal ? 0 : undefined,
    maximumFractionDigits: removeDecimal ? 0 : undefined,
  }).format(value || 0);
};

export const formatPercent = (value) => {
  if (value === undefined) {
    return;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
  }).format(value / 100);
};

export const normalizePhone = (value) => {
  if (!value) return;
  if (parseInt(value[0]) === 1) {
    return value.substr(1);
  } else if (value[0] === '+') {
    return value.substr(2);
  }
  return value;
};

export const deNormalizePhone = (value) => {
  if (!value) return;
  return `+1${value.replace(/\D/g, '')}`;
};

export const daysAsMonths = (days) =>
  days <= 90 ? `${days} days` : `${days / 30} months`;

export const formatPhoneNumber = (value) => {
  var cleaned = ('' + value).replace(/\D/g, '');
  var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return null;
};

export const formatZip = (value) => {
  if (value === undefined) {
    return;
  }

  if (value.length > 5) {
    return value.substring(0, 5);
  }

  return value;
};

export function getDaySuffix(day: number): string {
  if (day >= 11 && day <= 13) return 'th';
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

export function formatBillingCycleDay(day: number): string {
  return `${day}${getDaySuffix(day)}`;
}

export const getTermDisplay = (term) => {
  if (term.default_term?.term_period === 'days') return '30 Days';
  if (
    term.default_term?.term_period === 'biweekly' &&
    term.default_term?.term === 4
  )
    return 'Pi4';

  if (term.default_term?.term > 1) {
    return `${term.default_term?.term} Months`;
  } else {
    return `${term.default_term?.term} Month`;
  }
};

export const formatCardNumber = (lastFour: string) => {
  return `•••• •••• •••• ${lastFour}`;
};

export const getTermLabel = (term, defaultText = 'Select Default Term') => {
  if (!term) return defaultText;

  if (term?.term_period === 'biweekly' && term?.term === 4) {
    return 'Pi4';
  }
  return term?.term?.toString() || '';
};
