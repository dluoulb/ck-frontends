import { useContext } from 'react';
import { MarketplaceApiContext } from 'pages/_app';

function useMarketplaceApi() {
  const api = useContext(MarketplaceApiContext);
  return api;
}

export default useMarketplaceApi;
