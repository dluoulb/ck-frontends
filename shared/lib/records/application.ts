import { DateTime } from 'luxon';

import { normalizePhone } from '@lib/utils/formatters';
import { removeNulls } from '@lib/utils/record_utils';
import AddressRecord from './address';
import BeneficialOwnerRecord from './beneficial_owner';

export default class ApplicationRecord {
  id: string | null;
  _type: string | null;
  created_at: string | null;
  business_type: string | null;
  is_authorized_signer: boolean;
  first_name: string | null;
  last_name: string | null;
  ein: string | null;
  email: string | null;
  phone: string | null;
  business_address: AddressRecord | {};
  business_phone: string | null;
  birthdate: string | null;
  company_name: string | null;
  dba: string | null;
  raw_annual_revenue: string | null;
  personal_address: AddressRecord | {};
  ssn: string | null;
  status: string | null;
  tier: string | null;
  gross_annual_revenue: string | null;
  interest_percent: number;
  beneficial_owners: any[];
  are_additional_owners_confirmed: boolean;
  applied_with_merchant: string | null;
  approved_credit_limit: string | null;
  previous_tcl: string | null;
  sells_restricted_products: false;
  has_authorized_purchaser: false;
  reasons: any[];
  ofac_status: string | null;
  fico_score: string | null;
  applicant_ip_address: string | null;
  equifax_request_date: string | null;
  latest_submission_date: string | null;
  original_submission_date: string | null;
  pended_at: string | null;
  phone_change_attempts: number;
  modelshop_decision: string | null;

  constructor(data) {
    const cleanedData = removeNulls(data);
    Object.assign(this, cleanedData);

    if (cleanedData.business_address) {
      this.business_address = new AddressRecord(cleanedData.business_address);
    }

    if (cleanedData.personal_address) {
      this.personal_address = new AddressRecord(cleanedData.personal_address);
    }

    if (cleanedData.birthdate) {
      const birthdate = DateTime.fromISO(cleanedData.birthdate).toLocaleString(
        DateTime.DATE_SHORT
      );

      if (birthdate.isValid) {
        this.birthdate = birthdate.toFormat('yyyy-MM-dd');
      }
    }

    if (cleanedData.phone) this.phone = normalizePhone(cleanedData.phone);

    if (cleanedData.business_phone)
      this.business_phone = normalizePhone(cleanedData.business_phone);

    const owners = [];
    if (cleanedData.beneficial_owners) {
      cleanedData.beneficial_owners.forEach((bo) => {
        owners.push(new BeneficialOwnerRecord(bo));
      });
    }
    this.beneficial_owners = [owners];
  } 

  get applicant_full_name() {
    return `${this.first_name || ''} ${this.last_name || ''}`.trim();
  }
}
