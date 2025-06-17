import React from 'react';
import PromoteApp from './PromoteApp';
import PromoteMarketplace from './PromoteMarketPlace';
import PromoteDigitalWallet from './PromotDigitalWallet';

export default function HowToUse() {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="px-3 p-2">
        <div className="flex justify-center items-center gap-2.5 pb-3">
          <p className="text-lg md:text-2xl font-bold">How to Use Credit Key Card</p>
        </div>
        <div className="mt-2">
          <div className="grid gap-x-4 gap-y-8 lg:gap-16 grid-cols-3">
            <PromoteApp />
            <PromoteMarketplace />
            <PromoteDigitalWallet />
          </div>
        </div>
      </div>
    </div>
  );
}

