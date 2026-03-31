import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import ModalWrapper from '@components/modals/ModalWrapper';
import { useEntity } from '@contexts/EntityContext';
import { marketplace } from '@lib/actions/marketplace';
import { mobileAppDownloadLink } from '@lib/constants/SiteVariables';
import appQrCode from '@lib/images/app_qr_code.png';

interface HowToUseModalProps {
  isModalActive: boolean;
  toggleModal: () => void;
}

export default function HowToUseModal({ isModalActive, toggleModal }: HowToUseModalProps) {
  const { entity, entityLoading } = useEntity();
  const isAmazonExclusive = entity?.isAmazonExclusive === true;
  const showDiscoverSection = !entityLoading && !isAmazonExclusive;

  return (
    <ModalWrapper isModalActive={isModalActive} toggleModal={toggleModal}>
      <h2 className="font-bold text-xl">Credit Key Virtual Card</h2>
      <div className="space-y-8 mt-4">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-gray-900">1. Download the iOS or Android App</h3>

          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <Image
                src={appQrCode}
                alt="Credit Key Mobile App QR Code"
                width={120}
                height={120}
                className="rounded-lg"
              />
            </div>
            <div className="flex-1 px-8 flex items-center justify-center">
              <p className="text-sm text-gray-700">
                Use your card on the go in the{' '}
                <Link
                  href={mobileAppDownloadLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 font-medium hover:text-blue-600"
                >
                  Credit Key Mobile App
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-bold text-gray-900">
            2. Add Card to your phone's digital wallet manually
          </h3>

          <div>
            <p className="text-sm text-gray-700">1. Open your phone's wallet app</p>
            <p className="text-sm text-gray-700">
              2. Select the plus sign in the upper right corner
            </p>
            <p className="text-sm text-gray-700">3. Choose 'Debit or Credit Card'</p>
            <p className="text-sm text-gray-700">
              4. Select 'Enter card details manually' and enter your Credit Key Card's information
            </p>
          </div>
        </div>

        {showDiscoverSection && (
          <div className="space-y-1">
            <h3 className="text-base font-bold text-gray-900">3. Discover Merchants</h3>

            <div className="space-y-3">
              <p className="text-sm text-gray-700">
                Easily access your favorite merchants and discover new ones in the Credit Key
                Marketplace.
              </p>

              <Link
                href={marketplace.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 font-medium text-sm"
              >
                Discover Merchants →
              </Link>
            </div>
          </div>
        )}
      </div>
    </ModalWrapper>
  );
}
