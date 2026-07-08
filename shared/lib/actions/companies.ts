import { CardStatus, CardType } from '@lib/constants/Enums';
import { jitEnabled } from '@lib/constants/SiteVariables';
import CompanyRecord from '@lib/records/company';
import CompanyVirtualCardRecord from '@lib/records/company_virtual_card';

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
  const updatedCompany = await api.put(`/api/companies/${company?.id}?${filters}`, company);

  return new CompanyRecord(updatedCompany);
};

export const updateRechargeTerm = async (api, company, merchant_id, term) => {
  if (!company) return;
  const updatedCompany = await api.put(`/api/companies/${company.id}/recharge_term`, {
    merchant_id,
    term,
  });

  return new CompanyRecord(updatedCompany);
};

export const getVirtualCards = async (api, company_id) => {
  if (!company_id) return;

  const allowedStatuses = [
    CardStatus.ACTIVE,
    CardStatus.STOLEN,
    CardStatus.SUSPEND,
    CardStatus.PENDING,
  ];
  const resp = await api.get(`/api/companies/${company_id}/virtual_cards/all`, {
    params: {
      status: allowedStatuses,
    },
  });

  if (resp?.data?.cards) {
    return resp.data.cards.map((card) => new CompanyVirtualCardRecord(card));
  }
  return null;
};

export const getVirtualCardToken = async (api, company_id, card_id) => {
  if (!company_id) return;
  if (!card_id) return;
  const resp = await api.get(`/api/companies/${company_id}/virtual_cards/${card_id}/token`);

  return resp?.data?.token;
};

export const createVirtualCard = async (api, company_id) => {
  if (!company_id) return;
  const options = {
    type: CardType.VIRTUAL,
    just_in_time_funding: jitEnabled,
  };
  const resp = await api.post(`/api/companies/${company_id}/virtual_cards`, options);

  return new CompanyVirtualCardRecord(resp.data.virtual_card);
};

export const createPhysicalCard = async (api, company_id) => {
  if (!company_id) return;
  const options = {
    type: CardType.PHYSICAL,
    just_in_time_funding: jitEnabled,
  };
  const resp = await api.post(`/api/companies/${company_id}/virtual_cards`, options);

  return new CompanyVirtualCardRecord(resp.data.virtual_card);
};

export const activatePhysicalCard = async (api, company_id, card_id, last_four) => {
  return api.post(`/api/companies/${company_id}/virtual_cards/${card_id}/activation`, {
    last_four,
  });
};

export const closeVirtualCard = async (api, company_id) => {
  if (!company_id) return;
  await api.put(`/api/companies/${company_id}/virtual_cards/close_active`);

  return true;
};

export const createLimitIncreaseRequest = async (
  api,
  company_id,
  requested_amount,
  comments = '',
) => {
  if (!company_id) return;

  return api.post(`/api/companies/${company_id}/limit_increase_requests`, {
    limit_increase_request: {
      requested_amount,
      comments,
    },
  });
};

export const uploadCompanyDocument = async (api, company_id, file, file_type, file_description) => {
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
