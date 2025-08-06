import React from 'react';
import { faCreditCard, faInfoCircle } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useCompanyVirtualCard from '@apps/borrower/hooks/useCompanyVirtualCard';
import ActiveMultiUseVirtualCard from './ActiveMultiUseVirtualCard';
import Script from 'next/script';
import Loading from '@components/Loading';
import useModal from '@hooks/useModal';
import MultiUseVirtualCardModalWrapper from './vc_modal/MultiUseVirtualCardModalWrapper';
import PrepaidCardBalance from './PrepaidCardBalance';
import ExampleVirtualCard from './ExampleVirtualCard';
import MultiUseVirtualCardInfoPanel from './MultiUseVirtualCardInfoPanel';
import { multiUseVcIvrPhone, qoloWidgetOrigin } from '@lib/constants/SiteVariables';
import CkaInfo from './CkaInfo';

export default function MultiUseVirtualCard() {
  const { isModalActive, toggleModal } = useModal();
  const vcProps = useCompanyVirtualCard();

  const qoloWidgetUrl = `${qoloWidgetOrigin()}/widgets/js/qolo.initialize.v3.js`;

  return (
    <div className="px-3 p-2 h-full">
      <Script src={qoloWidgetUrl} />
        {vcProps.virtualCardLoading && <Loading />}
        {!vcProps.virtualCardLoading && !vcProps.virtualCard && vcProps.virtualCardError &&
          <div>An error occurred. Please contact support</div>
        }
        {!vcProps.virtualCardLoading && !vcProps.virtualCard && !vcProps.virtualCardError &&
          <>
            <div className="flex items-center gap-2.5 border-b border-primary-blue-hover/30 pb-3">
              <FontAwesomeIcon
                icon={faCreditCard}
                className="text-primary-blue text-base lg:text-xl"
              />
              <p className="text-lg md:text-xl font-bold">Pay with My Credit Key Card</p>
            </div>
            <div className="grid grid-cols-10 gap-3">
              <div className="col-span-10 md:col-span-5 xl:col-span-6 2xl:col-span-7">
                <MultiUseVirtualCardInfoPanel toggleModal={toggleModal} />
              </div>
              <div className="col-span-10 md:col-span-5 xl:col-span-4 2xl:col-span-3">
                <ExampleVirtualCard />
              </div>
              <div className="col-span-10 xl:hidden">
                <CkaInfo notice={true} />
              </div>
            </div>
          </>
        }
        {!vcProps.virtualCardLoading && vcProps.virtualCard &&
          <>   
            <div className="flex items-center gap-2.5 border-b border-primary-blue-hover/30 pb-3">
              <FontAwesomeIcon
                icon={faCreditCard}
                className="text-primary-blue text-base lg:text-xl"
              />
              <p className="text-lg md:text-xl font-bold">My Credit Key Prepaid Mastercard®</p>
            </div>
            <div className="grid gap-3 grid-cols-2">
              <div className="col-span-2 md:col-span-1 mt-5">
                <ActiveMultiUseVirtualCard virtualCard={vcProps.virtualCard} />
              </div>
              <div className="col-span-2 md:col-span-1 mt-5">
                <PrepaidCardBalance allowCardClose={false} isJitEnabled={vcProps.virtualCard.just_in_time_funding}/>
              </div>
              <div className="col-span-2 mt-5 border-t border-gray-300"></div>
              <div className="col-span-2 mt-2">
                <span className="text-gray-600 text-sm">
                  <FontAwesomeIcon icon={faInfoCircle} className="text-primary-blue mr-2" />
                  When purchasing in-person, you may be asked for a PIN. Call <span className="font-semibold">{multiUseVcIvrPhone}</span> to set your pin.
                </span>
              </div>
              <div className="col-span-2 mt-2">
                <CkaInfo />
              </div>
            </div>
          </>
        }
        <MultiUseVirtualCardModalWrapper isModalActive={isModalActive} toggleModal={toggleModal} />
      </div>
  );
}
