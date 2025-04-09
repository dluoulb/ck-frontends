import PrimaryButton from '@components/buttons/PrimaryButton';
import { faCircleCheck } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import CkaInfo from './CkaInfo';

export default function MultiUseVirtualCardInfoPanel({ toggleModal }) {
  return (
    <div className="text-sm lg:text-base h-full">
      <ul className="pt-2">
        <li className="mt-2">
          <FontAwesomeIcon
            icon={faCircleCheck}
            className="text-green-500 mr-2"
          />
          <span>Tap into your line of credit anywhere Mastercard is accepted*</span>
        </li>
        <li className="mt-2">
          <FontAwesomeIcon
            icon={faCircleCheck}
            className="text-green-500 mr-2"
          />
          <span>Add the card to your digital wallet (Apple or Google) for easy access</span>
        </li>
        <li className="mt-2">
          <FontAwesomeIcon
            icon={faCircleCheck}
            className="text-green-500 mr-2"
          />
          <span>No additional fees or setup costs</span>
        </li>
      </ul>
      <PrimaryButton
        ariaLabel="activate-virtual-card-button"
        buttonText="Activate your card"
        buttonColor="bg-primary-blue"
        hoverClass="hover:bg-primary-blue-hover"
        containerClass="w-48 h-14 mt-2"
        pill={true}
        onClick={toggleModal}
      />
      <div className="hidden xl:block mt-2">
        <CkaInfo />
      </div>
    </div>
  );
}
