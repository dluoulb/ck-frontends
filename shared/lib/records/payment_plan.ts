import { DateTime } from 'luxon';

import { removeNulls } from '@lib/utils/record_utils';
import { differenceOfDays, fromISO } from '../utils/datetime_formatters';

export default class PaymentPlanRecord {
  id: string | null;
  _type?: string | null;
  name?: string | null;
  key: null;
  order_key: string | null;
  payment_plan_status: string;
  installments: string;
  amount: string;
  disbursement_date: string;
  payoff_balance: string;
  is_past_due: boolean;
  last_past_due_at: string;
  next_payment_due_date: string;
  next_payment_due_amount: string;
  interest_fee_percent: string;
  interest_free_intervals?: string | null;
  nsf_count?: string | null;
  merchant_fee_amount?: string | null;
  merchant_fee_percent?: string | null;
  processing_fee_percent?: string | null;
  settled_amount?: string | null;
  past_due_count?: string | null;
  total_amount_refunded?: string | null;
  last_payment_attempted_at?: string | null;
  payment_schedule: any[];
  transactions: any[];
  transaction_entries: any[];

  constructor(data) {
    Object.assign(this, removeNulls(data));
  }

  get progress() {
    if (['pending', 'paid'].includes(this.status)) {
      return 100;
    }
    const paidAmount = this.paid_amount;
    const amount = parseFloat(this.amount);
    return (paidAmount / amount) * 100;
  }

  get status() {
    return this.payment_plan_status;
  }

  get daysPastDue() {
    let today = DateTime.now();
    let due_date = fromISO(this.last_past_due_at.replace(' ', 'T'));

    return differenceOfDays(today, due_date);
  }

  get isPastDue() {
    return this.is_past_due === true;
  }

  get next_payment_date() {
    return this.next_payment_due_date;
  }

  get total_balance() {
    return this.payoff_balance;
  }

  get paid_amount() {
    let sum = 0;
    this.payment_schedule.forEach((schedule) => {
      if (['paid', 'pending', 'partial/pending'].includes(schedule.status)) {
        sum += parseFloat(schedule.amount);
      }
    });
    return sum;
  }

  get capture_date() {
    return this.disbursement_date;
  }
}
