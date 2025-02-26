import PaymentMethodRecord from '@lib/records/payment_method';

export const createLinkToken = async (api): Promise<string> => {
  const response = await api.post('/api/plaid/create_link_token');

  return response?.data?.link_token;
};

export const setAccessToken = async (api, publicToken): Promise<boolean> => {
  await api.post('/api/plaid/set_access_token', {
    public_token: publicToken,
  });

  return true;
};
