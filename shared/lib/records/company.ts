import {
  amazonPhysicalCardTest,
  amazonPhysicalCardTestEnabled,
  plusEnabled,
} from '@lib/constants/SiteVariables';
import { removeNulls } from '@lib/utils/record_utils';
import AddressRecord from './address';
import CreditLine from './credit_line';
import MerchantRecord from './merchant';
import UserRecord from './user';

export default class CompanyRecord {
  underwriting?: {
    plaid_item_id?: string | null;
  };
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
  min_rate?: string | number;
  max_rate?: string | number;
  credit_line: CreditLine;
  is_bank_connected: boolean;
  is_bank_connection_pending: boolean;
  cta_banners: any[];
  vc_sub_limits: Record<string, any>;
  latest_approval_date: string;
  address: AddressRecord;
  borrower: UserRecord;
  recharge_settings: any[];
  promo_id: string;
  merchant_applied_with: MerchantRecord;
  orders_count: number;
  active_cohorts: string[];
  active_cohorts_by_type?: Record<string, string>;

  constructor(data) {
    const cleanedData = removeNulls(data);
    const assignableData = cleanedData.underwriting
      ? {
          ...cleanedData,
          underwriting: Object.fromEntries(
            Object.entries(cleanedData.underwriting).filter(
              ([key]) => key !== 'plaid_access_token',
            ),
          ),
        }
      : cleanedData;

    const normalizedData = {
      ...assignableData,
      ...(assignableData.is_bank_connected !== undefined && {
        is_bank_connected:
          assignableData.is_bank_connected === true || assignableData.is_bank_connected === 'true',
      }),
      ...(assignableData.is_bank_connection_pending !== undefined && {
        is_bank_connection_pending:
          assignableData.is_bank_connection_pending === true ||
          assignableData.is_bank_connection_pending === 'true',
      }),
    };

    Object.assign(
      this,
      Object.fromEntries(Object.entries(normalizedData).filter(([key]) => key !== 'status')),
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
      this.merchant_applied_with = new MerchantRecord(cleanedData.merchant_applied_with);
    }
  }

  get status() {
    return this.underwriting_status;
  }

  get max_purchase_amount() {
    return this.credit_line.amount;
  }

  get vc_enabled() {
    // keeping this garbage for now in case we need to swap back to stripe cards
    return this.cta_banners?.find((b) => b.enabled)?.name === 'multi_use_virtual_card';
  }

  get plus_enabled() {
    return (
      plusEnabled &&
      this.underwriting_status !== 'declined' &&
      !this.isNetX &&
      !this.isAmazonExclusive
    );
  }

  get physical_card_enabled() {
    if (!amazonPhysicalCardTestEnabled) return true;
    const isInAmazonTestGroup =
      this.active_cohorts_by_type?.[amazonPhysicalCardTest.type] === amazonPhysicalCardTest.cohort;
    return !isInAmazonTestGroup;
  }

  get isAmazonExclusive() {
    return (
      this.active_cohorts_by_type?.[amazonPhysicalCardTest.type] === amazonPhysicalCardTest.cohort
    );
  }

  get isNetX() {
    return this.tier === 'NETX';
  }
}
