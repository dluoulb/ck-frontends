import React, { useEffect, useRef, useState } from 'react';
import { faCirclePlus } from '@fortawesome/pro-solid-svg-icons';
import { defineStepper } from '@stepperize/react';

import VcFlowDefaultPaymentMethodModal from '@apps/borrower/components/payment_methods/modals/VcFlowDefaultPaymentMethodModal';
import useCompanyPhysicalCard from '@apps/borrower/hooks/useCompanyPhysicalCard';
import useCompanyVirtualCard from '@apps/borrower/hooks/useCompanyVirtualCard';
import ModalWrapper from '@components/modals/ModalWrapper';
import { useEntity } from '@contexts/EntityContext';
import useApi from '@hooks/useApi';
import useModal from '@hooks/useModal';
import { getMerchant } from '@lib/actions/merchants';
import { jitEnabled } from '@lib/constants/SiteVariables';
import AddFundsModal from './AddFundsModal';
import CardholderAgreementModal from './CardholderAgreementModal';
import MultiUseVCRulesModal from './MultiUseVCRulesModal';
import MultiUseVirtualCardDetails from './MultiUseVirtualCardDetails';
import SetDefaultTermsModal from './SetDefaultTermsModal';

export default function MultiUseVirtualCardModalWrapper({
  isModalActive,
  toggleModal,
}: {
  isModalActive: boolean;
  toggleModal: () => void;
}) {
  const [hasAlert, setHasAlert] = useState(false);
  const { physicalCard } = useCompanyPhysicalCard();
  const { entity, fetchEntity } = useEntity();
  const { refetchVirtualCard } = useCompanyVirtualCard();
  const api = useApi();
  const [hasDefaultTerm, setHasDefaultTerm] = useState<boolean | null>(null);
  const hasCheckedDefaultTermRef = useRef(false);
  const wasModalActiveRef = useRef(false);
  const skipAgreementAndTerms = !!physicalCard;

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
          (setting) => setting.merchant_id === merchant.id,
        );
        setHasDefaultTerm(!!existingTerm);
      })
      .catch(() => {
        setHasDefaultTerm(false);
      });
  }, [api, entity, isModalActive]);

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
    bank_form: {
      bank_routing: '',
      bank_account: '',
      account_holder: '',
    },
  };

  const { modalState, setModalState, resetModalState } = useModal(defaultFormState);

  const syncVirtualCardAfterCreate = async (createdCard) => {
    const expectedCardId = createdCard?.id;
    const expectedExternalCardId = createdCard?.external_card_id;

    for (let attempt = 0; attempt < 3; attempt += 1) {
      const result = await refetchVirtualCard();
      const cards = Array.isArray(result?.data) ? result.data : [];
      const matchingCard =
        cards.find(
          (card) =>
            (expectedCardId && card.id === expectedCardId) ||
            (expectedExternalCardId && card.external_card_id === expectedExternalCardId),
        ) ?? cards.find((card) => card.type === 'VIRTUAL' && card.is_default);

      if (matchingCard?.status === 'ACTIVE') {
        return matchingCard;
      }

      if (matchingCard && attempt === 2) {
        return matchingCard;
      }

      if (attempt < 2) {
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
    }

    return createdCard;
  };

  const handleToggleModal = () => {
    toggleModal();

    if (modalState?.virtual_card) {
      refetchVirtualCard();
    }

    if (modalState?.shouldRefreshEntity) {
      fetchEntity();
    }
  };

  const modalProps = {
    next,
    prev,
    goTo,
    modalState,
    setModalState,
    reset,
    toggleModal: handleToggleModal,
    hasAlert,
    setHasAlert,
    createVcFlow: true,
    skipCardCreate: false,
    hasDefaultTerm: hasDefaultTerm,
    syncVirtualCardAfterCreate,
  };

  useEffect(() => {
    const wasModalActive = wasModalActiveRef.current;

    if (isModalActive && !wasModalActive) {
      reset();
      setHasAlert(false);
    }

    if (!isModalActive && wasModalActive) {
      reset();
      setHasAlert(false);
      resetModalState();
    }

    wasModalActiveRef.current = isModalActive;
  }, [isModalActive, reset, resetModalState]);

  return (
    <div data-testid={MultiUseVirtualCardModalWrapper.role}>
      <ModalWrapper
        toggleModal={handleToggleModal}
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
          }),
        )}
      </ModalWrapper>
    </div>
  );
}

MultiUseVirtualCardModalWrapper.role = 'multi-use-vc-modal-wrapper-component';
