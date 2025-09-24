import { useQuery } from '@tanstack/react-query';

import { useUser } from '@contexts/UserContext';
import useApi from '@hooks/useApi';
import { getVirtualCards } from '@lib/actions/companies';

function useCompanyVirtualCard() {
  const api = useApi();
  const { user } = useUser();

  const {
    data: cards,
    error: virtualCardError,
    isLoading: virtualCardLoading,
    isRefetching: virtualCardRefetching,
    refetch: refetchVirtualCard,
  } = useQuery({
    queryKey: ['company_virtual_card', user.company_id],
    queryFn: () => getVirtualCards(api, user.company_id),
    enabled: true,
    retry: 1,
  });

  const virtualCard =
    cards?.find((card) => card.type === 'VIRTUAL' && card.is_default) || null;

  return {
    virtualCard,
    virtualCardError,
    virtualCardLoading,
    virtualCardRefetching,
    refetchVirtualCard,
  };
}
export default useCompanyVirtualCard;
