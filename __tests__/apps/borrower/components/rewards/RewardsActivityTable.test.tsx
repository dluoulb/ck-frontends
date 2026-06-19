import React from 'react';

import RewardsActivityTable from '@apps/borrower/components/rewards/RewardsActivityTable';
import { RewardTransactionRecord, RewardType } from '@lib/records/reward';
import SubscriptionRecord, { SubscriptionStatus } from '@lib/records/subscription';
import { customRender, screen, within } from '@lib/testing/test-utils';

const makeTransaction = (overrides = {}) =>
  new RewardTransactionRecord({
    id: 'tx_1',
    type: RewardType.ADJUSTED,
    status: 'pending',
    points: 25,
    source: 'Manual Adjustment',
    created_at: '2026-05-01T00:00:00.000Z',
    ...overrides,
  });

const activeSubscription = new SubscriptionRecord({
  id: 'sub_1',
  status: SubscriptionStatus.ACTIVE,
});

describe('RewardsActivityTable', () => {
  test('shows rewards activity and plus CTA for non-subscribed users with rewards', () => {
    const transactions = [makeTransaction()];

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

  test('shows no-points upsell empty state for non-subscribed users without rewards', () => {
    customRender(
      <RewardsActivityTable activeSubscription={null} transactions={[]} loading={false} />,
    );

    expect(
      screen.getByText(/Activities you perform that earn rewards will be listed here\./),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Join Credit Key Plus' })).toHaveAttribute(
      'href',
      '/plus',
    );
    expect(
      screen.getByText(/to earn rewards on every purchase with Credit Key\./),
    ).toBeInTheDocument();
    expect(screen.queryByText('No rewards activity found')).not.toBeInTheDocument();
  });

  test('shows has-points upsell empty state for non-subscribed users without current activity', () => {
    customRender(
      <RewardsActivityTable
        activeSubscription={null}
        transactions={[]}
        hasRewardPoints={true}
        loading={false}
      />,
    );

    expect(
      screen.queryByText(/Activities you perform that earn rewards will be listed here\./),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Join Credit Key Plus' })).toHaveAttribute(
      'href',
      '/plus',
    );
    expect(
      screen.getByText(/to earn rewards on every purchase with Credit Key\./),
    ).toBeInTheDocument();
    expect(screen.queryByText('No rewards activity found')).not.toBeInTheDocument();
  });

  test('shows short upsell for previously subscribed users with affiliate points and history', () => {
    customRender(
      <RewardsActivityTable
        activeSubscription={null}
        transactions={[makeTransaction({ source: 'Order #4242' })]}
        hasRewardPoints={true}
        loading={false}
      />,
    );

    expect(
      screen.queryByText(/Activities you perform that earn rewards will be listed here\./),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Join Credit Key Plus' })).toHaveAttribute(
      'href',
      '/plus',
    );
    expect(screen.getByText('Order #4242')).toBeInTheDocument();
  });

  test('does not show the plus upsell for subscribed users with activity', () => {
    customRender(
      <RewardsActivityTable
        activeSubscription={activeSubscription}
        transactions={[makeTransaction({ source: 'Order #7777' })]}
        hasRewardPoints={true}
        loading={false}
      />,
    );

    expect(screen.queryByRole('link', { name: 'Join Credit Key Plus' })).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Activities you perform that earn rewards will be listed here\./),
    ).not.toBeInTheDocument();
    expect(screen.getByText('Order #7777')).toBeInTheDocument();
  });

  test('shows the generic empty state for subscribed users without activity', () => {
    customRender(
      <RewardsActivityTable
        activeSubscription={activeSubscription}
        transactions={[]}
        loading={false}
      />,
    );

    expect(screen.getByText('No rewards activity found')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Join Credit Key Plus' })).not.toBeInTheDocument();
  });

  test('shows the load error message instead of the empty upsell', () => {
    customRender(
      <RewardsActivityTable
        activeSubscription={activeSubscription}
        transactions={[]}
        error={new Error('boom')}
        loading={false}
      />,
    );

    expect(screen.getByText('Unable to load rewards activity')).toBeInTheDocument();
    expect(screen.queryByText('No rewards activity found')).not.toBeInTheDocument();
  });

  test('does not flash the plus upsell while loading', () => {
    customRender(
      <RewardsActivityTable activeSubscription={null} transactions={[]} loading={true} />,
    );

    expect(screen.queryByRole('link', { name: 'Join Credit Key Plus' })).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Activities you perform that earn rewards will be listed here\./),
    ).not.toBeInTheDocument();
  });

  test('shows Redeemed for spent rewards transactions', () => {
    customRender(
      <RewardsActivityTable
        activeSubscription={null}
        transactions={[
          makeTransaction({
            type: RewardType.SPENT,
            status: 'posted',
            points: 100,
            source: 'Rewards Redemption',
          }),
        ]}
        loading={false}
      />,
    );

    expect(screen.getByText('Redeemed')).toBeInTheDocument();
    expect(screen.queryByText('Posted')).not.toBeInTheDocument();
    expect(screen.queryByText('Spent')).not.toBeInTheDocument();
  });

  test('keeps Posted for non-spent posted rewards transactions', () => {
    customRender(
      <RewardsActivityTable
        activeSubscription={null}
        transactions={[
          makeTransaction({
            type: RewardType.EARNED,
            status: 'posted',
            points: 100,
            source: 'Purchase Rewards',
          }),
        ]}
        loading={false}
      />,
    );

    expect(screen.getByText('Posted')).toBeInTheDocument();
  });

  test('keeps other reward statuses unchanged', () => {
    customRender(
      <RewardsActivityTable
        activeSubscription={null}
        transactions={[
          makeTransaction({
            type: RewardType.ADJUSTED,
            status: 'canceled',
            points: 25,
            source: 'Manual Adjustment',
          }),
        ]}
        loading={false}
      />,
    );

    expect(screen.getByText('Canceled')).toBeInTheDocument();
    const pointsSpan = screen.getByText('+25 pts');
    expect(pointsSpan).toBeInTheDocument();
    expect(pointsSpan).toHaveClass('line-through');
  });

  test('shows positive strikethrough points for canceled IN_NETWORK transaction', () => {
    customRender(
      <RewardsActivityTable
        activeSubscription={null}
        transactions={[
          makeTransaction({
            type: RewardType.IN_NETWORK,
            status: 'canceled',
            points: 300,
            source: 'Order #5678',
            amount: 100,
          }),
        ]}
        loading={false}
      />,
    );

    expect(screen.getByText('Canceled')).toBeInTheDocument();
    const pointsSpan = screen.getByText('+300 pts');
    expect(pointsSpan).toBeInTheDocument();
    expect(pointsSpan).toHaveClass('line-through');
  });

  test('shows positive strikethrough points for canceled OUT_OF_NETWORK transaction', () => {
    customRender(
      <RewardsActivityTable
        activeSubscription={null}
        transactions={[
          makeTransaction({
            type: RewardType.OUT_OF_NETWORK,
            status: 'canceled',
            points: 150,
            source: 'Order #9012',
            amount: 150,
          }),
        ]}
        loading={false}
      />,
    );

    expect(screen.getByText('Canceled')).toBeInTheDocument();
    const pointsSpan = screen.getByText('+150 pts');
    expect(pointsSpan).toBeInTheDocument();
    expect(pointsSpan).toHaveClass('line-through');
  });
});
