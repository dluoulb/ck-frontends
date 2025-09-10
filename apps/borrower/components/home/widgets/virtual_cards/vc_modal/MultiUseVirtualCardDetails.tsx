import React from 'react';

import ActiveCardSection from '@apps/borrower/components/wallet/ActiveCardSection';
import InactiveCardSection from '@apps/borrower/components/wallet/InactiveCardSection';
import useCompanyVirtualCard from '@apps/borrower/hooks/useCompanyVirtualCard';
import Loading from '@components/Loading';

export default function MultiUseVirtualCardDetails() {
  const vcProps = useCompanyVirtualCard();

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
            <ActiveCardSection virtualCard={vcProps.virtualCard} />
          )}

          {(!vcProps.virtualCard ||
            vcProps.virtualCard.status !== 'ACTIVE') && <InactiveCardSection />}

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
