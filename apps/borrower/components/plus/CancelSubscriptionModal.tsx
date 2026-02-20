import React, { FC, useMemo, useState } from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import classNames from 'classnames';

import OutlineButton from '@components/buttons/OutlineButton';
import PrimaryButton from '@components/buttons/PrimaryButton';
import ModalWrapper from '@components/modals/ModalWrapper';
import SubscriptionRecord from '@lib/records/subscription';

interface CancelSubscriptionModalProps {
  isModalActive: boolean;
  toggleModal: () => void;
  onCancel: (reason: string, comment: string) => Promise<void>;
  subscription: SubscriptionRecord;
  isLoading?: boolean;
}

enum CancellationStep {
  CONFIRMATION = 'confirmation',
  REASON = 'reason',
  FINAL = 'final',
}

const CANCELLATION_REASONS = [
  { value: 'too_expensive', label: 'Too expensive' },
  { value: 'not_using_enough', label: 'Not using it enough' },
  { value: 'missing_features', label: 'Missing features I need' },
  { value: 'poor_experience', label: 'Poor experience' },
  { value: 'switching_service', label: 'Switching to another service' },
  { value: 'other', label: 'Other' },
];

const CancelSubscriptionModal: FC<CancelSubscriptionModalProps> = ({
  isModalActive,
  toggleModal,
  onCancel,
  subscription,
  isLoading = false,
}) => {
  const [currentStep, setCurrentStep] = useState<CancellationStep>(CancellationStep.CONFIRMATION);
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [comment, setComment] = useState<string>('');

  const subscriptionEndDate = useMemo(() => {
    if (!subscription?.next_payment_date) return null;

    try {
      const date = new Date(subscription.next_payment_date);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (_error) {
      return null;
    }
  }, [subscription]);

  const handleClose = () => {
    setCurrentStep(CancellationStep.CONFIRMATION);
    setSelectedReason('');
    setComment('');
    toggleModal();
  };

  const handleConfirmationNext = () => {
    setCurrentStep(CancellationStep.REASON);
  };

  const handleReasonNext = () => {
    if (selectedReason) {
      setCurrentStep(CancellationStep.FINAL);
    }
  };

  const handleBack = () => {
    if (currentStep === CancellationStep.REASON) {
      setCurrentStep(CancellationStep.CONFIRMATION);
    } else if (currentStep === CancellationStep.FINAL) {
      setCurrentStep(CancellationStep.REASON);
    }
  };

  const handleFinalSubmit = async () => {
    try {
      await onCancel(selectedReason, comment);
      handleClose();
    } catch (_error) {
      // Error handling is done in the parent component
    }
  };

  return (
    <ModalWrapper isModalActive={isModalActive} toggleModal={handleClose} modalWidth="sm:max-w-md">
      {currentStep === CancellationStep.CONFIRMATION && (
        <div className="space-y-4 py-4">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Cancel Subscription?</h2>
            <p className="text-sm text-secondary-gray">
              We&apos;re sorry to see you go. Are you sure you want to cancel your Credit Key Plus
              membership?
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <h3 className="font-semibold text-sm text-gray-900">You&apos;ll lose access to:</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Exclusive rewards and cashback benefits</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>VIP customer support</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Premium member perks</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <OutlineButton
              buttonText="Go Back"
              buttonColor="border-primary-gray-border text-gray-700"
              hoverClass="hover:bg-gray-50"
              containerClass="w-full"
              onClick={handleClose}
            />
            <PrimaryButton
              buttonText="Continue to Cancel"
              buttonColor="bg-error"
              hoverClass="hover:bg-error/90"
              containerClass="w-full"
              onClick={handleConfirmationNext}
            />
          </div>
        </div>
      )}

      {currentStep === CancellationStep.REASON && (
        <div className="space-y-4 py-4">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Why are you cancelling?</h2>
            <p className="text-sm text-secondary-gray">
              Your feedback helps us improve Credit Key Plus
            </p>
          </div>

          <RadioGroup.Root
            value={selectedReason}
            onValueChange={setSelectedReason}
            className="space-y-2"
          >
            {CANCELLATION_REASONS.map((reason) => (
              <label
                key={reason.value}
                className={classNames(
                  'flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors',
                  selectedReason === reason.value
                    ? 'border-primary-blue bg-blue-50'
                    : 'border-primary-gray-border hover:bg-gray-50',
                )}
                onClick={() => setSelectedReason(reason.value)}
              >
                <RadioGroup.Item
                  value={reason.value}
                  className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center data-[state=checked]:border-primary-blue data-[state=checked]:bg-primary-blue"
                >
                  <RadioGroup.Indicator className="w-2.5 h-2.5 rounded-full bg-white" />
                </RadioGroup.Item>
                <span className="text-sm font-medium text-gray-900">{reason.label}</span>
              </label>
            ))}
          </RadioGroup.Root>

          <div className="flex flex-col gap-2 pt-2">
            <OutlineButton
              buttonText="Back"
              buttonColor="border-primary-gray-border text-gray-700"
              hoverClass="hover:bg-gray-50"
              containerClass="w-full"
              onClick={handleBack}
            />
            <PrimaryButton
              buttonText="Next"
              buttonColor="bg-primary-blue"
              hoverClass="hover:bg-primary-blue-hover"
              containerClass="w-full"
              onClick={handleReasonNext}
              disabled={!selectedReason}
            />
          </div>
        </div>
      )}

      {currentStep === CancellationStep.FINAL && (
        <div className="space-y-4 py-4">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Final Step</h2>
            <p className="text-sm text-secondary-gray">
              Anything else you&apos;d like to share? (Optional)
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="comment" className="text-sm font-medium text-gray-900">
              Additional comments
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us more about your experience..."
              rows={4}
              className="w-full px-3 py-2 border border-primary-gray-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent resize-none text-sm"
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800">
              <strong>Note:</strong> Cancelling will turn off auto-renewal. You&apos;ll continue to
              have access to all Credit Key Plus benefits until your subscription ends
              {subscriptionEndDate && (
                <>
                  {' '}
                  on <strong>{subscriptionEndDate}</strong>
                </>
              )}
              .
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <OutlineButton
              buttonText="Back"
              buttonColor="border-primary-gray-border text-gray-700"
              hoverClass="hover:bg-gray-50"
              containerClass="w-full"
              onClick={handleBack}
              disabled={isLoading}
            />
            <PrimaryButton
              buttonText="Confirm Cancellation"
              buttonColor="bg-error"
              hoverClass="hover:bg-error/90"
              containerClass="w-full"
              onClick={handleFinalSubmit}
              disabled={isLoading}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}
    </ModalWrapper>
  );
};

export default CancelSubscriptionModal;
