import React from 'react';

import OverdueLoansBanner from '@apps/borrower/components/home/OverdueLoansBanner';
import { customRender, screen } from '@lib/testing/test-utils';

const mockOrder = (key: string) => ({ order_key: key, product: { isPastDue: true } });

describe('OverdueLoansBanner', () => {
  test('renders nothing when hasOverdueLoans is false and overdueOrders is empty', () => {
    const { container } = customRender(
      <OverdueLoansBanner overdueOrders={[]} hasOverdueLoans={false} />,
    );
    expect(container.firstChild).toBeNull();
  });

  test('renders fallback banner when hasOverdueLoans is true but overdueOrders is empty', () => {
    customRender(<OverdueLoansBanner overdueOrders={[]} hasOverdueLoans={true} />);
    expect(
      screen.getByText('You have overdue loans. Please review your account.'),
    ).toBeInTheDocument();
    expect(screen.getByText('View details')).toBeInTheDocument();
  });

  test('renders single overdue order with order link', () => {
    const { container } = customRender(
      <OverdueLoansBanner overdueOrders={[mockOrder('ORD-001')]} hasOverdueLoans={true} />,
    );
    expect(screen.getByText('ORD-001')).toBeInTheDocument();
    expect(container.textContent).toContain('Your loan');
    expect(container.textContent).toContain('is overdue.');
  });

  test('renders multiple overdue orders with order links', () => {
    const { container } = customRender(
      <OverdueLoansBanner
        overdueOrders={[mockOrder('ORD-001'), mockOrder('ORD-002')]}
        hasOverdueLoans={true}
      />,
    );
    expect(screen.getByText('ORD-001')).toBeInTheDocument();
    expect(screen.getByText('ORD-002')).toBeInTheDocument();
    expect(container.textContent).toContain('Your loans');
    expect(container.textContent).toContain('are overdue.');
  });

  test('renders bulk message when 10 or more overdue orders', () => {
    const orders = Array.from({ length: 10 }, (_, i) => mockOrder(`ORD-${i + 1}`));
    customRender(<OverdueLoansBanner overdueOrders={orders} hasOverdueLoans={true} />);
    expect(screen.getByText('You have 10+ overdue loans.')).toBeInTheDocument();
  });

  test('renders banner when overdueOrders has items but hasOverdueLoans is false', () => {
    customRender(
      <OverdueLoansBanner overdueOrders={[mockOrder('ORD-001')]} hasOverdueLoans={false} />,
    );
    expect(screen.getByText('ORD-001')).toBeInTheDocument();
  });
});
