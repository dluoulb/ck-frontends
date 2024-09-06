import React from 'react';
import { DateTime } from 'luxon';

import { formatCurrency } from '@lib/utils/formatters';

export default function ConfirmationData({
  order,
  chosenMethod,
  accountNum,
  modalState,
}) {
  let displayItems = [
    {
      id: 'date',
      title: 'Date',
      display_text: DateTime.now().toLocaleString(
        DateTime.DATE_MED_WITH_WEEKDAY
      ),
    },
    {
      id: 'order_id',
      title: 'Order ID',
      display_text: order.merchant_order_id,
    },
    {
      id: 'bank_account',
      title: 'Payment Method',
      display_text:
        order.product_type === 'payment_plan'
          ? chosenMethod?.credit_card_type
          : chosenMethod?.payment_method_label,
    },
    {
      id: 'amount',
      title: 'Payment Amount',
      display_text: formatCurrency(modalState.amount),
      style: '!font-bold text-primary-blue text-xl',
    },
  ];

  return (
    <div role={ConfirmationData.role}>
      {displayItems.map((item, idx) => {
        return (
          <div key={idx}>
            <span className="flex items-center justify-between font-medium my-5">
              <p className="text-secondary-gray">{item.title}</p>
              <div className="flex items-baseline">
                <span className={`${item.style} font-semibold`}>
                  {item.display_text}
                </span>
                {item.id === 'bank_account' && (
                  <span className="ml-1.5 text-sm text-secondary-gray">
                    {accountNum}
                  </span>
                )}
              </div>
            </span>
          </div>
        );
      })}
    </div>
  );
}

ConfirmationData.role = 'confirmation-data-component';
