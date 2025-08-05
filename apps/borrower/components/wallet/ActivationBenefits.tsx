import React from 'react';
import { faCheck } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function ActivationBenefits() {
  return (
    <div className="h-full p-6 flex flex-col justify-center">
      <h3 className="text-lg font-bold mb-4">
        Activate Your Credit Key Virtual Card
      </h3>
      <p className="mb-4 text-base">
        Use your line of credit anywhere Mastercard Prepaid Debit is accepted in
        the US.
      </p>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <FontAwesomeIcon icon={faCheck} className="text-success text-2xl" />
          <p className="text-base">
            Add the card to your digital wallet (Apple or Google Wallet) for
            easy access
          </p>
        </div>
        <div className="flex items-center gap-3">
          <FontAwesomeIcon icon={faCheck} className="text-success text-2xl" />
          <p className="text-base">
            Access in the Credit Key iOS or Android Mobile App
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <FontAwesomeIcon icon={faCheck} className="text-success text-2xl" />
          <p className="text-base">No extra fees or setup costs</p>
        </div>
      </div>
    </div>
  );
}
