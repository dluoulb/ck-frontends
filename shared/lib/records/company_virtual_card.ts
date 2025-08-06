import { removeNulls } from '@lib/utils/record_utils';

export default class CompanyVirtualCardRecord {
  id: string | null;
  created_at: string;
  external_card_id: string;
  external_person_id: string;
  external_company_id: string | null;
  external_consumer_id: string | null;
  last_four: string;
  company_name: string;
  pci_token: string;
  status: string;
  next_sweep_at: string;
  just_in_time_funding: boolean;
  constructor(data) {
    const cleanedData = removeNulls(data);
    Object.assign(
      this,
      cleanedData,
    );
  }
}

