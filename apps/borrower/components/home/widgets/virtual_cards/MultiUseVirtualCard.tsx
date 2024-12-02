import React from 'react';
import { faCreditCard } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useCompanyVirtualCard from '@apps/borrower/hooks/useCompanyVirtualCard';
import ActiveMultiUseVirtualCard from './ActiveMultiUseVirtualCard';
import Script from 'next/script';
// import useModal from '@hooks/useModal';

export default function MultiUseVirtualCard() {
  // const { isModalActive, toggleModal } = useModal();
  const vcProps = useCompanyVirtualCard();
  return (
    <>
      <Script src="https://devapi.qolopay.com/widgets/js/qolo.initialize.v3.js" />
      <div className="flex items-center gap-2.5 border-b border-primary-blue-hover/30 pb-3">
        <FontAwesomeIcon
          icon={faCreditCard}
          className="text-primary-blue text-base lg:text-xl"
        />
        <p className="text-lg md:text-xl font-bold">Active Virtual Cards</p>
      </div>
      {vcProps.virtualCard && <div className="text-sm md:text-base h-full space-y-2">
        <ActiveMultiUseVirtualCard virtualCard={vcProps.virtualCard} />
      </div>}
    </>
  );
}
