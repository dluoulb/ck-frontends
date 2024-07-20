import JsFileDownloader from 'js-file-downloader';

export const getCompanyDocuments = async (api, company) => {
  const documents = await api.get(`/api/companies/${company?.id}/documents`);
  return documents?.data.data || null;
};

export const getCompanyDocument = (company, id, token) => {
  const fileUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/companies/${company.id}/documents/${id}`;

  const agreementDownload = new JsFileDownloader({
    url: fileUrl,
    autoStart: false,
    contentType: 'application/json',
    headers: [
      { name: 'Accept', value: 'application/json' },
      { name: 'Authorization', value: `Bearer ${token}` },
    ],
  });

  return agreementDownload;
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
