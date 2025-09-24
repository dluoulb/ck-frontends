import React from 'react';
import Image from 'next/image';

import useModal from '@hooks/useModal';
import vcSvg from '@lib/images/vc-blue.svg';
import PhysicalCardActivationModal from '../home/widgets/virtual_cards/vc_modal/PhysicalCardActivationModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';

export default function PendingPhysicalCard() {
  const { isModalActive, toggleModal } = useModal();

  return (
    <>
      <div className="space-y-4">
        <div className={`bg-[#eee] shadow-sm border rounded-2xl`}>
          <div className="flex flex-col">
            <div className="w-full rounded-2xl bg-white border mx-auto py-3">
              <div className="space-y-3 flex flex-col items-center">
                <div className="flex items-center justify-between w-full px-4">
                  <h3 className="text-lg font-bold text-gray-900">Credit Key Physical Card</h3>
                  <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-lg">
                    Pending
                  </span>
                </div>

                <div className="relative w-full mx-auto">
                  <div className="relative rounded-xl overflow-hidden flex flex-col aspect-[385/244]">
                    <Image
                      src={vcSvg}
                      alt="Credit Key Physical Card"
                      className="absolute inset-0 w-full h-full object-contain"
                      fill
                    />

                    <div className="absolute inset-0 p-6 text-white flex flex-col justify-end z-10">
                      <div className="flex-1 flex items-end">
                        <button
                          onClick={toggleModal}
                          className="w-full bg-primary-blue text-white px-4 py-3 text-xs sm:text-base rounded-lg font-semibold hover:bg-primary-blue-hover transition-colors"
                        >
                          Activate Card
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='flex px-5 gap-3'>
                  <span className='p-3 my-auto bg-gray-200 rounded-[50%]'>
                    <FontAwesomeIcon icon={faEnvelope} className='text-2xl text-primary-blue' />
                  </span>
                  <span className='text-sm'>
                    <p className='font-bold'>Received your card in the mail?</p>
                    <p>Your card is currently on the way. Activate it here after you receive it in the mail.</p>
                  </span>
                </div>
              </div>
            </div>
            <div className="w-full">
            </div>
          </div>
        </div>
      </div>


      <PhysicalCardActivationModal
        isModalActive={isModalActive}
        toggleModal={toggleModal}
      />
    </>
  );
}
