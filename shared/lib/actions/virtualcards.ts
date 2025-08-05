import { AxiosInstance } from 'axios';

import VirtualCardBalanceRecord from '@lib/records/virtual_card_balance';

export interface PendingAuthorization {
  authorization_id: string;
  created_at: string;
  expiration_date: string;
  amount: number;
  entry_type: 'DEBIT' | 'CREDIT';
  fraud_score: string;
  approved: boolean;
  external_request_id: string;
  external_parent_request_id: string | null;
  external_message_type: string;
  external_reference: string;
  mcc: string;
  reason_code: string;
  network: string;
  merchant_name: string;
  card?: {
    last_four: string;
  };
}

export interface PendingAuthorizationsResponse {
  pending_total: number;
  authorizations: PendingAuthorization[];
}

const baseUrl = '/api/mobile/virtualcard';

export const getBalance = async (api: AxiosInstance) => {
  const resp = await api.get(`${baseUrl}/balance`);

  return new VirtualCardBalanceRecord(resp.data);
};

export const addFunds = async (api: AxiosInstance, amount: number) => {
  return await api.put(`${baseUrl}/funds`, { amount });
};

export const getPendingAuthorizations = async (
  api: AxiosInstance,
  companyId: string
): Promise<PendingAuthorizationsResponse> => {
  if (!companyId) {
    throw new Error('Company ID is required');
  }

  const resp = await api.get(`${baseUrl}/pending_authorizations`);
  return resp.data;
};
