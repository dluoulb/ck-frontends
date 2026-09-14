import { formatOrderTermLabel, getTermLabel } from '@lib/utils/formatters';

describe('getTermLabel', () => {
  test('returns default text when term is null', () => {
    expect(getTermLabel(null)).toBe('Select Default Term');
  });

  test('returns custom default text when term is null', () => {
    expect(getTermLabel(null, '')).toBe('');
  });

  test('returns Net 30 for days term with term=30', () => {
    expect(getTermLabel({ term: 30, term_period: 'days' })).toBe('Net 30');
  });

  test('returns Net 60 for days term with term=60', () => {
    expect(getTermLabel({ term: 60, term_period: 'days' })).toBe('Net 60');
  });

  test('returns Net 90 for days term with term=90', () => {
    expect(getTermLabel({ term: 90, term_period: 'days' })).toBe('Net 90');
  });

  test('returns Pay in 4 for biweekly term with term=4', () => {
    expect(getTermLabel({ term: 4, term_period: 'biweekly' })).toBe('Pay in 4');
  });

  test('returns months label for monthly term', () => {
    expect(getTermLabel({ term: 3, term_period: 'monthly' })).toBe('3 months');
  });

  test('returns month label for monthly term=1', () => {
    expect(getTermLabel({ term: 1, term_period: 'monthly' })).toBe('1 month');
  });
});

describe('formatOrderTermLabel', () => {
  test('returns Pay In Full for pay now orders', () => {
    expect(formatOrderTermLabel({ product_type: 'pay_now' })).toBe('Pay In Full');
  });

  test('returns 1 month for one installment', () => {
    expect(formatOrderTermLabel({ product: { installments: 1 } })).toBe('1 month');
  });

  test('returns Pay in 4 for four installments', () => {
    expect(formatOrderTermLabel({ product: { installments: 4 } })).toBe('Pay in 4');
  });

  test('returns the default text when installments are missing', () => {
    expect(formatOrderTermLabel({})).toBe('—');
  });
});
