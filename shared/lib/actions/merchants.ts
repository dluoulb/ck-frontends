import MerchantRecord from '@lib/records/merchant';

export const getMerchant = async (api, merchant_id) => {
  if (!merchant_id) return;
  const merchant = await api.get(`/api/merchants/${merchant_id}`);
  return new MerchantRecord(merchant.data.data.attributes);
};
