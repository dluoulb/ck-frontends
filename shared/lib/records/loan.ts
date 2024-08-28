import { DateTime } from 'luxon';

import { differenceOfDays, fromISO } from '@lib/utils/datetime_formatters';
import { removeNulls } from '@lib/utils/record_utils';

export default class LoanRecord {
  id: string | null;
  order_id: string | null;
  status: string | null;
  installments: string;
  monthly_interest: string;
  amount?: string;
  payoff_balance?: string;
  total_balance?: string;
  total_monthly_fees?: string | null;
  mambu_loan_id?: string | null;
  lifecycle_status?: string | null;
  next_payment_date?: string | null;
  last_past_due_date?: string | null;
  next_payment_amount?: string | null;
  payment_schedule: any[];

  constructor(data) {
    Object.assign(this, removeNulls(data));
  }
  get progress() {
    if (
      ['returned', 'canceled', 'error', 'declined', 'paid'].includes(
        this.status
      )
    ) {
      return 100;
    }

    const amount = parseFloat(this.amount || '0');
    const totalMonthlyFees = parseFloat(this.total_monthly_fees || '0');
    const paidAmount = this.paid_amount;

    return (paidAmount / (amount + totalMonthlyFees)) * 100;
  }

  get daysPastDue() {
    let today = DateTime.now();
    let due_date = fromISO(this.last_past_due_date);

    return differenceOfDays(today, due_date);
  }

  get isPastDue() {
    return this.lifecycle_status === 'past_due';
  }

  get next_payment_due_amount() {
    return this.next_payment_amount;
  }

  get paid_amount() {
    const amount = parseFloat(this.amount || '0');
    const totalMonthlyFees = parseFloat(this.total_monthly_fees || '0');
    const totalBalance = parseFloat(this.total_balance || '0');

    return amount + totalMonthlyFees - totalBalance;
  }
}
