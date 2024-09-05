import { useQuery } from '@tanstack/react-query';

import useApi from '@hooks/useApi';
import { getCompany } from '@lib/actions/companies';
import { getAccount } from '@lib/actions/entities';

function useEntity(user, shouldFetch = false) {
  const api = useApi();

  const {
    data: entity,
    error: entityError,
    isRefetching: entityRefetching,
    isLoading: entityLoading,
    refetch: refetchEntity,
  } = useQuery({
    queryKey: [
      user?.company_id ? 'company' : 'account',
      user?.company_id ? user?.company_id : user?.account_id,
    ],
    queryFn: () =>
      user?.company_id
        ? getCompany(api, user?.company_id, 'include=cta_banners')
        : getAccount(api, user?.account_id),
    enabled: !!user && shouldFetch,
    retry: false,
  });

  return {
    entity,
    entityError,
    entityRefetching,
    entityLoading,
    refetchEntity,
  };
}
export default useEntity;
