import React from 'react';

import { useEntity } from '@contexts/EntityContext';
import { useRewardPointsBalance } from '@hooks/useReward';
import { plusSupportPhone, supportEmail } from '@lib/constants/SiteVariables';
import SubscriptionRecord from '@lib/records/subscription';
import RewardsBalanceCard from './RewardsBalanceCard';

type SubscriberOverviewProps = {
  subscription: SubscriptionRecord;
};

export default function SubscriberOverview({
  subscription,
}: SubscriberOverviewProps) {
  const { entity } = useEntity();
  const memberSinceYear = subscription?.start_date
    ? new Date(subscription.start_date).getFullYear()
    : '';

  const {
    rewardPointsBalance,
    rewardPointsBalanceLoading,
    rewardPointsBalanceError,
  } = useRewardPointsBalance(entity.id);

  const pendingPoints = rewardPointsBalance?.pending || 0;
  const postedPoints = rewardPointsBalance?.posted || 0;
  const lifetimePoints = rewardPointsBalance?.lifetime || 0;

  return (
    <div className="flex flex-col gap-4 mt-2">
      <h3 className="text-lg">Member since {memberSinceYear}</h3>
      <h3 className="text-lg font-bold">Rewards Balance</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <RewardsBalanceCard
          rewardPointsBalanceLoading={rewardPointsBalanceLoading}
          rewardPointsBalanceError={rewardPointsBalanceError}
          pendingPoints={pendingPoints}
          postedPoints={postedPoints}
          lifetimePoints={lifetimePoints}
        />
        <div className="border border-primary-gray-border rounded-md bg-[#F4F8FF] p-6 w-full">
          <div className="text-sm font-bold">Credit Key Plus VIP Support</div>
          <hr className="border-t border-primary-gray-border mb-3 mt-1 w-3/4" />
          <div className="text-sm space-y-1">
            <div>
              Monday - Friday:{' '}
              <span className="font-semibold">9AM - 1PM & 2PM - 6PM CST</span>
            </div>
            <div>
              Email:{' '}
              <a
                href={`mailto:${supportEmail}`}
                className="text-primary-blue hover:text-primary-blue-hover"
              >
                {supportEmail}
              </a>
            </div>
            <div>
              Phone:{' '}
              <a
                href={`tel:${plusSupportPhone}`}
                className="text-primary-blue hover:text-primary-blue-hover"
              >
                {plusSupportPhone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
