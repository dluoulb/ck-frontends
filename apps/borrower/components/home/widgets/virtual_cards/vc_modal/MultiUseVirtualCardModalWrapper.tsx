import React, { useEffect, useState } from 'react';
import { defineStepper } from '@stepperize/react';
import MultiUseVirtualCardDetails from './MultiUseVirtualCardDetails';
import { faCirclePlus } from '@fortawesome/pro-solid-svg-icons';
import useModal from '@hooks/useModal';
import ModalWrapper from '@components/modals/ModalWrapper';
import SetDefaultTermsModal from './SetDefaultTermsModal';
import CardholderAgreementModal from './CardholderAgreementModal';
import MultiUseVCRulesModal from './MultiUseVCRulesModal';
import AddFundsModal from './AddFundsModal';
import { useEntity } from '@contexts/EntityContext';
import PaymentMethodModal from '@apps/borrower/components/payment_methods/modals/PaymentMethodModal';

export default function MultiUseVirtualCardModalWrapper({ isModalActive, toggleModal }) {
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
      component: PaymentMethodModal,
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
      hide: false,
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
        {orderedScreens.map(
          (step) =>
            !step.hide &&
            when(step.id, () => (
              <step.component {...modalProps} key={step.id} />
            ))
        )}
      </ModalWrapper>
    </div>
  );
}

MultiUseVirtualCardModalWrapper.role = 'multi-use-vc-modal-wrapper-component';
