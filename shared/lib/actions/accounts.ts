import AccountRecord from '@lib/records/account';

export const getAccount = async (api, accountID) => {
  if (!accountID) return;
  const account = await api.get(`/api/pi4/accounts/${accountID}`);
  
  return new AccountRecord({
    ...account.data.data.attributes,
    type: account.data.data.type,
  });
};


export const uploadConsumerDocument = async(api, account_id, file, file_type, file_description) => {
  if (!account_id) return;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('file_type', file_type);
  formData.append('file_description', file_description);

  await api.post(`/api/pi4/accounts/${account_id}/documents`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return true;
}