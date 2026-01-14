import axios from 'axios';

export const getSearchConfig = async () => {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_SUPERTOKENS_API_DOMAIN}/typesense`);
  return response?.data || { key: '', nodes: [] };
};
