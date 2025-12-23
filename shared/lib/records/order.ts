import { removeNulls } from '@lib/utils/record_utils';
import LoanRecord from './loan';
import MerchantRecord from './merchant';
import PaymentPlanRecord from './payment_plan';
import CreditCardTransactionRecord from './credit_card_transaction';
import ApprovedTermRecord from './approved_term';

export default class OrderRecord {
  id: string | null;
  entity_id: string | null;
  entity_type: string;
  created_at: string;
  merchant_order_id: string | null;
  status: string;
  amount: string;
  amount_refunded: string;
  expected_interest: string;
  expected_fees: string;
  processing_fee_amount: string;
  product_type: string;
  total_balance: string;
  merchant: MerchantRecord | {};
  product: LoanRecord | PaymentPlanRecord | {};
  virtual_card_details: any[];
  transaction_type: string;
  card_transactions: CreditCardTransactionRecord[] | [];
  terms_editable: boolean;
  approved_terms: ApprovedTermRecord[] | [];

  constructor(data) {
    Object.assign(this, removeNulls(data));

    if (data.product_type === 'mambu_loan' && data.product) {
      this.product = new LoanRecord(data.product);
    } else if (data.product) {
      this.product = new PaymentPlanRecord(data.product);
    } else {
      this.product = {};
    }

    this.merchant = data.merchant ? new MerchantRecord(data.merchant) : {};
    this.card_transactions = data.card_transactions ? data.card_transactions.map(t => new CreditCardTransactionRecord(t)) : [];
    this.approved_terms = data.approved_terms ? data.approved_terms.map(term => new ApprovedTermRecord(term)) : [];
  }

  get net_amount(): number {
    const amount = parseFloat(this.amount || '0');
    const refunds = parseFloat(this.amount_refunded || '0');
    return amount - refunds;
  }
}
