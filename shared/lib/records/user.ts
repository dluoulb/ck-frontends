import AddressRecord from './address';
import { normalizePhone } from '../utils/formatters';
import { removeNulls } from '../utils/record_utils';

export default class UserRecord {
  id: string | null;
  address: AddressRecord | {};
  first_name: string;
  last_name: string;
  suffix: string;
  email: string;
  phone_number: string;
  company_name: string;
  company_id: string | null;
  account_id: string | null;
  role: string;

  constructor(data) {
    Object.assign(this, removeNulls(data));

    if (data.phone) {
      this.phone_number = normalizePhone(data.phone);
    }
    if (data.phone_number) {
      this.phone_number = normalizePhone(data.phone_number);
    }
    this.address = data.address ? new AddressRecord(data.address) : {};
  }

  get full_name() {
    return `${this.first_name || ''} ${this.last_name || ''}`.trim();
  }

  get is_admin_user() {
    return ['admin', 'superadmin'].includes(this.role);
  }

  get hasAccount() {
    return !!(this.account_id && this.account_id);
  }

  get hasCompany() {
    return !!(this.company_id && this.company_id);
  }
}
