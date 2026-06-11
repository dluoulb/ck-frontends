import axios from 'axios';

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

const marketplaceApi = axios.create({
  headers,
});

export default marketplaceApi;
