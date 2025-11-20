import { useQuery } from '@tanstack/react-query';

import useApi from '@hooks/useApi';
import { getRewardPointsBalance } from '@lib/actions/plus';
import RewardPointsRecord from '@lib/records/reward';

export function useRewardPointsBalance(companyId: string) {
  const api = useApi();

  const {
    data: rewardPointsBalance,
    error: rewardPointsBalanceError,
    isPending: rewardPointsBalanceLoading,
    refetch: refetchRewardPointsBalance,
  } = useQuery({
    queryKey: ['rewardPointsBalance', companyId],
    queryFn: () => getRewardPointsBalance(api, companyId),
    enabled: !!companyId,
    retry: 1,
  });

  return {
    rewardPointsBalance,
    rewardPointsBalanceError,
    rewardPointsBalanceLoading,
    refetchRewardPointsBalance,
  };
}