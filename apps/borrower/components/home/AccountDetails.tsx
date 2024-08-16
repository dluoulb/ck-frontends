import React from 'react';

import { formatCurrency } from '@lib/utils/formatters';

export default function AccountDetails({ account }) {
  const approvedUser = account?.status === 'approved';

  let statusIcon = '';

  switch (account?.status) {
    case 'pending':
    case 'hold':
      statusIcon = 'warning-yellow';
      break;
    case 'approved':
      statusIcon = 'positive-green';
      break;
    case 'declined':
    case 'canceled':
      statusIcon = 'negative-red';
      break;
    default:
      statusIcon = 'primary-blue';
  }

  if (!account) return null;

  return (
    <>
      <div className="md:my-2">
        <div className="font-avenir-black text-navy-blue text-xl md:text-2xl">
          {!approvedUser ? '--' : formatCurrency(account?.tier_limit)}
        </div>
        <div className="flex items-center mt-1">
          <div className="mr-1 font-avenir-book text-opaque-navy text-sm">
            <span>Maximum Purchase</span>
          </div>
        </div>
      </div>
      <div className="md:my-2">
        <div className="font-avenir-black text-xl md:text-2xl text-opaque-navy">
          {!approvedUser
            ? '--'
            : formatCurrency(account?.purchase_amount_in_use)}
        </div>
        <div className="flex items-center mt-1">
          <div className="mr-1 font-avenir-book text-opaque-navy text-sm">
            <span>Amount in Use</span>
          </div>
        </div>
      </div>
      <div className="md:my-2">
        <div className="font-avenir-black text-xl md:text-2xl text-positive-green">
          {!approvedUser ? '--' : formatCurrency(account?.tier_limit_available)}
        </div>
        <div className="flex items-center mt-1">
          <div className="mr-1 font-avenir-book text-opaque-navy text-sm">
            <span>Remaining Amount</span>
          </div>
        </div>
      </div>
    </>
  );
}
