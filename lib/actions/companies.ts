export const getCompanyDocuments = async (api, company) => {
  const documents = await api.get(`/api/companies/${company?.id}/documents`);
  return documents?.data.data || null;
};

export const getCompany = async (api, companyID) => {
  if (companyID) {
    const foundCompany = await api.get(`/api/companies/${companyID}`);
    return foundCompany.data.data.attributes;
  }
  return null;
};

export const getCompanyStats = async (api, companyID) => {
  if (companyID) {
    const stats = await api.get(`/api/companies/${companyID}/stats`);
    return stats.data;
  }
  return null;
};

export const getCompanyApplications = async (api, company) => {
  if (company) {
    const apps = await api.get(`/api/companies/${company?.id}/applications`);
    return apps.data.data;
  }
  return null;
};
