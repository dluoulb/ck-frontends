import React from 'react';
import { faCreditCard } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useCompanyVirtualCard from '@apps/borrower/hooks/useCompanyVirtualCard';
import ActiveMultiUseVirtualCard from './ActiveMultiUseVirtualCard';
import Script from 'next/script';
import Loading from '@components/Loading';
import useModal from '@hooks/useModal';
import MultiUseVirtualCardModalWrapper from './vc_modal/MultiUseVirtualCardModalWrapper';
import { virtualCardLink } from '@lib/constants/SiteVariables';
import { faChevronRight } from '@fortawesome/pro-solid-svg-icons';
import MultiUseVirtualCardSubLimits from './MultiUseVirtualCardSubLimits';

export default function MultiUseVirtualCard() {
  const { isModalActive, toggleModal } = useModal();
  const vcProps = useCompanyVirtualCard();

  return (
    <div className="px-3 p-2 h-full">
      <Script src="https://devapi.qolopay.com/widgets/js/qolo.initialize.v3.js" />
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
              <p className="text-lg md:text-xl font-bold">Get a Virtual Card</p>
            </div>
            <div className="text-sm md:text-base h-full mt-6 mb-2 space-y-2">
              <p className="font-medium">
                Request a virtual card to use your line of credit at any merchant!
              </p>
              <p className="text-sm md:min-h-24 md:max-h-28">
                Set your default terms - we’ll send you a virtual card to use at any merchant.
              </p>
              <div className="flex flex-col xl:flex-row xl:justify-between xl:items-center">
                <button
                  onClick={toggleModal}
                  className="cursor-pointer hover:text-blue-900 border-b border-transparent hover:border-primary-blue-hover font-medium text-primary-blue-hover max-w-max"
                >
                  Request Card
                </button>
                <a
                  href={virtualCardLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 font-medium group text-xs md:text-sm max-w-max"
                >
                  <span className="group-hover:text-primary-blue-hover border-b border-transparent group-hover:border-primary-blue-hover">
                    Learn More
                  </span>
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    className="text-[0.6rem] font-bold group-hover:text-primary-blue-hover"
                  />
                </a>
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
              <p className="text-lg md:text-xl font-bold">Active Virtual Cards</p>
            </div>
            <div className="text-sm md:text-base h-full space-y-2">
              <ActiveMultiUseVirtualCard virtualCards={[vcProps.virtualCard]} />
              <MultiUseVirtualCardSubLimits />
            </div>
          </>
        }
        <MultiUseVirtualCardModalWrapper isModalActive={isModalActive} toggleModal={toggleModal} />
      </div>
  );
}
