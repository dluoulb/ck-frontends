import { useQuery } from '@tanstack/react-query';

import { useUser } from '@contexts/UserContext';
import useApi from '@hooks/useApi';
import { getVirtualCards } from '@lib/actions/companies';

function useCompanyPhysicalCard() {
  const api = useApi();
  const { user } = useUser();

  const {
    data: cards,
    error: physicalCardError,
    isLoading: physicalCardLoading,
    isRefetching: physicalCardRefetching,
    refetch: refetchPhysicalCard,
  } = useQuery({
    queryKey: ['company_physical_card', user.company_id],
    queryFn: () => getVirtualCards(api, user.company_id),
    enabled: true,
    retry: 1,
  });

  const physicalCard = cards?.find((card) => card.type === 'PHYSICAL') || null;

  return {
    physicalCard,
    physicalCardError,
    physicalCardLoading,
    physicalCardRefetching,
    refetchPhysicalCard,
  };
}

export default useCompanyPhysicalCard;
