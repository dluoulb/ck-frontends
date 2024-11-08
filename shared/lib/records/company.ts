import { removeNulls } from '@lib/utils/record_utils';
import AddressRecord from './address';
import CreditLine from './credit_line';
import MerchantRecord from './merchant';
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
  merchant_applied_with: MerchantRecord;

  constructor(data) {
    const cleanedData = removeNulls(data);
    Object.assign(
      this,
      Object.fromEntries(
        Object.entries(cleanedData).filter(([key]) => key !== 'status')
      )
    );

    if (cleanedData.address) {
      this.address = new AddressRecord(cleanedData.address);
    }

    if (cleanedData.credit_line) {
      this.credit_line = new CreditLine(cleanedData.credit_line);
    }

    if (cleanedData.borrower) {
      this.borrower = new UserRecord(cleanedData.borrower);
    }

    if (cleanedData && cleanedData.merchant_applied_with) {
      this.merchant_applied_with = new MerchantRecord(
        cleanedData.merchant_applied_with
      );
    }
  }

  get status() {
    return this.underwriting_status;
  }

  get max_purchase_amount() {
    return this.credit_line.amount;
  }
}
