import React, { useEffect } from 'react';
import { faPlusCircle } from '@fortawesome/pro-regular-svg-icons';
import { defineStepper } from '@stepperize/react';

import ModalWrapper from '@components/modals/ModalWrapper';
import useModal from '@hooks/useModal';
import useUser from '@hooks/useUser';
import { ConfirmVCModal, VCRulesModal, VirtualCardModal } from './';

export default function VCModalWrapper({ isModalActive, toggleModal }) {
  const { user } = useUser();
  //TODO: this used to be added/changed in local storage
  //Figure out how to add it to userContext
  const showVCRules = user?.show_vc_notice === undefined;
  const orderedScreens = [
    {
      id: 'vc_rules',
      component: VCRulesModal,
      hide: user?.show_vc_notice !== undefined,
    },
    {
      id: 'create_vc',
      component: VirtualCardModal,
      hide: false,
    },
    {
      id: 'confirm_vc',
      component: ConfirmVCModal,
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
  };

  useEffect(() => {
    // Start at the first screen in the list
    reset();
  }, [isModalActive]);

  return (
    <div data-testid={VCModalWrapper.role}>
      <ModalWrapper
        toggleModal={toggleModal}
        isModalActive={isModalActive}
        header="Create New Virtual Card"
        headerIcon={faPlusCircle}
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

VCModalWrapper.role = 'vc-modal-wrapper-component';
