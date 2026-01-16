import React from 'react';

import RewardsBalanceCard from '@apps/borrower/components/plus/RewardsBalanceCard';
import RewardsActivityTable from '@apps/borrower/components/rewards/RewardsActivityTable';
import Loading from '@components/Loading';
import { useEntity } from '@contexts/EntityContext';
import { useRewardPointsBalance, useRewardPointsLedger } from '@hooks/useReward';
import { useActiveSubscription } from '@hooks/useSubscription';

export default function Rewards() {
  const { entity } = useEntity();

  const { activeSubscription, activeSubscriptionLoading, refetchActiveSubscription } =
    useActiveSubscription(entity?.id);

  const { rewardPointsBalance, rewardPointsBalanceLoading, rewardPointsBalanceError } =
    useRewardPointsBalance(entity?.id);

  const { rewardPointsLedger, rewardPointsLedgerLoading, rewardPointsLedgerError } =
    useRewardPointsLedger(entity?.id);

  if (rewardPointsBalanceLoading) {
    return <Loading className="w-14 h-14 my-20" />;
  }

  const pendingPoints = rewardPointsBalance?.pending || 0;
  const postedPoints = rewardPointsBalance?.posted || 0;
  const lifetimePoints = rewardPointsBalance?.lifetime || 0;

  return (
    <div
      data-testid="rewards-container"
      className="my-4 md:my-6 mx-auto h-full xl:max-w-[90%]"
      role={Rewards.role}
    >
      <h1 className="text-2xl font-bold text-primary capitalize mb-6">Rewards</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <RewardsBalanceCard
          rewardPointsBalanceLoading={rewardPointsBalanceLoading}
          rewardPointsBalanceError={rewardPointsBalanceError}
          pendingPoints={pendingPoints}
          postedPoints={postedPoints}
          lifetimePoints={lifetimePoints}
          manage={true}
        />
      </div>

      <div className="mt-6">
        <RewardsActivityTable
          activeSubscription={activeSubscription}
          transactions={rewardPointsLedger || []}
          loading={rewardPointsLedgerLoading && activeSubscriptionLoading}
          error={rewardPointsLedgerError}
        />
      </div>
    </div>
  );
}

Rewards.role = 'rewards-page';
