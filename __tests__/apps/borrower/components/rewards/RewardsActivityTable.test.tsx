import React from 'react';

import RewardsActivityTable from '@apps/borrower/components/rewards/RewardsActivityTable';
import { RewardTransactionRecord, RewardType } from '@lib/records/reward';
import { customRender, screen, within } from '@lib/testing/test-utils';

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
    expect(screen.queryByText(/\(\$/)).not.toBeInTheDocument();
  });

  test('shows order amount header and redeemed points with usd value', () => {
    const transactions = [
      new RewardTransactionRecord({
        id: 'tx_order',
        type: RewardType.IN_NETWORK,
        status: 'posted',
        amount: 100,
        points: 300,
        source: 'Order #1234',
        created_at: '2026-05-02T00:00:00.000Z',
      }),
      new RewardTransactionRecord({
        id: 'tx_spent',
        type: RewardType.SPENT,
        status: 'posted',
        points: 500,
        source: 'Points Redemption',
        created_at: '2026-05-03T00:00:00.000Z',
      }),
    ];

    customRender(
      <RewardsActivityTable
        activeSubscription={null}
        transactions={transactions}
        loading={false}
      />,
    );

    expect(screen.getByText('Order Amount')).toBeInTheDocument();
    expect(screen.queryByText(/^Amount$/)).not.toBeInTheDocument();
    expect(screen.getByText('$100.00')).toBeInTheDocument();
    const redemptionRow = screen.getByText('Points Redemption').closest('tr');

    expect(redemptionRow).not.toBeNull();
    expect(
      within(redemptionRow as HTMLElement).getByText(
        (_, element) => element?.tagName === 'SPAN' && element?.textContent === '-500 pts ($5.00)',
      ),
    ).toBeInTheDocument();
  });

  test('shows empty state messaging for non-subscribed users without rewards', () => {
    customRender(
      <RewardsActivityTable activeSubscription={null} transactions={[]} loading={false} />,
    );

    expect(screen.queryByText('Join Credit Key Plus')).not.toBeInTheDocument();
    expect(screen.getByText('No rewards activity found')).toBeInTheDocument();
  });
});
