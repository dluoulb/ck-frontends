import React, { useEffect, useRef, useState } from 'react';
import { faCirclePlus } from '@fortawesome/pro-solid-svg-icons';
import { defineStepper } from '@stepperize/react';

import VcFlowDefaultPaymentMethodModal from '@apps/borrower/components/payment_methods/modals/VcFlowDefaultPaymentMethodModal';
import useCompanyVirtualCard from '@apps/borrower/hooks/useCompanyVirtualCard';
import ModalWrapper from '@components/modals/ModalWrapper';
import { useEntity } from '@contexts/EntityContext';
import useApi from '@hooks/useApi';
import useModal from '@hooks/useModal';
import { getMerchant } from '@lib/actions/merchants';
import CardholderAgreementModal from './CardholderAgreementModal';
import ConfirmMailingAddressModal from './ConfirmMailingAddressModal';
import MultiUseVCRulesModal from './MultiUseVCRulesModal';
import SetDefaultTermsModal from './SetDefaultTermsModal';

export default function PhysicalCardModalWrapper({
  isModalActive,
  toggleModal,
}) {
  const [hasAlert, setHasAlert] = useState(false);
  const { virtualCard } = useCompanyVirtualCard();
  const { entity } = useEntity();
  const api = useApi();
  const [hasDefaultTerm, setHasDefaultTerm] = useState<boolean | null>(null);
  const hasCheckedDefaultTermRef = useRef(false);

  useEffect(() => {
    if (!isModalActive) {
      setHasDefaultTerm(null);
      hasCheckedDefaultTermRef.current = false;
      return;
    }

    if (hasCheckedDefaultTermRef.current || !entity?.id) {
      return;
    }

    hasCheckedDefaultTermRef.current = true;

    getMerchant(api, 'virtual')
      .then((merchant) => {
        const existingTerm = entity?.recharge_settings?.find(
          (setting) => setting.merchant_id === merchant.id
        );
        setHasDefaultTerm(!!existingTerm);
      })
      .catch(() => {
        setHasDefaultTerm(false);
      });
  }, [entity, isModalActive]);

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
      hide: !!entity?.is_bank_connected,
    },
    {
      id: 'set_default_terms',
      component: SetDefaultTermsModal,
      hide: hasDefaultTerm,
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
    hasDefaultTerm: hasDefaultTerm,
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
