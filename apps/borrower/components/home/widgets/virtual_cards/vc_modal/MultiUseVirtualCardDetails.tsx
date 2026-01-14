import React, { useState } from 'react';

import ActiveCardSection from '@apps/borrower/components/wallet/ActiveCardSection';
import InactiveCardSection from '@apps/borrower/components/wallet/InactiveCardSection';
import useCompanyVirtualCard from '@apps/borrower/hooks/useCompanyVirtualCard';
import Loading from '@components/Loading';
import {
  physicalCardBenefitsConfig,
  virtualCardBenefitsConfig,
} from '@lib/constants/SiteVariables';

export default function MultiUseVirtualCardDetails() {
  const vcProps = useCompanyVirtualCard();
  const [showWidget, setShowWidget] = useState(false);

  const handleShowWidget = () => setShowWidget(true);
  const handleHideWidget = () => setShowWidget(false);

  if (!vcProps) {
    return (
      <div className="h-full flex justify-center items-center">
        <Loading />
      </div>
    );
  }
  return (
    <div className="space-y-8 mt-3">
      {vcProps.virtualCardLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loading />
        </div>
      ) : (
        <>
          {vcProps.virtualCard && vcProps.virtualCard.status === 'ACTIVE' && (
            <ActiveCardSection
              card={vcProps.virtualCard}
              cardType="virtual"
              showWidget={showWidget}
              onShowWidget={handleShowWidget}
              onHideWidget={handleHideWidget}
            />
          )}

          {(!vcProps.virtualCard || vcProps.virtualCard.status !== 'ACTIVE') && (
            <InactiveCardSection
              title="Credit Key Virtual Card"
              bgColor="F4F8FF"
              benefitsConfig={virtualCardBenefitsConfig}
            />
          )}

          {(!vcProps.virtualCard || vcProps.virtualCard.status !== 'ACTIVE') && (
            <InactiveCardSection
              title="Credit Key Physical Card"
              bgColor="fff7ec"
              benefitsConfig={physicalCardBenefitsConfig}
            />
          )}

          {!vcProps.virtualCard && vcProps.virtualCardError && (
            <div className="text-center py-8 text-error">
              An error occurred loading your cards. Please contact support.
            </div>
          )}
        </>
      )}
    </div>
  );
}
