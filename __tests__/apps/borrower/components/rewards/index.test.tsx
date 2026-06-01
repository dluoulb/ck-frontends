import React from 'react';

import Rewards from '@apps/borrower/components/rewards';
import { useEntity } from '@contexts/EntityContext';
import { useRewardPointsBalance, useRewardPointsLedger } from '@hooks/useReward';
import { useActiveSubscription } from '@hooks/useSubscription';
import { customRender } from '@lib/testing/test-utils';

jest.mock('@contexts/EntityContext');
jest.mock('@hooks/useReward');
jest.mock('@hooks/useSubscription');
jest.mock(
  '@apps/borrower/components/plus/RewardsBalanceCard',
  () =>
    function RewardsBalanceCardMock() {
      return <div data-testid="rewards-balance-card" />;
    },
);
jest.mock(
  '@apps/borrower/components/rewards/RewardsActivityTable',
  () =>
    function RewardsActivityTableMock() {
      return <div data-testid="rewards-activity-table" />;
    },
);

const mockUseEntity = useEntity as jest.MockedFunction<typeof useEntity>;
const mockUseRewardPointsBalance = useRewardPointsBalance as jest.MockedFunction<
  typeof useRewardPointsBalance
>;
const mockUseRewardPointsLedger = useRewardPointsLedger as jest.MockedFunction<
  typeof useRewardPointsLedger
>;
const mockUseActiveSubscription = useActiveSubscription as jest.MockedFunction<
  typeof useActiveSubscription
>;

describe('Rewards page', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseEntity.mockReturnValue({
      entity: { id: 'company_1' },
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    });

    mockUseActiveSubscription.mockReturnValue({
      activeSubscription: null,
      activeSubscriptionError: null,
      activeSubscriptionLoading: false,
      refetchActiveSubscription: jest.fn(),
    });

    mockUseRewardPointsBalance.mockReturnValue({
      rewardPointsBalance: {
        pending: 0,
        posted: 0,
        lifetime: 0,
      } as any,
      rewardPointsBalanceError: null,
      rewardPointsBalanceLoading: false,
      refetchRewardPointsBalance: jest.fn(),
    });

    mockUseRewardPointsLedger.mockReturnValue({
      rewardPointsLedger: [],
      rewardPointsLedgerError: null,
      rewardPointsLedgerLoading: false,
      refetchRewardPointsLedger: jest.fn(),
    });
  });

  test('fetches rewards ledger for non-subscribed users when they have reward points', () => {
    mockUseRewardPointsBalance.mockReturnValue({
      rewardPointsBalance: {
        pending: 10,
        posted: 0,
        lifetime: 10,
      } as any,
      rewardPointsBalanceError: null,
      rewardPointsBalanceLoading: false,
      refetchRewardPointsBalance: jest.fn(),
    });

    customRender(<Rewards />);

    expect(mockUseRewardPointsLedger).toHaveBeenCalledWith('company_1', true);
  });

  test('does not fetch rewards ledger for non-subscribed users with no reward points', () => {
    customRender(<Rewards />);

    expect(mockUseRewardPointsLedger).toHaveBeenCalledWith('company_1', false);
  });

  test('fetches rewards ledger for subscribed users', () => {
    mockUseActiveSubscription.mockReturnValue({
      activeSubscription: { id: 'sub_1' } as any,
      activeSubscriptionError: null,
      activeSubscriptionLoading: false,
      refetchActiveSubscription: jest.fn(),
    });

    customRender(<Rewards />);

    expect(mockUseRewardPointsLedger).toHaveBeenCalledWith('company_1', true);
  });
});
