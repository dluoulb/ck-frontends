import React from 'react';
import Image from 'next/image';

import ckPlusBanner from '@lib/images/CK-plus-banner.svg';

type BannerProps = {
  onJoinClick: () => void;
};

export default function Banner({ onJoinClick }: BannerProps) {
  return (
    <div className="bg-[#F4F8FF] border border-primary-gray-border rounded-lg mb-6 mt-8">
      <div className="flex flex-col lg:flex-row items-center gap-8">
        <div className="flex-1 p-6 gap-4 flex flex-col">
          <h2 className="text-3xl font-bold">Turn Every Purchase Into Cash Back</h2>
          <p>
            The smarter way to manage business spending with unlimited rewards that helps build your
            business credit.
          </p>
          <button
            onClick={onJoinClick}
            className="bg-primary-blue text-white px-4 py-2 text-xs sm:text-sm rounded-lg font-semibold hover:bg-primary-blue-hover transition-colors self-start"
          >
            Join Credit Key Plus
          </button>
        </div>
        <div className="flex-1 flex justify-center lg:justify-end">
          <Image
            src={ckPlusBanner}
            alt="Credit Key Plus"
            width={338}
            height={215}
            className="max-w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
}
