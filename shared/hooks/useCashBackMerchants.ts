import { useQuery } from '@tanstack/react-query';

import useMarketplaceApi from '@hooks/useMarketplaceApi';
import { marketplace } from '@lib/actions/marketplace';
import { getTopCashbackMerchants } from '@lib/actions/merchants';

function useCashBackMerchants() {
  const api = useMarketplaceApi();
  const {
    data: cashBackMerchants = [],
    error: cashBackMerchantsError,
    isLoading: cashBackMerchantsLoading,
  } = useQuery({
    queryKey: ['cashBackMerchants'],
    queryFn: () => getTopCashbackMerchants(api),
    enabled: !!marketplace.apiUrl,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return {
    cashBackMerchants,
    cashBackMerchantsError,
    cashBackMerchantsLoading,
  };
}

export default useCashBackMerchants;
