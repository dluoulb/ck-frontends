import { removeNulls } from '@lib/utils/record_utils';

export default class SubscriptionPlanRecord {
  id: string;
  name: string;
  price: number;
  description: string;
  currency: string;
  duration: number;
  is_active: boolean;
  created_at: string;
  days_until_first_payment?: number;

  constructor(data) {
    Object.assign(this, removeNulls(data));
  }
}
