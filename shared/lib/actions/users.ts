import UserRecord from '@lib/records/user';

export const getUser = async (api, id) => {
  const user = await api.get(`/api/users/${id}`);
  return new UserRecord(user?.data.data.attributes) || null;
};
