import React, { useEffect, useState } from 'react';
import { faPlusCircle } from '@fortawesome/pro-regular-svg-icons';
import { defineStepper } from '@stepperize/react';

import ModalWrapper from '@components/modals/ModalWrapper';
import BankPendHelp from './BankPendHelp';
import PaymentMethodModal from './PaymentMethodModal';

export default function PaymentMethodModalWrapper({
  isModalActive,
  toggleModal,
}) {
  const [hasAlert, setHasAlert] = useState(false);
  const orderedScreens = [
    {
      id: 'payment_modal',
      component: PaymentMethodModal,
    },
    {
      id: 'bank_help',
      component: BankPendHelp,
    },
  ];

  const stepDefinitions = orderedScreens.map(({ id }) => ({ id }));
  const { useStepper } = defineStepper(...stepDefinitions);
  const { next, reset, when } = useStepper();

  useEffect(() => {
    // Start at the first screen in the list
    reset();
  }, []);

  const modalProps = {
    next,
    reset,
    toggleModal,
    hasAlert,
    setHasAlert,
  };

  if (!isModalActive) return null;

  return (
    <ModalWrapper
      toggleModal={toggleModal}
      isModalActive={isModalActive}
      header="Create New Payment Method"
      modalHeight="!px-2 max-h-modal"
      headerIcon={faPlusCircle}
    >
      {orderedScreens.map((step) =>
        when(step.id, () => <step.component {...modalProps} key={step.id} />)
      )}
    </ModalWrapper>
  );
}

PaymentMethodModalWrapper.role = 'payment-method-modal-wrapper';
