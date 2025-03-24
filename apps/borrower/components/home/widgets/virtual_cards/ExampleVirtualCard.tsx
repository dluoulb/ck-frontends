import React from 'react';
import vc from '@lib/images/vc-cardart-mastercard.png';
import Image from 'next/image';

export default function ExampleVirtualCard() {
  return (
    <div className="text-sm md:text-base shadow-md rounded-lg">
      <div className="w-[275px] py-4 lg:w-[315px] mx-auto lg:py-10 relative">
        <Image
          src={vc}
          alt="Virtual Card Example Image"
          className="rounded-xl"
        />
        <span className="absolute text-white top-[126px] left-[14px] lg:text-base lg:top-[160px] lg:left-[20px]">5412&nbsp;&nbsp;7512&nbsp;&nbsp;3412&nbsp;&nbsp;3456</span>
        <span className="absolute text-white top-[142px] left-[14px] lg:text-base lg:top-[180px] lg:left-[20px]">Lee M. Cardholder</span>
        <span className="absolute text-white top-[162px] left-[14px] text-[8px] lg:top-[204px] lg:left-[20px] lg:text-[8px] w-1 leading-none">VALID THRU</span>
        <span className="absolute text-white top-[160px] left-[38px] lg:text-base lg:top-[200px] lg:left-[46px]">12/28</span>
        <span className="absolute text-white top-[161px] left-[80px] text-[8px] lg:top-[202px] lg:left-[96px] lg:text-[8px]">CVC</span>
        <span className="absolute text-white top-[160px] left-[100px] lg:text-base lg:top-[200px] lg:left-[116px]">123</span>
      </div>
    </div>
  );
}


