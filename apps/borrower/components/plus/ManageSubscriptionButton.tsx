import React, { FC } from 'react';

import OutlineButton from '@components/buttons/OutlineButton';
import useModal from '@hooks/useModal';
import { useCancelSubscription } from '@hooks/useSubscription';
import useToast from '@hooks/useToast';
import SubscriptionRecord from '@lib/records/subscription';
import CancelSubscriptionModal from './CancelSubscriptionModal';

interface ManageSubscriptionButtonProps {
  subscription: SubscriptionRecord;
  onCancelled: () => void;
}

const ManageSubscriptionButton: FC<ManageSubscriptionButtonProps> = ({
  subscription,
  onCancelled,
}) => {
  const { makeToast } = useToast();
  const { isModalActive, toggleModal } = useModal();
  const { cancelSubscription, cancelSubscriptionLoading } = useCancelSubscription();

  const handleCancel = async (reason: string, comment: string) => {
    try {
      await cancelSubscription({
        subscriptionId: subscription.id,
        reason,
        comment,
      });

      makeToast('Subscription cancelled successfully', 'success');
      onCancelled();
    } catch (error) {
      console.error('Subscription cancellation failed:', error);
      makeToast('Failed to cancel subscription. Please try again.', 'error');
      throw error;
    }
  };

  return (
    <>
      <OutlineButton
        buttonText="Manage Subscription"
        buttonColor="border-primary-blue text-primary-blue"
        hoverClass="hover:bg-blue-50"
        containerClass="w-full sm:w-auto"
        onClick={toggleModal}
        isSmall
      />
      <CancelSubscriptionModal
        isModalActive={isModalActive}
        toggleModal={toggleModal}
        onCancel={handleCancel}
        subscription={subscription}
        isLoading={cancelSubscriptionLoading}
      />
    </>
  );
};

export default ManageSubscriptionButton;
