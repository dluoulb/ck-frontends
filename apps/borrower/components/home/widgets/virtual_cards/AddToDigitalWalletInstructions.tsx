import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet } from '@fortawesome/pro-regular-svg-icons';

export default function AddToDigitalWalletInstructions() {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="px-3 p-2">
        <div className="flex items-center gap-2.5 border-b border-primary-blue-hover/30 pb-3">
          <FontAwesomeIcon
            icon={faWallet}
            className="text-primary-blue text-base lg:text-xl"
          />

          <p className="text-lg md:text-xl font-bold">Add to Digital Wallet</p>
        </div>
        <div className="mt-2">
          <div>
            <ol className="mt-2 ml-4 list-decimal">
              <li>Head to your Wallet app</li>
              <li>Select the plus sign in the upper right corner</li>
              <li>Choose "Debit or Credit Card"</li>
              <li>Select "Enter card details manually" and enter your Virtual Card information from above</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

