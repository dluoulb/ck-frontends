import React from 'react';
import Script from 'next/script';

import useCompanyVirtualCard from '@apps/borrower/hooks/useCompanyVirtualCard';
import Loading from '@components/Loading';
import useModal from '@hooks/useModal';
import { qoloWidgetOrigin } from '@lib/constants/SiteVariables';
import ActiveMultiUseVirtualCard from './ActiveMultiUseVirtualCard';
import MultiUseVirtualCardModalWrapper from './vc_modal/MultiUseVirtualCardModalWrapper';
import DashboardVCSection from '../DashboardVCSection';

export default function MultiUseVirtualCard() {
  const { isModalActive, toggleModal } = useModal();
  const vcProps = useCompanyVirtualCard();

  const qoloWidgetUrl = `${qoloWidgetOrigin()}/widgets/js/qolo.initialize.v3.js`;

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
        <ActiveMultiUseVirtualCard virtualCard={vcProps.virtualCard} />
      )}
      <MultiUseVirtualCardModalWrapper
        isModalActive={isModalActive}
        toggleModal={toggleModal}
      />
    </div>
  );
}
