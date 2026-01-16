import React from 'react';
import { faInfoCircle } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import Tooltip from '@components/Tooltip';
import { reformatDate } from '@lib/utils/datetime_formatters';

export default function OrderStatus({ order, isTable }) {
  let statusColor = 'text-primary-blue';
  let bgColor = 'bg-secondary-blue';
  let status = order.product.status;

  switch (order.product.status) {
    case 'funded':
    case 'active':
      status = 'active';
      statusColor = 'text-success';
      bgColor = 'bg-background-success';
      break;
    case 'created':
    case 'pending':
      status = 'pending';
      statusColor = 'text-warning';
      bgColor = 'bg-background-warning';
      break;
    case 'paid':
    case 'void':
      statusColor = 'text-secondary-gray';
      bgColor = 'bg-primary-gray-border text';
      break;
    case 'canceled':
      statusColor = ' text-error';
      bgColor = 'bg-background-error';
      break;
    default:
      statusColor;
  }

  return (
    <span role={OrderStatus.role} className="flex flex-col lg:flex-row gap-1">
      <span
        className={classNames(
          'capitalize font-medium',
          isTable ? statusColor : `text-white ${bgColor} rounded-full px-3 py-1 text-sm`,
        )}
      >
        {status}
      </span>
      {order?.product?.isPastDue && (
        <Tooltip
          tooltip_text={
            <span>
              <span className="font-bold mx-1">{order?.product?.daysPastDue}</span>
              days past due. <br />
              Last payment attempted on {reformatDate(order?.product?.last_payment_attempted_at)}
            </span>
          }
          trigger_class="cursor-pointer !border-none"
          container_class="text-center p-4 px-6 text-sm bg-background-error !text-error"
        >
          <FontAwesomeIcon icon={faInfoCircle} className="text-error text-xs mt-0.5" />
        </Tooltip>
      )}
    </span>
  );
}

OrderStatus.role = 'order-status-component';
