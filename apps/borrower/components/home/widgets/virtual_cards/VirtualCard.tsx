import React from 'react';
import { faCreditCard } from '@fortawesome/pro-regular-svg-icons';
import { faChevronRight } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Loading from '@components/Loading';
import { useBorrowerDeps } from '@contexts/BorrowerContext';
import useModal from '@hooks/useModal';
import { virtualCardLink } from '@lib/constants/SiteVariables';
import { VCModalWrapper } from './vc_modal';
import VCList from './VCList';

export default function VirtualCard() {
  const { isModalActive, toggleModal } = useModal();
  const { orders, ordersError, ordersLoading } = useBorrowerDeps();
  const virtualCardOrders = orders?.filter(
    (o) => o?.transaction_type === 'virtual_card' && !!o?.virtual_card_details
  );

  if (ordersLoading)
    return <Loading className="w-14 h-14 my-20 !text-primary" />;

  // TODO: SHOULD VIRTUAL CARDS BE MOVED TO ITS OWN PAGE??
  // Currently does not display or have 'hide' functionality for security code
  return (
    <div className="px-3 p-2 h-full">
      {(!virtualCardOrders?.length || ordersError) && !ordersLoading ? (
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
              Provide the merchant’s name and the order amount - we’ll send you
              a virtual card with the funds you need to pay for your order.
            </p>
            <div className='flex flex-col xl:flex-row xl:justify-between xl:items-center'>
              <button
                onClick={toggleModal}
                className="cursor-pointer hover:text-blue-900 border-b border-transparent hover:border-primary-blue-hover font-medium text-primary-blue-hover max-w-max"
              >
                Request New Card
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
      ) : (
        <>
          <div className="flex items-center gap-2.5 border-b border-primary-blue-hover/30 pb-3">
            <FontAwesomeIcon
              icon={faCreditCard}
              className="text-primary-blue text-base lg:text-xl"
            />
            <p className="text-lg md:text-xl font-bold">
              Request New Virtual Card
            </p>
          </div>
          <div className="text-sm md:text-base h-full mt-2 space-y-2">
            <div className="text-secondary-gray flex items-end justify-between">
              <p className="font-semibold">Active Virtual Cards</p>
              <p className="text-xs">Scroll for More</p>
            </div>
            <VCList vc_orders={virtualCardOrders} />
            {/* // TODO: SHOULD THIS LINK TO A VIRTUAL CARDS PAGE??
            <a
              href={virtualCardLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 cursor-pointer hover:text-blue-900 border-b border-transparent hover:border-primary-blue-hover font-medium text-primary-blue-hover max-w-max"
            >
              <span>View More Details</span>
              <FontAwesomeIcon
                icon={faChevronRight}
                className="text-[0.6rem] mt-[0.175rem] font-bold"
              />
            </a> */}
            <button
              onClick={toggleModal}
              className="cursor-pointer hover:text-blue-900 border-b border-transparent hover:border-primary-blue-hover font-medium text-primary-blue-hover max-w-max"
            >
              Request New Card
            </button>
          </div>
        </>
      )}
      <VCModalWrapper isModalActive={isModalActive} toggleModal={toggleModal} />
    </div>
  );
}
