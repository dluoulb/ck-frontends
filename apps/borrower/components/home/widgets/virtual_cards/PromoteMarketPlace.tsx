import React from 'react';
import { faCartShoppingFast } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useEntity } from '@contexts/EntityContext';
import { marketplace } from '@lib/actions/marketplace';

export default function PromoteMarketplace() {
  const { entity } = useEntity();
  const isAmazonExclusive = entity?.isAmazonExclusive ?? false;

  if (isAmazonExclusive) return null;

  return (
    <div className="flex gap-2 col-span-3 md:col-span-1">
      <div className="align-top mt-1">
        <FontAwesomeIcon icon={faCartShoppingFast} className="text-black text-4xl font-thin" />
      </div>
      <div className="align-top text-base font-semibold">
        Easily access your favorite merchants and discover new ones in the Credit Key Marketplace.
        <a
          href={marketplace.url}
          target="_blank"
          className="text-primary-blue hover:text-primary-blue-hover"
        >
          {' Enter the Marketplace ->'}
        </a>
      </div>
    </div>
  );
}
