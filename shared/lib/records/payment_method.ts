import { removeNulls } from '../utils/record_utils';

export default class PaymentMethodRecord {
  id: string | null;
  user_id: string | null;
  account_id: string | null;
  payment_type: string;
  label: string;
  account_holder?: string;
  bank_name?: string;
  bank_account?: string;
  bank_routing?: string;
  status: string;
  is_default: boolean;

  constructor(data) {
    Object.assign(this, removeNulls(data));
  }

  get payment_method_label() {
    return this.label || this.account_holder;
  }

  get payment_method_last_4() {
    return this.bank_account.slice(-4) || this.label.slice(-4);
  }

  get credit_card_masked() {
    return `x${this.label.slice(-4)}`;
  }

  get credit_card_type() {
    return this.label.substring(0, 4);
  }

  get account_number_masked() {
    return (
      this.bank_account.slice(0, -4).replace(/./g, '*') +
      this.payment_method_last_4
    );
  }
}
