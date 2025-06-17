import React from 'react';
import vc from '@lib/images/vc-blank-mastercard.png';
import Image from 'next/image';

export default function ExampleVirtualCard() {
  return (
    <div className="text-sm md:text-base">
      <div className="w-[275px] lg:w-[315px] mx-auto py-5">
        <Image
          src={vc}
          alt="Credit Key Card Example Image"
          className="rounded-xl shadow-lg shadow-slate-800"
        />
      </div>
    </div>
  );
}


