import React from 'react';
import qrCode from '@lib/images/app_qr_code.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMobileNotch } from '@fortawesome/pro-light-svg-icons';
import Image from 'next/image';
import { mobileAppDownloadLink } from '@lib/constants/SiteVariables';

export default function PromoteApp() {
  return (
    <div className="col-span-3 md:col-span-1">
      <div className="flex gap-2">
        <div className="align-top mt-1">
          <FontAwesomeIcon icon={faMobileNotch} className="text-black text-4xl font-thin" />
        </div>
        <div className="align-top text-base font-semibold">
          Add funds and explore merchants on the go with the Credit Key app:
        </div>
      </div>
      <div className="mt-2 md:mt-4 text-center">
        <Image src={qrCode} alt="qr code for mobile app" width={150} className="hidden md:block mx-auto" />
        <a href={mobileAppDownloadLink} target="_blank" className="md:hidden text-primary-blue hover:text-primary-blue-hover font-semibold">Download Credit Key App</a>
      </div>
    </div>
  );
}


