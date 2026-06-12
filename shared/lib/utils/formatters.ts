/**
 * Format a dollar value using standard browser built-ins
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat
 */
export const formatCurrency = (value, removeDecimal = false, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: removeDecimal ? 0 : undefined,
    maximumFractionDigits: removeDecimal ? 0 : undefined,
  }).format(value || 0);
};

export const formatCurrencyPreventNegative = (value, removeDecimal = false, currency = 'USD') => {
  return formatCurrency(Math.max(value, 0), removeDecimal, currency);
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

export const daysAsMonths = (days) => (days <= 90 ? `${days} days` : `${days / 30} months`);

export const formatPhoneNumber = (value) => {
  const cleaned = ('' + value).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
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
  return getTermLabel(term?.default_term, '');
};

export const formatCardNumber = (lastFour: string) => {
  return `•••• •••• •••• ${lastFour}`;
};

export const getTermLabel = (term, defaultText = 'Select Default Term') => {
  if (!term) return defaultText;

  if (term?.term_period === 'days') {
    return `Net ${term.term}`;
  }

  if (term?.term_period === 'biweekly' && term?.term === 4) {
    return 'Pay in 4';
  }

  if (term?.term_period === 'monthly') {
    const count = Number(term.term);
    return `${count} ${count === 1 ? 'month' : 'months'}`;
  }

  return term?.term?.toString() || '';
};

export const formatInstallments = (installments: number, defaultText = '—'): string => {
  if (!installments) return defaultText;

  if (installments === 4) {
    return 'Pay in 4';
  }

  return `${installments} ${installments === 1 ? 'month' : 'months'}`;
};

export const formatCreditTransactionAmount = (value, entryType) => {
  const absoluteValue = Math.abs(value);
  const isCredit = entryType === 'CREDIT' || entryType === 'credit';
  return formatCurrency(isCredit ? -absoluteValue : absoluteValue);
};
