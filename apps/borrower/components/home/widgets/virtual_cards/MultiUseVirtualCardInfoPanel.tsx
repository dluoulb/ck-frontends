import PrimaryButton from '@components/buttons/PrimaryButton';
import { faArrowRight, faCircleCheck, faFileLines } from '@fortawesome/pro-regular-svg-icons';
import { faCreditCard } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { ckaLink } from '@lib/constants/SiteVariables';

export default function MultiUseVirtualCardInfoPanel({ toggleModal }) {
  return (
    <div className="text-sm lg:text-base h-full shadow-md rounded-lg bg-white">
      <div className="p-2 lg:p-4">
        <h1 className="text-xl text-primary-blue-hover font-bold">Unlock Your Credit Key Prepaid Mastercard®</h1>
        <ul className="pt-2">
          <li className="mt-2">
            <FontAwesomeIcon
              icon={faCircleCheck}
              className="text-green-500 mr-2"
            />
            <span className="font-semibold">No additional cost - </span>
            <span>Use your existing line of credit anywhere that accepts credit cards</span>
          </li>
          <li className="mt-2">
            <FontAwesomeIcon
              icon={faCircleCheck}
              className="text-green-500 mr-2"
            />
            <span className="font-semibold">Multi-use card - </span>
            <span>Pay over time even with merchants who don't offer Credit Key</span>
          </li>
          <li className="mt-2">
            <FontAwesomeIcon
              icon={faCircleCheck}
              className="text-green-500 mr-2"
            />
            <span className="font-semibold">Digital wallet integration - </span>
            <span>Seamlessly use as a recurring payment method</span>
          </li>
        </ul>
        <PrimaryButton
          ariaLabel="create-virtual-card-button"
          buttonText="Create My Virtual Card"
          icon={faCreditCard}
          buttonColor="bg-primary-blue"
          hoverClass="hover:bg-primary-blue-hover"
          containerClass="mx-auto w-60 h-16 mt-2"
          onClick={toggleModal}
        />
        <div className="p-2 md:p-4 border-blue-200 border rounded-md bg-blue-100 flex mt-2">
          <div className="pr-3">
            <FontAwesomeIcon
              icon={faFileLines}
              className="text-primary-blue"
            />
          </div>
          <div className="flex-col">
            <p className="text-sm lg:text-base">If you'd like to pay with Credit Key at a merchant who doesn't accept credit cards, you can send us your invoice directly and we will apply the payment for you using your existing line of credit.</p>
            <a href={ckaLink} target="_blank" className="text-primary-blue hover:text-primary-blue-hover font-semibold">
              Learn more <FontAwesomeIcon icon={faArrowRight} />
            </a>
          </div>
        </div>
        <div className="border-t border-gray-200 flex justify-center items-center mt-4">
          <p className="text-sm text-gray-600 mt-2">This card is issued by Sutton Bank, Member FDIC, pursuant to license by Mastercard Internation Inc.</p>
        </div>
      </div>
    </div>
  );
}



