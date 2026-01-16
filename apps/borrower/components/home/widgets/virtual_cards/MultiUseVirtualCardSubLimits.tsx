import React from 'react';

import Loading from '@components/Loading';
import { useEntity } from '@contexts/EntityContext';
import { formatCurrency } from '@lib/utils/formatters';

export default function MultiUseVirtualCardSubLimits() {
  const { entity } = useEntity();
  if (!entity) return <Loading />;
  return (
    <div className="grid grid-cols-1 xs:grid-cols-3 md:grid-cols-1 lg:grid-cols-2 mxl:grid-cols-3 text-navy-blue">
      {/* <!-- Approved credit--> */}
      <div className="md:my-2">
        <div className="font-avenir-black text-navy-blue text-xl md:text-2xl">
          {formatCurrency(entity.vc_sub_limits.limit_amount)}
        </div>
        <div className="flex items-center mt-1">
          <div className="mr-1 font-avenir-book text-opaque-navy text-sm">
            <span>Card Limit</span>
          </div>
        </div>
      </div>
      {/* <!-- Credit in Use --> */}
      <div className="md:my-2">
        <div className="font-avenir-black text-xl md:text-2xl text-opaque-navy">
          {formatCurrency(
            entity.vc_sub_limits.limit_amount - entity.vc_sub_limits.remaining_limit_amount,
          )}
        </div>
        <div className="flex items-center mt-1">
          <div className="mr-1 font-avenir-book text-opaque-navy text-sm">
            <span>Card Balance</span>
          </div>
        </div>
      </div>
      {/* <!-- Remaining credit--> */}
      <div className="md:my-2">
        <div className="font-avenir-black text-xl md:text-2xl text-positive-green">
          {formatCurrency(entity.vc_sub_limits.remaining_limit_amount)}
        </div>
        <div className="flex items-center mt-1">
          <div className="mr-1 font-avenir-book text-opaque-navy text-sm">
            <span>Remaining Card Balance</span>
          </div>
        </div>
      </div>
    </div>
  );
}
