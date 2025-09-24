import React from 'react';
import Image from 'next/image';

import useModal from '@hooks/useModal';
import vcSvg from '@lib/images/vc-blue.svg';
import PhysicalCardModalWrapper from '../home/widgets/virtual_cards/vc_modal/PhysicalCardModalWrapper';

export default function InactivePhysicalCard({ cardTitle }) {
  const { isModalActive, toggleModal } = useModal();

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
                onClick={toggleModal}
                className="w-full bg-primary-blue text-white px-4 py-3 text-xs sm:text-base rounded-lg font-semibold hover:bg-primary-blue-hover transition-colors"
              >
                Mail physical card
              </button>
            </div>
          </div>
        </div>
      </div>

      <PhysicalCardModalWrapper
        isModalActive={isModalActive}
        toggleModal={toggleModal}
      />
    </>
  );
}
