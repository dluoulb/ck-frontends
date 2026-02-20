import React from 'react';

import CancelSubscriptionModal from '@apps/borrower/components/plus/CancelSubscriptionModal';
import SubscriptionRecord from '@lib/records/subscription';
import { customRender, fireEvent, screen, waitFor } from '@lib/testing/test-utils';

describe('CancelSubscriptionModal', () => {
  const mockToggleModal = jest.fn();
  const mockOnCancel = jest.fn();

  const mockSubscription = new SubscriptionRecord({
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
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Step 1: Confirmation', () => {
    test('renders initial confirmation screen', () => {
      customRender(
        <CancelSubscriptionModal
          subscription={mockSubscription}
          isModalActive={true}
          toggleModal={mockToggleModal}
          onCancel={mockOnCancel}
        />,
      );

      expect(screen.getByText('Cancel Subscription?')).toBeInTheDocument();
      expect(
        screen.getByText(
          "We're sorry to see you go. Are you sure you want to cancel your Credit Key Plus membership?",
        ),
      ).toBeInTheDocument();
      expect(screen.getByText("You'll lose access to:")).toBeInTheDocument();
    });

    test('closes modal when "Go Back" is clicked', () => {
      customRender(
        <CancelSubscriptionModal
          subscription={mockSubscription}
          isModalActive={true}
          toggleModal={mockToggleModal}
          onCancel={mockOnCancel}
        />,
      );

      fireEvent.click(screen.getByText('Go Back'));
      expect(mockToggleModal).toHaveBeenCalled();
    });

    test('proceeds to reason selection when "Continue to Cancel" is clicked', () => {
      customRender(
        <CancelSubscriptionModal
          subscription={mockSubscription}
          isModalActive={true}
          toggleModal={mockToggleModal}
          onCancel={mockOnCancel}
        />,
      );

      fireEvent.click(screen.getByText('Continue to Cancel'));
      expect(screen.getByText('Why are you cancelling?')).toBeInTheDocument();
    });
  });

  describe('Step 2: Reason Selection', () => {
    beforeEach(() => {
      customRender(
        <CancelSubscriptionModal
          subscription={mockSubscription}
          isModalActive={true}
          toggleModal={mockToggleModal}
          onCancel={mockOnCancel}
        />,
      );
      // Navigate to reason selection step
      fireEvent.click(screen.getByText('Continue to Cancel'));
    });

    test('renders reason selection screen', () => {
      expect(screen.getByText('Why are you cancelling?')).toBeInTheDocument();
      expect(
        screen.getByText('Your feedback helps us improve Credit Key Plus'),
      ).toBeInTheDocument();
    });

    test('displays all cancellation reasons', () => {
      expect(screen.getByText('Too expensive')).toBeInTheDocument();
      expect(screen.getByText('Not using it enough')).toBeInTheDocument();
      expect(screen.getByText('Missing features I need')).toBeInTheDocument();
      expect(screen.getByText('Poor experience')).toBeInTheDocument();
      expect(screen.getByText('Switching to another service')).toBeInTheDocument();
      expect(screen.getByText('Other')).toBeInTheDocument();
    });

    test('allows selecting a reason', () => {
      const reasonOption = screen.getByText('Too expensive');
      fireEvent.click(reasonOption);

      // The next button should be enabled after selecting a reason
      const nextButton = screen.getByText('Next').closest('button');
      expect(nextButton).not.toBeDisabled();
    });

    test('next button is disabled when no reason is selected', () => {
      const nextButton = screen.getByText('Next').closest('button');
      expect(nextButton).toBeDisabled();
    });

    test('goes back to confirmation when "Back" is clicked', () => {
      fireEvent.click(screen.getByText('Back'));
      expect(screen.getByText('Cancel Subscription?')).toBeInTheDocument();
    });

    test('proceeds to final step when a reason is selected and "Next" is clicked', () => {
      fireEvent.click(screen.getByText('Too expensive'));
      fireEvent.click(screen.getByText('Next'));
      expect(screen.getByText('Final Step')).toBeInTheDocument();
    });
  });

  describe('Step 3: Final Confirmation', () => {
    beforeEach(() => {
      customRender(
        <CancelSubscriptionModal
          subscription={mockSubscription}
          isModalActive={true}
          toggleModal={mockToggleModal}
          onCancel={mockOnCancel}
        />,
      );
      // Navigate to final step
      fireEvent.click(screen.getByText('Continue to Cancel'));
      fireEvent.click(screen.getByText('Too expensive'));
      fireEvent.click(screen.getByText('Next'));
    });

    test('renders final confirmation screen', () => {
      expect(screen.getByText('Final Step')).toBeInTheDocument();
      expect(screen.getByText("Anything else you'd like to share? (Optional)")).toBeInTheDocument();
      expect(screen.getByLabelText('Additional comments')).toBeInTheDocument();
    });

    test('allows entering optional comments', () => {
      const textarea = screen.getByLabelText('Additional comments');
      fireEvent.change(textarea, { target: { value: 'Too pricey for my budget' } });
      expect(textarea).toHaveValue('Too pricey for my budget');
    });

    test('displays warning message', () => {
      expect(screen.getByText(/Cancelling will turn off auto-renewal/)).toBeInTheDocument();
      expect(screen.getByText(/March 15, 2026/)).toBeInTheDocument();
    });

    test('goes back to reason selection when "Back" is clicked', () => {
      fireEvent.click(screen.getAllByText('Back')[0]);
      expect(screen.getByText('Why are you cancelling?')).toBeInTheDocument();
    });

    test('calls onCancel with reason and comment when "Confirm Cancellation" is clicked', async () => {
      mockOnCancel.mockResolvedValue(undefined);

      const textarea = screen.getByLabelText('Additional comments');
      fireEvent.change(textarea, { target: { value: 'Test comment' } });

      fireEvent.click(screen.getByText('Confirm Cancellation'));

      await waitFor(() => {
        expect(mockOnCancel).toHaveBeenCalledWith('too_expensive', 'Test comment');
      });
    });

    test('calls onCancel with empty comment when no comment is provided', async () => {
      mockOnCancel.mockResolvedValue(undefined);

      fireEvent.click(screen.getByText('Confirm Cancellation'));

      await waitFor(() => {
        expect(mockOnCancel).toHaveBeenCalledWith('too_expensive', '');
      });
    });

    test('disables buttons while loading', () => {
      const { rerender } = customRender(
        <CancelSubscriptionModal
          subscription={mockSubscription}
          isModalActive={true}
          toggleModal={mockToggleModal}
          onCancel={mockOnCancel}
          isLoading={false}
        />,
      );

      // Navigate to final step
      fireEvent.click(screen.getByText('Continue to Cancel'));
      fireEvent.click(screen.getByText('Too expensive'));
      fireEvent.click(screen.getByText('Next'));

      // Now set loading state
      rerender(
        <CancelSubscriptionModal
          subscription={mockSubscription}
          isModalActive={true}
          toggleModal={mockToggleModal}
          onCancel={mockOnCancel}
          isLoading={true}
        />,
      );

      const backButtons = screen.getAllByText('Back');
      const confirmButtons = screen.getAllByText('Confirm Cancellation');

      // Get the button elements
      const backButton = backButtons[backButtons.length - 1].closest('button');
      const confirmButton = confirmButtons[confirmButtons.length - 1].closest('button');

      expect(backButton).toBeDisabled();
      expect(confirmButton).toBeDisabled();
    });
  });

  describe('Modal state management', () => {
    test('resets state when modal is closed and reopened', async () => {
      const { rerender } = customRender(
        <CancelSubscriptionModal
          subscription={mockSubscription}
          isModalActive={true}
          toggleModal={mockToggleModal}
          onCancel={mockOnCancel}
        />,
      );

      // Navigate to final step
      fireEvent.click(screen.getByText('Continue to Cancel'));
      fireEvent.click(screen.getByText('Too expensive'));
      fireEvent.click(screen.getByText('Next'));

      // Enter a comment
      const textarea = screen.getByLabelText('Additional comments');
      fireEvent.change(textarea, { target: { value: 'Test comment' } });

      // Close modal
      fireEvent.click(screen.getByText('Back'));
      fireEvent.click(screen.getByText('Back'));
      fireEvent.click(screen.getByText('Go Back'));

      expect(mockToggleModal).toHaveBeenCalled();

      // Reopen modal by rerendering
      rerender(
        <CancelSubscriptionModal
          subscription={mockSubscription}
          isModalActive={true}
          toggleModal={mockToggleModal}
          onCancel={mockOnCancel}
        />,
      );

      // Should be back at the first step
      expect(screen.getByText('Cancel Subscription?')).toBeInTheDocument();
    });
  });
});
