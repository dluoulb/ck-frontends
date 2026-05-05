import React, { useEffect, useMemo, useState } from 'react';
import { DateTime } from 'luxon';
import Link from 'next/link';

import PrimaryButton from '@components/buttons/PrimaryButton';
import { Checkbox } from '@components/components/ui/checkbox';
import ModalWrapper from '@components/modals/ModalWrapper';
import { useEntity } from '@contexts/EntityContext';
import { useUser } from '@contexts/UserContext';
import useModal from '@hooks/useModal';
import usePaymentMethods from '@hooks/usePaymentMethods';
import { useSubscriptionPlans } from '@hooks/useSubscription';
import SubscriptionPlanRecord from '@lib/records/subscription_plan';
import { formatCurrency } from '@lib/utils/formatters';
import FullStory from '@lib/utils/fullstory';
import PaymentMethodModalWrapper from '../payment_methods/modals/PaymentMethodModalWrapper';

enum PlanType {
  ANNUAL = 'annual',
  MONTHLY = 'monthly',
}

type PlanOption = {
  type: PlanType;
  name: string;
  price: string;
  period: string;
  badgeText?: string;
  highlight?: string;
};

type ActivationModalProps = {
  isModalActive: boolean;
  createSubscriptionLoading: boolean;
  toggleModal: () => void;
  onActivate: (planType: string) => void;
};

const planTypeLabels: Record<PlanType, string> = {
  [PlanType.ANNUAL]: 'annually',
  [PlanType.MONTHLY]: 'monthly',
};

const planDurationMap = {
  30: { type: PlanType.MONTHLY, period: 'per month' },
  365: { type: PlanType.ANNUAL, period: 'per year' },
} as const;

const calculateTrialEndDate = (daysUntilFirstPayment: number): string => {
  if (!daysUntilFirstPayment || daysUntilFirstPayment <= 0) return '';

  const endDate = DateTime.now().plus({ days: daysUntilFirstPayment });
  return endDate.toFormat('MMM d, yyyy');
};

const createPlanOptions = (subscriptionPlans: SubscriptionPlanRecord[]): PlanOption[] => {
  const monthlyPlan = subscriptionPlans.find((plan) => plan.duration === 30);

  return subscriptionPlans.map((plan) => {
    let badgeText: string | undefined;
    let highlight: string | undefined;
    const planDetails = planDurationMap[plan.duration];

    if (planDetails.type === PlanType.ANNUAL && monthlyPlan) {
      const savings = monthlyPlan.price * 12 - plan.price;
      if (savings > 0) {
        badgeText = `Save ${formatCurrency(savings, true, plan.currency)}`;
      }

      const monthsFree = Math.round(savings / monthlyPlan.price);
      if (monthsFree >= 1) {
        highlight = `${monthsFree} month${monthsFree > 1 ? 's' : ''} free`;
      }
    }

    return {
      name: plan.name,
      type: planDetails.type,
      price: formatCurrency(plan.price, true, plan.currency),
      period: planDetails.period,
      badgeText,
      highlight,
    };
  });
};

export default function ActivationModal({
  isModalActive,
  createSubscriptionLoading,
  toggleModal,
  onActivate,
}: ActivationModalProps) {
  const { user } = useUser();
  const { entity } = useEntity();
  const { subscriptionPlans } = useSubscriptionPlans();
  const [selectedPlan, setSelectedPlan] = useState<PlanType>(PlanType.ANNUAL);
  const [isAgreed, setIsAgreed] = useState(false);

  const { isModalActive: isPaymentModalActive, toggleModal: togglePaymentModal } = useModal();
  const { activePaymentMethods, refetchPaymentMethods } = usePaymentMethods(user, entity, true);

  const hasPaymentMethods = activePaymentMethods && activePaymentMethods.length > 0;

  const planOptions: PlanOption[] = useMemo(() => {
    return createPlanOptions(subscriptionPlans);
  }, [subscriptionPlans]);

  const selectedPlanOption = useMemo(
    () => planOptions.find((plan) => plan.type === selectedPlan),
    [planOptions, selectedPlan],
  );

  const selectedPlanRecord = useMemo(
    () =>
      subscriptionPlans.find((plan) => {
        const planDetails = planDurationMap[plan.duration];
        return planDetails?.type === selectedPlan;
      }),
    [subscriptionPlans, selectedPlan],
  );

  const hasFreeTrial = useMemo(
    () =>
      entity?.cta_banners?.find((b) => b.name === 'ckp_trial_eligible')?.enabled === true &&
      (selectedPlanRecord?.days_until_first_payment ?? 0) > 0,
    [entity, selectedPlanRecord],
  );

  const trialEndDate = useMemo(() => {
    const daysUntilPayment = selectedPlanRecord?.days_until_first_payment;

    if (!hasFreeTrial || !daysUntilPayment) {
      return '';
    }

    return calculateTrialEndDate(daysUntilPayment);
  }, [hasFreeTrial, selectedPlanRecord]);

  useEffect(() => {
    if (isModalActive && user?.id && entity?.id) {
      const fullstory = new FullStory();
      fullstory.viewedPlusSubscriptionModalEvent(user.id, entity.id);
    }
  }, [isModalActive, user?.id, entity?.id]);

  const handleActivate = () => {
    if (!hasPaymentMethods) {
      togglePaymentModal();
      return;
    }

    if (isAgreed) {
      onActivate(selectedPlanOption.name);
    }
  };

  const handlePaymentModalClose = () => {
    refetchPaymentMethods();
    togglePaymentModal();
  };

  return (
    <>
      <ModalWrapper
        isModalActive={isModalActive}
        toggleModal={toggleModal}
        modalWidth="sm:max-w-md"
      >
        <div className="text-center flex flex-col gap-2">
          <h2 className="text-2xl font-bold">Activate Credit Key Plus</h2>
          <h3 className="text-lg font-bold text-black">Select a plan</h3>
          <p className="text-secondary-gray text-xs">
            Limited spots available · No long term commitments · Cancel anytime
          </p>
        </div>
        {hasFreeTrial && (
          <div className="bg-green-50 border border-green-200 rounded px-4 py-3 my-6">
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <div className="text-sm font-bold text-green-800 mb-1">
                  Start with a {selectedPlanRecord?.days_until_first_payment}-day free trial
                </div>
                <div className="text-xs text-green-700">
                  No charge until trial ends. Cancel anytime.
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4 my-6">
          {planOptions.map((plan) => (
            <div
              key={plan.type}
              className={`border-2 rounded px-6 py-2 cursor-pointer relative flex flex-col justify-center ${
                selectedPlan === plan.type ? 'border-primary-blue' : 'border-primary-gray-border'
              }`}
              onClick={() => setSelectedPlan(plan.type)}
            >
              {plan.badgeText && (
                <div className="absolute -top-3 -right-3 text-xs px-2 py-1 border border-primary-gray-border rounded bg-white">
                  {plan.badgeText}
                </div>
              )}
              <div className="text-xl font-bold">{plan.price}</div>
              <div className="text-xs">{plan.period}</div>
              {plan.highlight && (
                <div className="text-success text-sm font-bold mt-1">{plan.highlight}</div>
              )}
            </div>
          ))}
        </div>
        <div className="bg-gray-100 rounded px-4 py-3 mb-6">
          <div className="font-light">Billing account</div>
          <div className="font-bold">{user?.email || ''}</div>
        </div>
        {!hasPaymentMethods && (
          <div className="bg-[#FFF7EC] rounded px-4 py-3 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="font-light text-sm flex-1" style={{ color: '#853918' }}>
                A payment method is required to activate Credit Key Plus
              </div>
              <PrimaryButton
                ariaLabel="add_payment_method_button"
                buttonText="Add Payment Method"
                buttonColor="bg-primary-blue"
                hoverClass="hover:bg-primary-blue-hover"
                containerClass="flex-shrink-0 whitespace-nowrap"
                onClick={togglePaymentModal}
                isSmall={true}
              />
            </div>
          </div>
        )}
        <div className="flex items-start gap-3 mb-6">
          <Checkbox
            id="agree"
            checked={isAgreed}
            onCheckedChange={(checked) => setIsAgreed(checked === true)}
          />
          <label htmlFor="agree" className="text-xs">
            I authorize Credit Key to charge my account {selectedPlanOption?.price}{' '}
            {planTypeLabels[selectedPlan]} for Credit Key Plus membership
            {hasFreeTrial &&
              ` after my ${selectedPlanRecord?.days_until_first_payment}-day free trial`}
            . I understand this is a recurring subscription that will automatically renew until I
            cancel. I've reviewed and agree to the{' '}
            <Link
              href="https://www.creditkey.com/legal/credit-key-plus-terms"
              className="text-primary-blue underline hover:text-primary-blue/80 cursor-pointer"
              target="_blank"
            >
              Credit Key Plus terms
            </Link>
            .
          </label>
        </div>
        {hasFreeTrial && (
          <div className="text-center text-xs text-gray-600 mb-4">
            You won't be charged until your trial ends on <strong>{trialEndDate}</strong>
          </div>
        )}
        <PrimaryButton
          buttonColor="w-full bg-primary-blue hover:bg-primary-blue-hover transition-colors text-white px-4 py-2 text-xs sm:text-sm rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          hoverClass="hover:bg-gray-100"
          disabled={!isAgreed || !selectedPlan || !hasPaymentMethods || createSubscriptionLoading}
          onClick={handleActivate}
          buttonText={hasFreeTrial ? 'Start Free Trial' : 'Activate Credit Key Plus'}
          isLoading={createSubscriptionLoading}
        />
      </ModalWrapper>
      <PaymentMethodModalWrapper
        isModalActive={isPaymentModalActive}
        toggleModal={handlePaymentModalClose}
      />
    </>
  );
}
