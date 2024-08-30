export const getCompany = async (api, company_id, filters = '') => {
  if (!company_id) return;
  const foundCompany = await api.get(`/api/companies/${company_id}?${filters}`);
  return {
    ...foundCompany.data.data.attributes,
    type: foundCompany.data.data.type,
  };
};

export const updateCompany = async (api, company, filters = '') => {
  if (!company) return;
  const updatedCompany = await api.put(
    `/api/companies/${company?.id}?${filters}`,
    company
  );

  return updatedCompany;
};
