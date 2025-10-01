import { removeNulls } from '@lib/utils/record_utils';

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

export enum RepaymentStatus {
  CURRENT = 'CURRENT',
  LATE = 'LATE',
  DELINQUENT = 'DELINQUENT',
  DEFAULTED = 'DEFAULTED',
}

export default class SubscriptionRecord {
  id: string;
  plan_id: string;
  status: SubscriptionStatus;
  start_date: string;
  end_date: string;
  auto_renew: boolean;
  total_amount: number;
  paid_amount: number;
  remaining_amount: number;
  next_payment_date: string;
  repayment_status: RepaymentStatus;
  created_at: string;

  constructor(data) {
    Object.assign(this, removeNulls(data));
  }
}
