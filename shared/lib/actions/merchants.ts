import MerchantRecord from '@lib/records/merchant';

export const getMerchant = async (api, merchant_id) => {
  if (!merchant_id) return;
  const merchant = await api.get(`/api/merchants/${merchant_id}`);
  return new MerchantRecord(merchant.data.data.attributes);
};

export const acceptMerchantInvite = async (api, slug) => {
  if (!slug) return;
  const merchant = await api.post('/api/merchants/accept_merchant_company_connect_invite', {
    slug,
  });
  return new MerchantRecord(merchant.data.data.attributes);
};
