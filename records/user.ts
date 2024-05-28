import { fromJS, Record } from 'immutable';
import { normalizePhone } from '../lib/utils/formatters';
import { convertRawValues } from '../lib/utils/record_utils';

export default class UserRecord extends Record({
    id: null,
    address: {},
    first_name: '',
    last_name: '',
    suffix: '',
    email: '',
    phone_number: '',
    company_name: '',
    birthdate: '',
    role: '',
  }) {
    constructor(data) {
      data = convertRawValues(data);

      if (data && data.get('phone')) data = data.set('phone_number', normalizePhone(data.get('phone')));
      if ((data && data.get('phone_number'))) data = data.set('phone_number', normalizePhone(data.get('phone_number')));
      if (data && data.get('_id')) data = data.merge(fromJS({ id: data.get('_id').get('$oid') }));

      super(data);
    }

    get phone() {
      return this.phone_number;
    }

    get full_name() {
      return `${this.first_name || ''} ${this.last_name || ''}`.trim();
    }
  }
