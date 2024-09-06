import { removeNulls } from '@lib/utils/record_utils';

export default class CreditLineRecord {
  status: string | null;
  amount: number;
  remaining_amount: number;

  constructor(data) {
    Object.assign(this, removeNulls(data));
  }
  
  get total_used() {
    return this.amount - this.remaining_amount;
  }
}
