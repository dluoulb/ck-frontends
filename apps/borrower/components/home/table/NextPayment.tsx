import React from 'react';

import { formatShortDate } from '@lib/utils/datetime_formatters';
import { formatCurrency } from '@lib/utils/formatters';

export default function NextPayment({ order }) {
  const getAmount = () => {
    if (order?.product?.next_payment_due_amount != null) {
      return formatCurrency(order.product.next_payment_due_amount);
    }
    return 'No Payment Due';
  };

  const getDate = () => {
    switch (order?.product?.status) {
      case 'funded':
      case 'active':
        return order?.product?.next_payment_date
          ? formatShortDate(order.product.next_payment_date)
          : 'Paid: Final Payment Pending';
      case 'created':
      case 'pending':
        return 'Not Yet Scheduled';
      case 'paid':
      case 'void':
        return 'N/A';
      default:
        return 'N/A';
    }
  };

  return (
    <div className="flex flex-col leading-tight">
      <span className="font-medium">{getAmount()}</span>
      {(() => {
        const date = getDate();
        const nonDateStatuses = [
          'Paid: Final Payment Pending',
          'Not Yet Scheduled',
          'N/A',
          'No Payment Due',
        ];
        return nonDateStatuses.includes(date) ? (
          <span className="text-xs text-tertiary-gray">{date}</span>
        ) : (
          <span className="text-xs text-tertiary-gray">due by {date}</span>
        );
      })()}
    </div>
  );
}

NextPayment.role = 'next-payment-component';
