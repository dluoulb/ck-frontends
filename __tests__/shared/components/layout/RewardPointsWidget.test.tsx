import React from 'react';

import RewardPointsWidget from '@components/layout/RewardPointsWidget';
import { useEntity } from '@contexts/EntityContext';
import { useRewardPointsBalance } from '@hooks/useReward';
import { customRender, screen } from '@lib/testing/test-utils';

jest.mock('@contexts/EntityContext');
jest.mock('@hooks/useReward');

const mockUseEntity = useEntity as jest.MockedFunction<typeof useEntity>;
const mockUseRewardPointsBalance = useRewardPointsBalance as jest.MockedFunction<
  typeof useRewardPointsBalance
>;

describe('RewardPointsWidget', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseEntity.mockReturnValue({
      entity: { id: 'company_1' } as any,
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    });
  });

  test('shows posted + pending points in the top nav widget', () => {
    mockUseRewardPointsBalance.mockReturnValue({
      rewardPointsBalance: { posted: 11855, pending: 1372, lifetime: 13227 } as any,
      rewardPointsBalanceLoading: false,
      rewardPointsBalanceError: null,
      refetchRewardPointsBalance: jest.fn(),
    });

    customRender(<RewardPointsWidget />);

    expect(screen.getByText('13,227 points')).toBeInTheDocument();
  });

  test('displays sum of posted and pending points when pending is zero', () => {
    mockUseRewardPointsBalance.mockReturnValue({
      rewardPointsBalance: { posted: 11855, pending: 0, lifetime: 11855 } as any,
      rewardPointsBalanceLoading: false,
      rewardPointsBalanceError: null,
      refetchRewardPointsBalance: jest.fn(),
    });

    customRender(<RewardPointsWidget />);

    expect(screen.getByText('11,855 points')).toBeInTheDocument();
  });
});
