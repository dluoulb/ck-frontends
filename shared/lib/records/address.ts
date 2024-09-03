import { removeNulls } from '../utils/record_utils';

export default class AddressRecord {
  id: string | null;
  first_name: string;
  last_name: string;
  company_name: string;
  email: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  phone_number: string;

  constructor(data) {
    Object.assign(this, removeNulls(data));
  }

  get phone() {
    return this.phone_number;
  }

  get full_name() {
    return `${this.first_name || ''} ${this.last_name || ''}`.trim();
  }
}
