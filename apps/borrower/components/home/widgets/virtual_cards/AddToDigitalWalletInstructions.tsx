import React, { useState } from 'react';
import applePaySvg from '@lib/images/apple-pay.svg';
import googleWalletSvg from '@lib/images/google-wallet.svg';
import Image from 'next/image';
import ApplePayInstructions from './ApplePayInstructions';
import GoogleWalletInstructions from './GoogleWalletInstructions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet } from '@fortawesome/pro-regular-svg-icons';

export default function AddToDigitalWalletInstructions() {
  const [apple, showApple] = useState(true);

  const appleClasses = () => {
    const classes = ['text-white', 'p-1', 'rounded-l-lg', 'transition', 'ease-in-out', 'duration-300', 'w-1/2'];

    classes.push(apple ? 'bg-primary-blue' : 'bg-slate-300');

    return classes.join(' ');
  }

  const googleClasses = () => {
    const classes = ['text-white', 'p-1', 'rounded-r-lg', 'transition', 'ease-in-out', 'duration-300', 'w-1/2'];

    classes.push(apple ? 'bg-slate-300' : 'bg-primary-blue');

    return classes.join(' ');
  }

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
          <div className="w-full xl:w-96">
            <button className={appleClasses()} onClick={() => showApple(true)}>
              <Image
                src={applePaySvg} 
                alt="Apple Pay Logo" 
                className="h-5"
              />
            </button>
            <button className={googleClasses()} onClick={() => showApple(false)}>
              <Image
                src={googleWalletSvg} 
                alt="Google Wallet Logo" 
                className="h-5"
              />
            </button>
          </div>
          <div className={apple ? '' : 'hidden'}>
            <ApplePayInstructions />
          </div>
          <div className={apple ? 'hidden' : ''}>
            <GoogleWalletInstructions />
          </div>
        </div>
      </div>
    </div>
  );
}

