import React from 'react';

import OrderStatus from '@apps/borrower/components/home/table/OrderStatus';
import PaymentPlanRecord from '@lib/records/payment_plan';
import { customRender, screen } from '@lib/testing/test-utils';

const makeOrder = (productOverrides = {}) => ({
  product: new PaymentPlanRecord({
    id: 'test-loan',
    order_key: 'CK-TEST',
    payment_plan_status: 'active',
    installments: '6',
    amount: '100.00',
    disbursement_date: '2024-07-18 13:28:11.164-07:00',
    payoff_balance: '100.00',
    is_past_due: false,
    last_past_due_at: null,
    next_payment_due_date: '2024-08-19 01:00:00.000-07:00',
    next_payment_due_amount: '18.03',
    interest_fee_percent: '0.0164',
    last_payment_attempted_at: null,
    payment_schedule: [],
    transactions: [],
    transaction_entries: [],
    ...productOverrides,
  }),
});

describe('OrderStatus Component', () => {
  test('displays "active" status with green styling for active loans', () => {
    const order = makeOrder();

    customRender(<OrderStatus order={order} isTable={true} />);

    expect(screen.getByText('active')).toBeInTheDocument();
    expect(screen.getByText('active')).toHaveClass('text-success');
  });

  test('displays "past due" status with yellow styling when loan is past due', () => {
    const order = makeOrder({
      is_past_due: true,
      last_past_due_at: '2024-07-21T13:28:11.164-07:00',
      last_payment_attempted_at: '2024-07-21T13:28:11.164-07:00',
    });

    customRender(<OrderStatus order={order} isTable={true} />);

    expect(screen.getByText('past due')).toBeInTheDocument();
    expect(screen.getByText('past due')).toHaveClass('text-warning');
  });

  test('does not display "active" status text when loan is past due', () => {
    const order = makeOrder({
      is_past_due: true,
      last_past_due_at: '2024-07-21T13:28:11.164-07:00',
      last_payment_attempted_at: '2024-07-21T13:28:11.164-07:00',
    });

    customRender(<OrderStatus order={order} isTable={true} />);

    expect(screen.queryByText('active')).not.toBeInTheDocument();
  });
});
