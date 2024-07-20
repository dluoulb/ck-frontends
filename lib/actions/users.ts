export const getUser = async (api, id) => {
  const user = await api.get(`/api/users/${id}`);
  return user?.data.data || null;
};