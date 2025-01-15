import React from 'react';

import { reformatDate } from '@lib/utils/datetime_formatters';
import { formatCurrency } from '@lib/utils/formatters';

export default function NextPayment({ order, type }) {
  let displayValue = 'N/A';

  switch (order.product.status) {
    case 'funded':
    case 'active':
      if (type === 'date') {
        displayValue = order?.product?.next_payment_date
        ? reformatDate(order?.product?.next_payment_date)
        : 'Paid: Final Payment Pending';
      } else if (type == 'amount') {
        displayValue = order?.product?.next_payment_due_amount
        ? formatCurrency(order?.product?.next_payment_due_amount)
        : 'No Payment Due';
      }

      break;
    case 'created':
    case 'pending':
      displayValue = type === 'date' ? 'Not Yet Scheduled' : 'No Payment Due';
      break;
    case 'paid':
    case 'void':
      displayValue = type === 'date' ? 'N/A': 'No Payment Due';
      break;
    default:
      return displayValue;
  }

  return (
    <span
      role={NextPayment.role}
      className={
        order.product.next_payment_date ? 'font-medium' : 'text-tertiary-gray'
      }
    >
      {displayValue}
    </span>
  );
}

NextPayment.role = 'next-payment-component';
