import { removeNulls } from '@lib/utils/record_utils';
import UserRecord from './user';

export default class AccountRecord {
  id: string | null;
  type: string | null;
  name: string;
  status: string;
  bank_verification_attempts: number;
  applicant_fico_score: string;
  tier: string;
  tier_limit: string;
  tier_limit_available: string;
  is_past_due: boolean;
  is_bank_connected: string;
  is_bank_connection_pending: string;
  user: UserRecord;

  constructor(data) {
    Object.assign(this, removeNulls(data));
  }

  get purchase_amount_in_use() {
    const limit = parseFloat(this.tier_limit);
    const available = parseFloat(this.tier_limit_available);
    return limit - available;
  }

  get max_purchase_amount() {
    return parseFloat(this.tier_limit);
  }

  get borrower() {
    return this.user;
  }
}
