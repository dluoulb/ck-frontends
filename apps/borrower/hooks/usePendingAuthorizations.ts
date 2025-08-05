import { useQuery } from '@tanstack/react-query';

import useApi from '@hooks/useApi';
import {
  getPendingAuthorizations,
  PendingAuthorizationsResponse,
} from '@lib/actions/virtualcards';

function usePendingAuthorizations(companyId?: string) {
  const api = useApi();

  const {
    data: pendingAuths,
    error: pendingAuthsError,
    isLoading: pendingAuthsLoading,
    isRefetching: pendingAuthsRefetching,
    refetch: refetchPendingAuths,
  } = useQuery<PendingAuthorizationsResponse>({
    queryKey: ['pending_authorizations', companyId],
    queryFn: () => getPendingAuthorizations(api, companyId!),
    enabled: !!companyId,
    retry: 1,
  });

  return {
    pendingAuths,
    pendingAuthsError,
    pendingAuthsLoading,
    pendingAuthsRefetching,
    refetchPendingAuths,
  };
}

export default usePendingAuthorizations;
