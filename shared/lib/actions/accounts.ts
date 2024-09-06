import AccountRecord from '@lib/records/account';

export const getAccount = async (api, accountID) => {
  if (!accountID) return;
  const account = await api.get(`/api/pi4/accounts/${accountID}`);
  
  return new AccountRecord({
    ...account.data.data.attributes,
    type: account.data.data.type,
  });
};
