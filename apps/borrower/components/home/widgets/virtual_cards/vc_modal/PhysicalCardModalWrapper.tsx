import React, { useEffect, useState } from 'react';
import { faCirclePlus } from '@fortawesome/pro-solid-svg-icons';
import { defineStepper } from '@stepperize/react';

import VcFlowDefaultPaymentMethodModal from '@apps/borrower/components/payment_methods/modals/VcFlowDefaultPaymentMethodModal';
import useCompanyVirtualCard from '@apps/borrower/hooks/useCompanyVirtualCard';
import ModalWrapper from '@components/modals/ModalWrapper';
import useModal from '@hooks/useModal';
import CardholderAgreementModal from './CardholderAgreementModal';
import ConfirmMailingAddressModal from './ConfirmMailingAddressModal';
import SetDefaultTermsModal from './SetDefaultTermsModal';
import MultiUseVCRulesModal from './MultiUseVCRulesModal';

export default function PhysicalCardModalWrapper({
  isModalActive,
  toggleModal,
}) {
  const [hasAlert, setHasAlert] = useState(false);
  const { virtualCard } = useCompanyVirtualCard();

  const skipAgreementAndTerms = !!virtualCard;

  const orderedScreens = [
    {
      id: 'vc_rules',
      component: MultiUseVCRulesModal,
      hide: false,
    },
    {
      id: 'cardholder_agreement',
      component: CardholderAgreementModal,
      hide: skipAgreementAndTerms,
    },
    {
      id: 'add_payment_method',
      component: VcFlowDefaultPaymentMethodModal,
      hide: skipAgreementAndTerms,
    },
    {
      id: 'set_default_terms',
      component: SetDefaultTermsModal,
      hide: skipAgreementAndTerms,
    },
    {
      id: 'confirm_mailing_address',
      component: ConfirmMailingAddressModal,
      hide: false,
    },
  ];

  const stepDefinitions = orderedScreens.map(({ id }) => ({ id }));
  const { useStepper } = defineStepper(...stepDefinitions);

  const { next, prev, goTo, reset, when } = useStepper();

  const defaultFormState = {
    vc_request: {
      merchant_name: '',
      merchant_url: '',
      order_amount: '',
    },
  };

  const { modalState, setModalState } = useModal(defaultFormState);

  const modalProps = {
    next,
    prev,
    goTo,
    modalState,
    setModalState,
    reset,
    toggleModal,
    hasAlert,
    setHasAlert,
    createVcFlow: true,
    skipCardCreate: true,
  };

  useEffect(() => {
    // Start at the first screen in the list
    reset();
    setHasAlert(false);
  }, [isModalActive]);

  return (
    <div data-testid={PhysicalCardModalWrapper.role}>
      <ModalWrapper
        toggleModal={toggleModal}
        isModalActive={isModalActive}
        header="Your Credit Key Prepaid Mastercard®"
        headerIcon={faCirclePlus}
      >
        {orderedScreens.map((step) =>
          when(step.id, () => {
            if (step.hide) {
              next();
              return null;
            }
            const StepComponent = step.component;
            return <StepComponent key={step.id} {...modalProps} />;
          })
        )}
      </ModalWrapper>
    </div>
  );
}

PhysicalCardModalWrapper.role = 'physical-card-modal-wrapper-component';
