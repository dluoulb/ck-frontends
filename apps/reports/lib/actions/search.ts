export const getSearchConfig = async (api) => {
  const response = await api.get(`/api/search_config`);
  return response?.data || { key: '', nodes: [] };
};