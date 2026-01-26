import { removeNulls } from '@lib/utils/record_utils';

export enum RewardPointStatus {
  PENDING = 'PENDING',
  POSTED = 'POSTED',
  CANCELED = 'CANCELED',
}

export enum RewardType {
  EARNED = 'EARNED',
  SPENT = 'SPENT',
  EXPIRED = 'EXPIRED',
  ADJUSTED = 'ADJUSTED',
  IN_NETWORK = 'IN_NETWORK',
  OUT_OF_NETWORK = 'OUT_OF_NETWORK',
}

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

export class RewardTransactionRecord {
  id: string;
  external_company_id: string;
  external_reference_id?: string;
  type: RewardType;
  status: RewardPointStatus;
  points: number;
  amount?: number;
  description?: string;
  merchant_name?: string;
  source?: string;
  created_at: string;
  pended_at?: string;
  posted_at?: string;
  canceled_at?: string;

  constructor(data) {
    Object.assign(this, removeNulls(data));
  }
}
