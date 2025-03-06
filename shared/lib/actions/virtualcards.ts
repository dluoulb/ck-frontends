import VirtualCardBalanceRecord from "@lib/records/virtual_card_balance";

export const getBalance = async (api) => {
  const resp = await api.get(`/api/mobile/virtualcard/balance`);
  
  return new VirtualCardBalanceRecord(resp.data);
};
