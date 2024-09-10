import { removeNulls } from '../utils/record_utils';

export default class BeneficialOwnerRecord {
  id: null;
  first_name: string | null;
  last_name: string | null;
  dob: string | null;
  ssn: string | null;
  email: string | null;
  address: {
    address1: string | null;
    city: string | null;
    state: string | null;
    zip: '';
  };
  constructor(data) {
    Object.assign(this, removeNulls(data));
  }
  get full_name() {
    return `${this.first_name || ''} ${this.last_name || ''}`.trim();
  }
}
