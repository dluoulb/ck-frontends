import { removeNulls } from '@lib/utils/record_utils';

export default class CreditCardTransactionRecord {
  external_card_id: string;
  amount: string;
  transaction_id: string;
  authorization_id: string | null;
  card_id: number;
  card_last_four: string;
  description: string;
  merchant_name: string;
  mcc: string;
  reference_number: string;
  transaction_type: string;

  constructor(data) {
    Object.assign(this, removeNulls(data));
  }
}
