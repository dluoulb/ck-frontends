import { useQuery } from '@tanstack/react-query';
import useApi from '@hooks/useApi';
import { getVirtualCard } from '@lib/actions/companies';
import { useUser } from '@contexts/UserContext';

function useCompanyVirtualCard() {
  const api = useApi();
  const { user } = useUser();

  const {
    data: virtualCard,
    error: virtualCardError,
    isLoading: virtualCardLoading,
    isRefetching: virtualCardRefetching,
    refetch: refetchVirtualCard,
  } = useQuery({
    queryKey: ['company_virtual_card', user.company_id],
    queryFn: () => getVirtualCard(api, user.company_id),
    enabled: true,
    retry: 1,
  });

  return {
    virtualCard,
    virtualCardError,
    virtualCardLoading,
    virtualCardRefetching,
    refetchVirtualCard,
  };
}
export default useCompanyVirtualCard;
