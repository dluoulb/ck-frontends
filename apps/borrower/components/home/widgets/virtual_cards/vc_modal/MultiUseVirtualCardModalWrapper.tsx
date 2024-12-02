import React, { useEffect } from 'react';
import { defineStepper } from '@stepperize/react';
import MultiUseVirtualCardDetails from './MultiUseVirtualCardDetails';
import VCRulesModal from './VCRulesModal';
import { faPlusCircle } from '@fortawesome/pro-solid-svg-icons';
import useModal from '@hooks/useModal';
import ModalWrapper from '@components/modals/ModalWrapper';
import SetDefaultTermsModal from './SetDefaultTermsModal';
export default function MultiUseVirtualCardModalWrapper({ isModalActive, toggleModal }) {
  const hideVCRules = JSON.parse(localStorage.getItem('hide_vc_notice'));
  const orderedScreens = [
    {
      id: 'vc_rules',
      component: VCRulesModal,
      hide: hideVCRules,
    },
    {
      id: 'set_default_terms',
      component: SetDefaultTermsModal,
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
  };

  useEffect(() => {
    // Start at the first screen in the list
    reset();

    if (hideVCRules) {
      goTo('set_default_terms');
    }
  }, [isModalActive]);

  return (
    <div data-testid={MultiUseVirtualCardModalWrapper.role}>
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

MultiUseVirtualCardModalWrapper.role = 'multi-use-vc-modal-wrapper-component';
