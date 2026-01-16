import { useQuery } from '@tanstack/react-query';

import useApi from '@hooks/useApi';
import { getRewardPointsBalance, getRewardPointsLedger } from '@lib/actions/plus';

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

export function useRewardPointsLedger(companyId: string) {
  const api = useApi();

  const {
    data: rewardPointsLedger,
    error: rewardPointsLedgerError,
    isPending: rewardPointsLedgerLoading,
    refetch: refetchRewardPointsLedger,
  } = useQuery({
    queryKey: ['rewardPointsLedger', companyId],
    queryFn: () => getRewardPointsLedger(api, companyId),
    enabled: !!companyId,
    retry: 1,
  });

  return {
    rewardPointsLedger,
    rewardPointsLedgerError,
    rewardPointsLedgerLoading,
    refetchRewardPointsLedger,
  };
}
