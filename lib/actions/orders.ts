export const getOrder = async (api, id) => {
  const order = await api.get(`/api/orders/${id}`);
  return order?.data.data.attributes;
};
