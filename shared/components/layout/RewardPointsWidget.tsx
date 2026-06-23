import React from 'react';

import { useEntity } from '@contexts/EntityContext';
import { useRewardPointsBalance } from '@hooks/useReward';

export default function RewardPointsWidget() {
  const { entity } = useEntity();
  const { rewardPointsBalance, rewardPointsBalanceLoading, rewardPointsBalanceError } =
    useRewardPointsBalance(entity?.id);

  if (!entity) return null;

  if (rewardPointsBalanceLoading) {
    return <span className="font-semibold">- - - points</span>;
  }

  const postedPoints = Number(rewardPointsBalance?.posted ?? 0);
  const pendingPoints = Number(rewardPointsBalance?.pending ?? 0);
  const totalPoints = postedPoints + pendingPoints;

  return <span className="font-semibold">{totalPoints.toLocaleString('en-US')} points</span>;
}
