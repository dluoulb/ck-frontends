import React from 'react';

import { reformatDate } from '@lib/utils/datetime_formatters';

export default function NextPayment({ order }) {
  let payment_date = 'N/A';

  switch (order.product.status) {
    case 'funded':
    case 'active':
      payment_date = order?.product?.next_payment_date
        ? reformatDate(order?.product?.next_payment_date)
        : 'Paid: Final Payment Pending';
      break;
    case 'created':
    case 'pending':
      payment_date = 'Not Yet Scheduled';
      break;
    case 'paid':
    case 'void':
      payment_date = 'N/A';
      break;
    default:
      return payment_date;
  }

  return (
    <span
      role={NextPayment.role}
      className={
        order.product.next_payment_date ? 'font-medium' : 'text-tertiary-gray'
      }
    >
      {payment_date}
    </span>
  );
}

NextPayment.role = 'next-payment-component';
