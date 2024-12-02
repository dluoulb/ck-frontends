import UserRecord from '@lib/records/user';

export const getUser = async (api, id) => {
  if (!id) return null;

  const user = await api.get(`/api/users/${id}`);
  return new UserRecord(user?.data.data.attributes) || null;
};

export const getUserByEmail = async (api, email, include = '') => {
  const user = await api.get(`/api/users?filter[email]=${email}&${include}`);
  return user?.data.data || null;
};

export const getCompanyUsers = async (api, companyId) => {
  const users = await api.get(`/api/users?filter[company_id]=${companyId}`);
  return users?.data?.data?.map((u) => {
    return new UserRecord(u.attributes) || null;
  });
};

export const createCompanyUser = async (api, companyId, user) => {
  const users = await api.post('/api/users', {
    user: user,
    company_id: companyId,
  });
  return users?.data?.data;
};

export const deleteCompanyUser = async (api, user) => {
  return await api.delete(`/api/users/${user?.id}`);
};

export const validatePhone = async (api, phone_number) => {
  return await api.post('/api/users/0/validate_phone_number', {
    phone_number: phone_number,
  });
};
