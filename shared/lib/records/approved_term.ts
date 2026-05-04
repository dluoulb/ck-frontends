import { removeNulls } from '@lib/utils/record_utils';

export default class ApprovedTermRecord {
  available: boolean;
  term: number;
  term_period: string;
  rate?: number;
  monthly_payment?: string;
  total_amount?: string;
  total_fees?: string;

  constructor(data) {
    Object.assign(this, removeNulls(data));
  }
}
