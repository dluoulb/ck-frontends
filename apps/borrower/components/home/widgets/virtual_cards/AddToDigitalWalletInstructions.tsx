import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMobile } from '@fortawesome/pro-regular-svg-icons';
import qrCode from '@lib/images/app_qr_code.png';
import { mobileAppDownloadLink } from '@lib/constants/SiteVariables';
import Image from 'next/image';

export default function AddToDigitalWalletInstructions() {
  return (
    <div className="flex flex-col gap-2 w-full mt-4">
      <div className="flex gap-2 bg-gray-50 rounded-lg p-4">
        <div className="text-base font-semibold">
          Seamlessly add funds and explore merchants with the credit key app
        </div>
        <div className="">
          <Image src={qrCode} alt="qr code for mobile app" width={150} className="hidden md:block mx-auto" />
          <a href={mobileAppDownloadLink} target="_blank" className="md:hidden text-primary-blue hover:text-primary-blue-hover font-semibold">Download Credit Key App</a>
        </div>
      </div>
      <div className="px-3 p-2">
        <div className="flex items-center gap-2.5 pb-3">
          <div className="bg-primary-blue rounded-lg w-8 h-8 text-center">
            <FontAwesomeIcon
              icon={faMobile}
              className="text-white text-base lg:text-xl align-middle"
            />
          </div>

          <p className="text-lg md:text-xl font-bold text-primary-blue">Add to your phone's digital wallet</p>
        </div>
        <div className="mt-2 border border-gray-100 rounded-lg px-4 py-2">
          <div>
            <ol className="mt-2 ml-4 list-decimal">
              <li>Head to your Wallet app</li>
              <li>Select the plus sign in the upper right corner</li>
              <li>Choose "Debit or Credit Card"</li>
              <li>Select "Enter card details manually" and enter your Credit Key Card information from above</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

