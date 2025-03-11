import { removeNulls } from '@lib/utils/record_utils';

export default class VirtualCardBalanceRecord {
  external_card_id: string;
  amount: number;
  next_sweep_at: string;

  constructor(data) {
    const cleanedData = removeNulls(data);
    Object.assign(
      this,
      cleanedData,
    );
  }
}

