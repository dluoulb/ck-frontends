import React from 'react';
import { DateTime } from 'luxon';

import { fromISO } from '@lib/utils/datetime_formatters';
import { formatCurrency } from '@lib/utils/formatters';

export default function AutoPayBanner({ order }) {
  const paymentSchedule = order.product?.payment_schedule || [];

  const hasAutoPay = paymentSchedule.some(
    (ps) => ps.status === 'scheduled' || ps.status === 'pending'
  );

  if (!hasAutoPay) {
    return null;
  }

  const pendingPayment = paymentSchedule.find((ps) => ps.status === 'pending');
  const nextScheduledPayment = paymentSchedule.find(
    (ps) => ps.status === 'scheduled'
  );
  const paymentToShow = pendingPayment || nextScheduledPayment;

  if (!paymentToShow) {
    return null;
  }

  const dueDate = fromISO(paymentToShow.date);
  const formattedDate = dueDate.toLocaleString(DateTime.DATE_MED);
  const amount = formatCurrency(parseFloat(paymentToShow.amount));

  return (
    <div className="mb-4 p-3 bg-[#FFF8E7] rounded border border-[#F5D97D]">
      <div className="flex items-center gap-2 text-[#704C00]">
        <div className="flex-1">
          <p className="text-sm font-bold mb-1">Scheduled Payment</p>
          <p className="text-sm mb-1">{formattedDate}</p>
        </div>
        <span className="ml-4 font-semibold">{amount}</span>
      </div>
    </div>
  );
}
