import React from 'react';
import Script from 'next/script';

import useCompanyPhysicalCard from '@apps/borrower/hooks/useCompanyPhysicalCard';
import useCompanyVirtualCard from '@apps/borrower/hooks/useCompanyVirtualCard';
import Loading from '@components/Loading';
import useModal from '@hooks/useModal';
import { qoloWidgetOrigin } from '@lib/constants/SiteVariables';
import ActiveMultiUseVirtualCard from './ActiveMultiUseVirtualCard';
import MultiUseVirtualCardModalWrapper from './vc_modal/MultiUseVirtualCardModalWrapper';
import DashboardPCSection from '../DashboardPCSection';
import DashboardVCSection from '../DashboardVCSection';

export default function MultiUseVirtualCard() {
  const { isModalActive, toggleModal } = useModal();
  const vcProps = useCompanyVirtualCard();
  const { physicalCard } = useCompanyPhysicalCard();

  const qoloWidgetUrl = `${qoloWidgetOrigin()}/widgets/js/qolo.initialize.v3.js`;

  const showPhysicalCardPresentment =
    vcProps.virtualCard &&
    vcProps.virtualCard.status === 'ACTIVE' &&
    !physicalCard;

  return (
    <div className="h-full">
      <Script src={qoloWidgetUrl} />
      {vcProps.virtualCardLoading && <Loading />}
      {!vcProps.virtualCardLoading &&
        !vcProps.virtualCard &&
        vcProps.virtualCardError && (
          <div>An error occurred. Please contact support</div>
        )}
      {!vcProps.virtualCardLoading &&
        !vcProps.virtualCard &&
        !vcProps.virtualCardError && <DashboardVCSection />}
      {!vcProps.virtualCardLoading && vcProps.virtualCard && (
        <div className="space-y-4">
          {showPhysicalCardPresentment && <DashboardPCSection />}
          <ActiveMultiUseVirtualCard virtualCard={vcProps.virtualCard} />
        </div>
      )}
      <MultiUseVirtualCardModalWrapper
        isModalActive={isModalActive}
        toggleModal={toggleModal}
      />
    </div>
  );
}
