/**
 * Format a dollar value using standard browser built-ins
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat
 */
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
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
