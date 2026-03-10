import React from 'react';
import { faArrowRight, faShoppingBag } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

import { marketplace } from '@lib/actions/marketplace';

export default function MarketplaceLink() {
  return (
    <div className="w-full">
      <Link
        href={marketplace.url}
        target="_blank"
        rel="noopener noreferrer"
        className="min-w-50 max-h-max"
      >
        <div className="flex justify-between border border-border-gray hover:bg-gray-100 rounded-md px-6 p-4">
          <div className="flex items-center gap-3 basis-[90%]">
            <FontAwesomeIcon
              icon={faShoppingBag}
              className="text-xl md:text-2xl w-[32px] text-primary-blue"
            />
            <div>
              <p className="text-lg md:text-xl text-primary font-semibold">Browse Merchants</p>
              <p className="text-[#333333]">
                Shop with merchants where you can pay with Credit Key at checkout.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-end basis-[10%]">
            <FontAwesomeIcon icon={faArrowRight} />
          </div>
        </div>
      </Link>
    </div>
  );
}
