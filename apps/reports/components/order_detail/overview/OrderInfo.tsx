import React from 'react';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { faCartShopping } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Tooltip from '@components/Tooltip';
import { fromISO, reformatDate } from '@lib/utils/datetime_formatters';
import { formatCurrency } from '@lib/utils/formatters';

export default function OrderInfo({ order, product }) {
  const isPaymentPlan = order?.product_type !== 'mambu_loan';

  return (
    <div className="flex items-start gap-2" role={OrderInfo.role}>
      <span className="fa-layers fa-fw text-4xl md:text-5xl hidden sm:inline">
        <FontAwesomeIcon icon={faCircle} className="text-secondary-blue" />
        <FontAwesomeIcon icon={faCartShopping} className="text-primary-blue text-base md:text-xl" />
      </span>
      <div className="text-sm text-primary font-medium tracking-wide">
        <p className="font-semibold text-lg mb-1">Order Details</p>
        <p>
          <span className="text-tertiary-gray mr-2 font-normal">Order ID:</span>
          {product?.order_key}
        </p>
        <p>
          <span className="text-tertiary-gray mr-2 font-normal">
            {isPaymentPlan ? 'Payment Plan' : 'Loan'} Amount:
          </span>
          {formatCurrency(product?.amount)}
        </p>
        <Tooltip
          tooltip_text="Unpaid balance including principal & expected financing fees"
          trigger_class="cursor-pointer text-tertiary-gray mr-2 font-normal"
          container_class="text-center p-4 px-6 text-sm bg-secondary-blue"
        >
          Remaining Balance
        </Tooltip>
        {formatCurrency(isPaymentPlan ? order?.total_balance : product?.total_balance)}
        <p className="capitalize">
          <span className="text-tertiary-gray mr-2 font-normal">created date:</span>
          {fromISO(order?.created_at).toLocaleString()}
        </p>
        <p>
          <span className="text-tertiary-gray mr-2 font-normal">Expected Maturity Date:</span>
          {product?.disbursement_date || product?.capture_date
            ? reformatDate(isPaymentPlan ? product?.disbursement_date : product?.capture_date, true)
                .plus(
                  order?.product_type === 'payment_plan'
                    ? { weeks: 6 }
                    : { months: product?.installments },
                )
                .toLocaleString()
            : 'N/A'}
        </p>
      </div>
    </div>
  );
}

OrderInfo.role = 'order-info-component';
