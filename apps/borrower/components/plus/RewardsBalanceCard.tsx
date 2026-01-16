import React from 'react';
import Link from 'next/link';

import PrimaryButton from '@components/buttons/PrimaryButton';
import Loading from '@components/Loading';
import useModal from '@hooks/useModal';
import RedeemPointsModal from './RedeemPointsModal';

type RewardsBalanceCardProps = {
  rewardPointsBalanceLoading?: boolean;
  rewardPointsBalanceError?: any;
  pendingPoints: number;
  postedPoints: number;
  lifetimePoints: number;
  manage?: boolean;
};

export default function RewardsBalanceCard({
  rewardPointsBalanceLoading,
  rewardPointsBalanceError,
  pendingPoints,
  postedPoints,
  lifetimePoints,
  manage = false,
}: RewardsBalanceCardProps) {
  const { isModalActive, toggleModal } = useModal();

  return (
    <>
      <div className="border border-primary-gray-border rounded-md bg-[#F4F8FF] p-6 w-full">
        <div className="text-sm font-bold">Rewards Balance</div>
        <hr className="border-t border-primary-gray-border mb-3 mt-1 w-full" />
        {rewardPointsBalanceLoading ? (
          <div className="flex justify-center py-4">
            <Loading className="w-6 h-6" />
          </div>
        ) : rewardPointsBalanceError ? (
          <div className="text-red-600 text-sm">Unable to load reward points</div>
        ) : (
          <div className="flex items-center justify-between mt-4">
            <div className="space-y-2">
              <div className="text-sm">
                Pending: <span className="font-semibold">{pendingPoints} pts</span>
              </div>
              <div className="text-sm">
                Ready to redeem: <span className="font-semibold">{postedPoints} pts</span>
              </div>
              <div className="text-sm">
                Lifetime: <span className="font-semibold">{lifetimePoints} pts</span>
              </div>
            </div>
            {manage ? (
              <PrimaryButton
                buttonText="Redeem"
                buttonColor="bg-primary-blue"
                hoverClass="hover:bg-primary-blue-hover"
                onClick={toggleModal}
                disabled={postedPoints <= 0}
              />
            ) : (
              <Link
                href="/rewards"
                className="px-6 py-2 rounded-md text-white text-sm font-semibold bg-primary-blue hover:bg-primary-blue-hover"
              >
                Manage Rewards
              </Link>
            )}
          </div>
        )}
      </div>
      <RedeemPointsModal
        isModalActive={isModalActive}
        toggleModal={toggleModal}
        availablePoints={postedPoints}
      />
    </>
  );
}
