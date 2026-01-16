import React from 'react';
import { faCreditCard } from '@fortawesome/pro-regular-svg-icons';
import { faChevronRight } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';

import Loading from '@components/Loading';
import { useBorrowerDeps } from '@contexts/BorrowerContext';
import useModal from '@hooks/useModal';
import { ckaLink, virtualCardLink } from '@lib/constants/SiteVariables';
import vcVisa from '@lib/images/vc_cardart_visa.png';
import { VCModalWrapper } from './vc_modal';
import VCList from './VCList';

export default function SingleUseVirtualCard() {
  const { isModalActive, toggleModal } = useModal();
  const { orders, ordersError, ordersLoading } = useBorrowerDeps();
  const virtualCardOrders = orders?.filter(
    (o) => o?.transaction_type === 'virtual_card' && !!o?.virtual_card_details,
  );

  if (ordersLoading) return <Loading className="w-14 h-14 my-20 !text-primary" />;

  // TODO: SHOULD VIRTUAL CARDS BE MOVED TO ITS OWN PAGE??

  return (
    <div className="px-3 p-2 h-full">
      {(!virtualCardOrders?.length || ordersError) && !ordersLoading ? (
        <>
          <div className="flex items-center gap-2.5 border-b border-primary-blue-hover/30 pb-3">
            <FontAwesomeIcon
              icon={faCreditCard}
              className="text-primary-blue text-base lg:text-xl"
            />
            <p className="text-lg md:text-xl font-bold">Create My Virtual Card</p>
          </div>
          <div className="text-sm md:text-base h-full mt-6 mb-2 space-y-2">
            <p className="text-sm">
              Virtual card comes at no additional cost and enables you to use your existing line of
              credit for eligible business purchases anywhere that accepts Visa, meaning you can pay
              over time even with merchants who don’t yet offer Credit Key as a payment option.
            </p>
            <p className="text-sm md:min-h-24 md:max-h-28">
              You’ll create one card for each purchase as needed (each card is single-use). Once you
              know where you need to purchase from and what the order amount is, hit “create card”
              below and follow the prompts to generate your card instantly.
            </p>
            <div className="flex flex-col xl:flex-row xl:justify-between xl:items-center">
              <button
                onClick={toggleModal}
                className="cursor-pointer hover:text-blue-900 border-b border-transparent hover:border-primary-blue-hover font-medium text-primary-blue-hover max-w-max"
              >
                Create card
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
            <p className="text-lg md:text-xl font-bold">Active Virtual Cards</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-3 md:col-span-1">
              <Image
                src={vcVisa}
                alt="Virtual Card Image"
                className="mt-5 w-4/6 max-w-max mx-auto rounded-md"
              />
            </div>
            <div className="col-span-3 md:col-span-1 text-sm md:text-base h-full space-y-2">
              <VCList vc_orders={virtualCardOrders} />
              <div className="flex justify-between items-end">
                <button
                  onClick={toggleModal}
                  className="cursor-pointer hover:text-blue-900 border-b border-transparent hover:border-primary-blue-hover font-medium text-primary-blue-hover max-w-max"
                >
                  Request New Card
                </button>
                <p className="text-xs">Scroll for More</p>
              </div>
            </div>
            <div className="col-span-3 md:col-span-1 md:col-start-2 mt-5">
              <p className="text-sm">
                If you'd like to pay with Credit Key at a merchant who doesn't accept credit cards,
                you can send us your invoice directly and we will apply the payment for you using
                your existing line of credit.{' '}
                <a
                  href={ckaLink}
                  target="_blank"
                  className="flex items-center gap-1 cursor-pointer hover:text-primary-blue-hover border-b border-transparent hover:border-primary-blue-hover font-medium text-primary-blue-hover max-w-max !mt-6 md:!mt-0"
                >
                  Learn more
                </a>
              </p>
            </div>
          </div>
        </>
      )}
      <VCModalWrapper isModalActive={isModalActive} toggleModal={toggleModal} />
    </div>
  );
}
