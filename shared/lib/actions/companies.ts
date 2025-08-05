import CompanyRecord from '@lib/records/company';
import CompanyVirtualCardRecord from '@lib/records/company_virtual_card';

interface CreateVirtualCardOptions {
  just_in_time_funding: boolean;
}

export const getCompany = async (api, company_id, filters = '') => {
  if (!company_id) return;
  const foundCompany = await api.get(`/api/companies/${company_id}?${filters}`);

  return new CompanyRecord({
    ...foundCompany.data.data.attributes,
    type: foundCompany.data.data.type,
  });
};

export const updateCompany = async (api, company, filters = '') => {
  if (!company) return;
  const updatedCompany = await api.put(
    `/api/companies/${company?.id}?${filters}`,
    company
  );

  return new CompanyRecord(updatedCompany);
};

export const updateRechargeTerm = async (api, company, merchant_id, term) => {
  if (!company) return;
  const updatedCompany = await api.put(
    `/api/companies/${company.id}/recharge_term`,
    { merchant_id, term }
  );

  return new CompanyRecord(updatedCompany);
};

export const getVirtualCard = async (api, company_id) => {
  if (!company_id) return;
  const resp = await api.get(`/api/companies/${company_id}/virtual_cards`);

  if (resp?.data?.virtual_card) {
    return new CompanyVirtualCardRecord(resp.data.virtual_card);
  }

  return null;
};

export const createVirtualCard = async (
  api,
  company_id,
  options: CreateVirtualCardOptions
) => {
  if (!company_id) return;
  const resp = await api.post(
    `/api/companies/${company_id}/virtual_cards`,
    options
  );

  return new CompanyVirtualCardRecord(resp.data.virtual_card);
};

export const closeVirtualCard = async (api, company_id) => {
  if (!company_id) return;
  const resp = await api.put(
    `/api/companies/${company_id}/virtual_cards/close_active`
  );

  return true;
};

export const uploadCompanyDocument = async (
  api,
  company_id,
  file,
  file_type,
  file_description
) => {
  if (!company_id) return;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('file_type', file_type);
  formData.append('file_description', file_description);

  await api.post(`/api/companies/${company_id}/documents`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return true;
};
