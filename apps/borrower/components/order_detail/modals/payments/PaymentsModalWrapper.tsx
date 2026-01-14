import React, { useEffect } from 'react';
import { faFileInvoiceDollar } from '@fortawesome/pro-regular-svg-icons';
import { defineStepper } from '@stepperize/react';

import ModalWrapper from '@components/modals/ModalWrapper';
import useModal from '@hooks/useModal';
import { CompleteModal, ConfirmModal, PaymentsModal } from './';

export default function PaymentsModalWrapper({
  order,
  isModalActive,
  toggleModal,
  paymentMethods,
  refetchOrder,
}) {
  const { modalState, setModalState, resetModalState } = useModal();

  const orderedScreens = [
    {
      id: 'create_payment',
      component: PaymentsModal,
    },
    {
      id: 'confirm_payment',
      component: ConfirmModal,
    },
    {
      id: 'complete_payment',
      component: CompleteModal,
    },
  ];

  const stepDefinitions = orderedScreens.map(({ id }) => ({ id }));
  const { useStepper } = defineStepper(...stepDefinitions);

  const { next, prev, reset, when } = useStepper();

  const modalProps = {
    order,
    isModalActive,
    modalState,
    setModalState,
    toggleModal,
    next,
    prev,
    reset,
    resetModalState,
    paymentMethods,
    refetchOrder,
  };

  useEffect(() => {
    reset();
  }, [isModalActive]);

  return (
    <div data-testid={PaymentsModalWrapper.role}>
      <ModalWrapper
        isModalActive={isModalActive}
        toggleModal={toggleModal}
        header={
          <div>
            Make a payment
            <p className="font-normal text-xs text-secondary-gray">
              You'll never be charged early payoff penalties
            </p>
          </div>
        }
        modalHeight="!px-2 max-h-modal"
        headerIcon={faFileInvoiceDollar}
      >
        {orderedScreens.map((step) =>
          when(step.id, () => <step.component {...modalProps} key={step.id} />),
        )}
      </ModalWrapper>
    </div>
  );
}

PaymentsModalWrapper.role = 'payments-modal-wrapper-component';
