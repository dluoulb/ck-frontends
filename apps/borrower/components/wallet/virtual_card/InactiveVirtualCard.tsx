import React from 'react';
import Image from 'next/image';

import useModal from '@hooks/useModal';
import vcSvg from '@lib/images/vc.svg';
import MultiUseVirtualCardModalWrapper from '../../home/widgets/virtual_cards/vc_modal/MultiUseVirtualCardModalWrapper';

interface InactiveVirtualCardProps {
  cardTitle: string;
  onActivate?: () => void;
}

export default function InactiveVirtualCard({ cardTitle, onActivate }: InactiveVirtualCardProps) {
  const { isModalActive: isActivationModalActive, toggleModal: toggleActivationModal } = useModal();
  const handleActivate = onActivate ?? toggleActivationModal;

  return (
    <>
      <div className="relative w-full mx-auto">
        <div className="relative rounded-xl overflow-hidden flex flex-col aspect-[385/244]">
          <Image
            src={vcSvg}
            alt={cardTitle}
            className="absolute inset-0 w-full h-full object-contain"
            fill
          />

          <div className="absolute inset-0 p-6 text-white flex flex-col justify-end z-10">
            <div className="flex-1 flex items-end">
              <button
                onClick={handleActivate}
                className="w-full bg-primary-blue text-white px-4 py-3 text-xs sm:text-base rounded-lg font-semibold hover:bg-primary-blue-hover transition-colors"
              >
                Activate Virtual Card Instantly
              </button>
            </div>
          </div>
        </div>
      </div>

      {!onActivate && (
        <MultiUseVirtualCardModalWrapper
          isModalActive={isActivationModalActive}
          toggleModal={toggleActivationModal}
        />
      )}
    </>
  );
}
