import { removeNulls } from '@lib/utils/record_utils';

export default class RewardPointsRecord {
  id: string;
  external_company_id: string;
  pending: number;
  posted: number;
  lifetime: number;

  constructor(data) {
    Object.assign(this, removeNulls(data));
  }
}