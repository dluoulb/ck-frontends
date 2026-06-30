import React, { useEffect, useState } from 'react';

import ActiveCardSection from '@apps/borrower/components/wallet/ActiveCardSection';
import InactiveCardSection from '@apps/borrower/components/wallet/InactiveCardSection';
import useCompanyVirtualCard from '@apps/borrower/hooks/useCompanyVirtualCard';
import Loading from '@components/Loading';
import {
  physicalCardBenefitsConfig,
  virtualCardBenefitsConfig,
} from '@lib/constants/SiteVariables';
import { captureEvent } from '@lib/posthog';
import CompanyVirtualCardRecord from '@lib/records/company_virtual_card';

interface ModalState {
  virtual_card?: CompanyVirtualCardRecord;
  default_term_setting?: {
    merchant_id?: string;
    merchant_name?: string;
    merchant_slug?: string;
    default_term?: {
      term?: number | string;
      term_period?: string;
    };
    term_options?: unknown[];
  };
  [key: string]: unknown;
}

function resolveActiveCard(
  hookCard: CompanyVirtualCardRecord | null,
  modalCard: CompanyVirtualCardRecord | undefined,
): CompanyVirtualCardRecord | null {
  if (hookCard?.status === 'ACTIVE') return hookCard;
  if (modalCard) return modalCard;
  return null;
}

export default function MultiUseVirtualCardDetails({
  modalState,
  createVcFlow,
}: {
  modalState?: ModalState;
  createVcFlow?: boolean;
}) {
  const vcProps = useCompanyVirtualCard();
  const [showWidget, setShowWidget] = useState(false);

  useEffect(() => {
    if (createVcFlow) {
      captureEvent('virtual_card_provisioned');
    }
  }, [createVcFlow]);

  const handleShowWidget = () => setShowWidget(true);
  const handleHideWidget = () => setShowWidget(false);

  if (!vcProps) {
    return (
      <div className="h-full flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  const activeCard = resolveActiveCard(vcProps.virtualCard, modalState?.virtual_card);
  const shouldShowLoadingState = vcProps.virtualCardLoading && !activeCard;

  return (
    <div className="space-y-8 mt-3">
      {shouldShowLoadingState ? (
        <div className="flex justify-center items-center py-8">
          <Loading />
        </div>
      ) : (
        <>
          {activeCard && (
            <ActiveCardSection
              card={activeCard}
              cardType="virtual"
              showWidget={showWidget}
              onShowWidget={handleShowWidget}
              onHideWidget={handleHideWidget}
              defaultTermSetting={modalState?.default_term_setting}
            />
          )}

          {!activeCard && (
            <InactiveCardSection
              title="Credit Key Virtual Card"
              bgColor="F4F8FF"
              benefitsConfig={virtualCardBenefitsConfig}
            />
          )}

          {!activeCard && (
            <InactiveCardSection
              title="Credit Key Physical Card"
              bgColor="fff7ec"
              benefitsConfig={physicalCardBenefitsConfig}
            />
          )}

          {!activeCard && vcProps.virtualCardError && (
            <div className="text-center py-8 text-error">
              An error occurred loading your cards. Please contact support.
            </div>
          )}
        </>
      )}
    </div>
  );
}
