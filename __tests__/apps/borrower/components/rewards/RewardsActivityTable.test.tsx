import React from 'react';

import RewardsActivityTable from '@apps/borrower/components/rewards/RewardsActivityTable';
import { RewardTransactionRecord, RewardType } from '@lib/records/reward';
import { customRender, screen } from '@lib/testing/test-utils';

describe('RewardsActivityTable', () => {
  test('shows rewards activity and plus CTA for non-subscribed users with rewards', () => {
    const transactions = [
      new RewardTransactionRecord({
        id: 'tx_1',
        type: RewardType.ADJUSTED,
        status: 'pending',
        points: 25,
        source: 'Manual Adjustment',
        created_at: '2026-05-01T00:00:00.000Z',
      }),
    ];

    customRender(
      <RewardsActivityTable
        activeSubscription={null}
        transactions={transactions}
        loading={false}
      />,
    );

    expect(screen.getByText('Join Credit Key Plus')).toBeInTheDocument();
    expect(screen.getByText('Manual Adjustment')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('+25 pts')).toBeInTheDocument();
  });

  test('shows empty state messaging for non-subscribed users without rewards', () => {
    customRender(
      <RewardsActivityTable activeSubscription={null} transactions={[]} loading={false} />,
    );

    expect(screen.queryByText('Join Credit Key Plus')).not.toBeInTheDocument();
    expect(screen.getByText('No rewards activity found')).toBeInTheDocument();
  });
});
