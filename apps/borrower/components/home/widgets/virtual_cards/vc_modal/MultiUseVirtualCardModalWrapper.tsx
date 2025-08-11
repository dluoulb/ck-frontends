import React, { useEffect, useState } from 'react';
import { faCirclePlus } from '@fortawesome/pro-solid-svg-icons';
import { defineStepper } from '@stepperize/react';

import VcFlowDefaultPaymentMethodModal from '@apps/borrower/components/payment_methods/modals/VcFlowDefaultPaymentMethodModal';
import ModalWrapper from '@components/modals/ModalWrapper';
import useModal from '@hooks/useModal';
import AddFundsModal from './AddFundsModal';
import CardholderAgreementModal from './CardholderAgreementModal';
import MultiUseVCRulesModal from './MultiUseVCRulesModal';
import MultiUseVirtualCardDetails from './MultiUseVirtualCardDetails';
import SetDefaultTermsModal from './SetDefaultTermsModal';
import { jitEnabled } from '@lib/constants/SiteVariables';

export default function MultiUseVirtualCardModalWrapper({
  isModalActive,
  toggleModal,
}) {
  const [hasAlert, setHasAlert] = useState(false);

  const orderedScreens = [
    {
      id: 'vc_rules',
      component: MultiUseVCRulesModal,
      hide: false,
    },
    {
      id: 'cardholder_agreement',
      component: CardholderAgreementModal,
      hide: false,
    },
    {
      id: 'add_payment_method',
      component: VcFlowDefaultPaymentMethodModal,
      hide: false,
    },
    {
      id: 'set_default_terms',
      component: SetDefaultTermsModal,
      hide: false,
    },
    {
      id: 'add_funds',
      component: AddFundsModal,
      hide: jitEnabled,
    },
    {
      id: 'show_vc',
      component: MultiUseVirtualCardDetails,
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
  };

  useEffect(() => {
    // Start at the first screen in the list
    reset();
    setHasAlert(false);
  }, [isModalActive]);

  return (
    <div data-testid={MultiUseVirtualCardModalWrapper.role}>
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

MultiUseVirtualCardModalWrapper.role = 'multi-use-vc-modal-wrapper-component';
