import { removeNulls } from '../utils/record_utils';

export default class PaymentRecord {
  id: string | null;
  amount: string;
  payment_method_id: string | null;
  loan_id: string;
  order_id: string;
  
  constructor(data) {
    Object.assign(this, removeNulls(data));
  }
}
