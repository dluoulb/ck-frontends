import { useQuery } from '@tanstack/react-query';

import useApi from '@hooks/useApi';
import { getCompanyUsers } from '@lib/actions/users';

function useCompanyUsers(entity, shouldFetch) {
  const api = useApi();

  const {
    data: companyUsers,
    error: companyUsersError,
    isLoading: companyUsersLoading,
    isRefetching: companyUsersRefetching,
    refetch: refetchCompanyUsers,
  } = useQuery({
    queryKey: ['company_users', entity?.id],
    queryFn: () => getCompanyUsers(api, entity?.id),
    enabled: !!entity && shouldFetch,
    retry: 1,
  });

  return {
    companyUsers,
    companyUsersError,
    companyUsersLoading,
    companyUsersRefetching,
    refetchCompanyUsers,
  };
}
export default useCompanyUsers;
