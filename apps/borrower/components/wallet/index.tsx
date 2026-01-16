import { useState } from 'react';
import classNames from 'classnames';

import useCompanyPhysicalCard from '@apps/borrower/hooks/useCompanyPhysicalCard';
import useCompanyVirtualCard from '@apps/borrower/hooks/useCompanyVirtualCard';
import Loading from '@components/Loading';
import {
  physicalCardBenefitsConfig,
  virtualCardBenefitsConfig,
} from '@lib/constants/SiteVariables';
import ActiveCardSection from './ActiveCardSection';
import InactiveCardSection from './InactiveCardSection';
import PendingTransactionsSection from './PendingTransactionsSection';
import PendingPhysicalCard from './physical_card/PendingPhysicalCard';
import SelectionWidget from '../home/widgets/SelectionWidget';
import SuttonVcDisclosure from '../home/widgets/virtual_cards/SuttonVcDisclosure';

export default function Wallet() {
  const vcProps = useCompanyVirtualCard();
  const pcProps = useCompanyPhysicalCard();
  const [active, setActive] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [activeWidget, setActiveWidget] = useState<'virtual' | 'physical' | null>(null);

  const handleSelect = (index) => {
    setActive(index);
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].screenX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.touches[0].screenX);
  };

  const handleTouchEnd = () => {
    const direction = touchEnd - touchStart > 0 ? 'right' : 'left';

    if (direction === 'left' && active < 1) {
      setActive(active + 1);
    } else if (direction === 'right' && active > 0) {
      setActive(active - 1);
    }
  };

  if (vcProps.virtualCardLoading && pcProps.physicalCardLoading) {
    return (
      <div className="h-full flex justify-center items-center">
        <Loading />
      </div>
    );
  }
  return (
    <div
      data-testid="wallet-container"
      className="my-4 md:my-6 mx-auto h-full xl:max-w-[90%]"
      role={Wallet.role}
    >
      <div className="h-full">
        <h1 className="text-2xl md:text-3xl font-bold text-primary capitalize mb-8">Wallet</h1>

        <div className="space-y-8">
          {vcProps.virtualCardLoading || pcProps.physicalCardLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loading />
            </div>
          ) : (
            <>
              <div
                className="grid grid-cols-2 gap-4 md:gap-8 lg:gap-12 xl:gap-16"
                onTouchStart={(touchStartEvent) => handleTouchStart(touchStartEvent)}
                onTouchMove={(touchMoveEvent) => handleTouchMove(touchMoveEvent)}
                onTouchEnd={() => handleTouchEnd()}
              >
                <div
                  className={classNames(
                    'col-span-2 md:col-span-1 md:block',
                    active !== 0 ? 'hidden' : '',
                  )}
                >
                  {vcProps.virtualCard && vcProps.virtualCard.status === 'ACTIVE' && (
                    <ActiveCardSection
                      card={vcProps.virtualCard}
                      cardType="virtual"
                      showWidget={activeWidget === 'virtual'}
                      onShowWidget={() => setActiveWidget('virtual')}
                      onHideWidget={() => setActiveWidget(null)}
                    />
                  )}

                  {(!vcProps.virtualCard || vcProps.virtualCard.status !== 'ACTIVE') && (
                    <InactiveCardSection
                      title="Credit Key Virtual Card"
                      bgColor="F4F8FF"
                      benefitsConfig={virtualCardBenefitsConfig}
                    />
                  )}
                </div>

                <div
                  className={classNames(
                    'col-span-2 md:col-span-1 md:block',
                    active !== 1 ? 'hidden' : '',
                  )}
                >
                  {pcProps.physicalCard && pcProps.physicalCard.status === 'ACTIVE' && (
                    <ActiveCardSection
                      card={pcProps.physicalCard}
                      cardType="physical"
                      showWidget={activeWidget === 'physical'}
                      onShowWidget={() => setActiveWidget('physical')}
                      onHideWidget={() => setActiveWidget(null)}
                    />
                  )}
                  {pcProps.physicalCard && pcProps.physicalCard.status === 'PENDING' && (
                    <PendingPhysicalCard />
                  )}
                  {(!pcProps.physicalCard ||
                    (pcProps.physicalCard.status !== 'ACTIVE' &&
                      pcProps.physicalCard.status !== 'PENDING')) && (
                    <InactiveCardSection
                      title="Credit Key Physical Card"
                      bgColor="fff7ec"
                      cardType="physical"
                      benefitsConfig={physicalCardBenefitsConfig}
                    />
                  )}
                </div>
                <div className="flex justify-center items-center col-span-2">
                  <SelectionWidget count={2} activeIndex={active} onSelect={handleSelect} />
                </div>
              </div>

              {!vcProps.virtualCard && vcProps.virtualCardError && (
                <div className="text-center py-8 text-error">
                  An error occurred loading your cards. Please contact support.
                </div>
              )}

              <PendingTransactionsSection />
              <SuttonVcDisclosure />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

Wallet.role = 'wallet-page';
