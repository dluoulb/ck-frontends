import React from 'react';

import ManageSubscriptionButton from '@apps/borrower/components/plus/ManageSubscriptionButton';
import SubscriptionRecord from '@lib/records/subscription';
import { customRender, fireEvent, screen } from '@lib/testing/test-utils';

jest.mock('@hooks/useSubscription', () => ({
  useCancelSubscription: jest.fn().mockReturnValue({
    cancelSubscription: jest.fn(),
    cancelSubscriptionLoading: false,
  }),
}));

jest.mock('@hooks/useModal', () => {
  const mockToggleModal = jest.fn();

  return {
    __esModule: true,
    mockToggleModal,
    default: jest.fn().mockReturnValue({
      isModalActive: false,
      toggleModal: mockToggleModal,
    }),
  };
});

jest.mock('@hooks/useToast', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    makeToast: jest.fn(),
  }),
}));

describe('ManageSubscriptionButton', () => {
  const mockOnCancelled = jest.fn();

  const baseSubscription = {
    id: 'sub_123',
    plan_id: 'plan_123',
    status: 'ACTIVE',
    start_date: '2026-01-01',
    end_date: '2027-01-01',
    auto_renew: true,
    total_amount: 390,
    paid_amount: 0,
    remaining_amount: 390,
    next_payment_date: '2026-03-15T00:00:00.000Z',
    repayment_status: 'CURRENT',
    created_at: '2026-01-01',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders Manage Subscription button when auto_renew is true', () => {
    const subscription = new SubscriptionRecord(baseSubscription);

    customRender(
      <ManageSubscriptionButton subscription={subscription} onCancelled={mockOnCancelled} />,
    );

    expect(screen.getByText('Manage Subscription')).toBeInTheDocument();
    expect(screen.queryByText(/Cancellation Scheduled/)).not.toBeInTheDocument();
  });

  test('renders Cancellation Scheduled text with formatted date when auto_renew is false', () => {
    const subscription = new SubscriptionRecord({ ...baseSubscription, auto_renew: false });

    customRender(
      <ManageSubscriptionButton subscription={subscription} onCancelled={mockOnCancelled} />,
    );

    expect(
      screen.getByText(
        `Cancellation Scheduled for ${new Date(
          baseSubscription.next_payment_date,
        ).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          timeZone: 'UTC',
        })}`,
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText('Manage Subscription')).not.toBeInTheDocument();
  });

  test('renders Cancellation Scheduled without date when next_payment_date is absent', () => {
    const { next_payment_date: _omit, ...noDateSubscription } = baseSubscription;
    const subscription = new SubscriptionRecord({ ...noDateSubscription, auto_renew: false });

    customRender(
      <ManageSubscriptionButton subscription={subscription} onCancelled={mockOnCancelled} />,
    );

    expect(screen.getByText('Cancellation Scheduled')).toBeInTheDocument();
  });

  test('does not open the cancellation modal when auto_renew is false and label is clicked', () => {
    const subscription = new SubscriptionRecord({ ...baseSubscription, auto_renew: false });

    customRender(
      <ManageSubscriptionButton subscription={subscription} onCancelled={mockOnCancelled} />,
    );

    const statusText = screen.getByText(
      `Cancellation Scheduled for ${new Date(baseSubscription.next_payment_date).toLocaleDateString(
        'en-US',
        {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          timeZone: 'UTC',
        },
      )}`,
    );
    fireEvent.click(statusText);

    const { mockToggleModal } = jest.requireMock('@hooks/useModal');
    expect(mockToggleModal).not.toHaveBeenCalled();
    expect(screen.queryByText('Cancel Subscription?')).not.toBeInTheDocument();
  });
});
