import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet } from '@fortawesome/pro-light-svg-icons';

export default function PromoteDigitalWallet() {
  const instructions = [
    'Head to your wallet app',
    'Select the plus sign in the upper right corner',
    'Choose "Debit or Credit Card"',
    'Select "Enter card details manually" and enter the card information above',
  ];
  return (
    <div className="flex gap-2 col-span-3 md:col-span-1">
      <div className="align-top mt-1">
        <FontAwesomeIcon icon={faWallet} className="text-black text-4xl font-thin" />
      </div>
      <div className="align-top text-base font-semibold">
        Add to your phone's digital wallet for seamless purchases
        <ol className="list-decimal font-normal ml-4 mt-2">
          {instructions.map(step => <li key={step} className="text-primary-blue"><span className="text-black">{step}</span></li>)}
        </ol>
      </div>
    </div>
  );
}

