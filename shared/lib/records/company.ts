import { removeNulls } from '@lib/utils/record_utils';
import AddressRecord from './address';
import CreditLine from './credit_line';
import UserRecord from './user';

export default class CompanyRecord {
  id: string | null;
  type: 'company';
  name: string;
  underwriting_status: 'unknown' | string;
  bank_verification_attempts: number;
  applicant_fico_score: string;
  quick_display: string;
  tier: string;
  ein: string;
  is_past_due: boolean;
  min_rate: string;
  max_rate: string;
  credit_line: CreditLine;
  is_bank_connected: string;
  is_bank_connection_pending: string;
  cta_banners: any[];
  vc_sub_limits: Record<string, any>;
  latest_approval_date: string;
  address: AddressRecord;
  borrower: UserRecord;
  recharge_settings: any[];
  promo_id: string;

  constructor(data) {
    Object.assign(this, removeNulls(data));

    if (data && data.address) {
      data.address = new AddressRecord(data.address);
    }

    if (data && data.credit_line) {
      data.credit_line = new CreditLine(data.credit_line);
    }

    if (data && data.borrower) {
      data.borrower = new UserRecord(data.borrower);
    }
  }

  get status() {
    return this.underwriting_status;
  }

  get max_purchase_amount(){
    return this.credit_line.amount
  }
}
