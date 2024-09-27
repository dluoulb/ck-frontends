import { useQuery } from '@tanstack/react-query';

import useApi from '@hooks/useApi';
import { getApplications } from '@lib/actions/entities';

function useApplications(entity, content) {
  const api = useApi();

  const {
    data: applications,
    error: applicationsError,
    isLoading: applicationsLoading,
  } = useQuery({
    queryKey: ['applications', entity?.id],
    queryFn: () => getApplications(api, entity),
    enabled: !!entity && content !== 'orders',
    retry: false,
  });

  return {
    applications,
    applicationsError,
    applicationsLoading,
  };
}
export default useApplications;
