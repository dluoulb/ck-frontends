export const getAccount = async (api, accountID) => {
  if (accountID) {
    const account = await api.get(`/api/pi4/accounts/${accountID}`);
    return account.data.data.attributes;
  }
  return null;
};

export const getAccountDocuments = async (api, account) => {
  const documents = await api.get(`/api/pi4/accounts/${account?.id}/documents`);
  return documents?.data.data || null;
};

export const getAccountApplications = async (api, account) => {
  if (account) {
    const apps = await api.get(`/api/pi4/accounts/${account?.id}/applications`);
    return apps.data.data;
  }
  return null;
};

export const getAccountStats = async (api, accountID) => {
  if (accountID) {
    const stats = await api.get(`/api/pi4/accounts/${accountID}/stats`);
    return stats.data;
  }
  return null;
};
