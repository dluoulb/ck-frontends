import VirtualCardBalanceRecord from "@lib/records/virtual_card_balance";

const baseUrl = '/api/mobile/virtualcard';

export const getBalance = async (api) => {
  const resp = await api.get(`${baseUrl}/balance`);
  
  return new VirtualCardBalanceRecord(resp.data);
};

export const addFunds = async (api, amount) => {
  return await api.put(`${baseUrl}/funds`, { amount });
};
