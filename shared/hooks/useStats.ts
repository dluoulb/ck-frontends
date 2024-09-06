import { useQuery } from '@tanstack/react-query';

import useApi from '@hooks/useApi';
import { getStats } from '@lib/actions/entities';

function useStats(entity, shouldFetch = false) {
  const api = useApi();

  const {
    data: stats,
    error: statsError,
    isLoading: statsLoading,
  } = useQuery({
    queryKey: ['stats', entity?.id],
    queryFn: () => getStats(api, entity),
    enabled: !!entity && shouldFetch,
    retry: 1,
  });

  return {
    stats,
    statsError,
    statsLoading,
  };
}
export default useStats;
