import React from 'react';
import vcMastercard from '@lib/images/vc-cardart-mastercard.png';
import Image from 'next/image';

export default function MaskedVirtualCard({virtualCard, onView}) {
  const cardNumberDisplay = (vc) => {
    return (
      <>
        ••••{'  '}
        ••••{'  '}
        ••••{'  '}
        {vc.last_four}
      </>
    );
  };

  return (
    <div className="w-full">
      <div className="text-md sm:text-sm lg:text-base relative w-72 sm:w-64 lg:w-80 mx-auto">
        <Image
          src={vcMastercard}
          alt="Virtual Card Image"
          className="rounded-xl"
        />
        <div className="text-white absolute left-5 top-[116px] sm:left-4 sm:top-[104px] lg:left-5 lg:top-32">
          {cardNumberDisplay(virtualCard)}
        </div>
        <span className="text-white absolute left-5 top-[146px] sm:left-4 sm:top-[130px] lg:left-5 lg:top-40">EXP ••/••</span>
        <span className="text-white absolute left-28 top-[146px] sm:left-28 sm:top-[130px] lg:left-32 lg:top-40">CVV •••</span>
        <button
          type="button"
          className="bg-white text-primary-blue transition duration-150 ease-in-out hover:bg-slate-300 px-3 py-1.5 rounded-lg font-semibold absolute top-5 right-5"
          onClick={onView}
        >
          View
        </button>
      </div>
    </div>
  );
};
