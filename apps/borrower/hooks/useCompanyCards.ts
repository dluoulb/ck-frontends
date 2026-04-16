import { useQuery } from '@tanstack/react-query';

import { useUser } from '@contexts/UserContext';
import useApi from '@hooks/useApi';
import { getVirtualCards } from '@lib/actions/companies';

function shouldRefetchCompanyCardsOnMount(query) {
  return query.state.status === 'error';
}

function shouldRetryCompanyCards(failureCount, error) {
  const status = error?.response?.status;

  if (status && status < 500) {
    return false;
  }

  return failureCount < 1;
}

function useCompanyCards() {
  const api = useApi();
  const { user } = useUser();
  const companyId = user?.company_id;

  return useQuery({
    queryKey: ['company_cards', companyId],
    queryFn: () => getVirtualCards(api, companyId),
    enabled: !!companyId,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: shouldRefetchCompanyCardsOnMount,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retryOnMount: true,
    retry: shouldRetryCompanyCards,
  });
}

export default useCompanyCards;
