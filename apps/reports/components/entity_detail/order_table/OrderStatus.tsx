import React from 'react';
import { faInfoCircle } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import Tooltip from '@components/Tooltip';
import { reformatDate } from '@lib/utils/datetime_formatters';

export default function OrderStatus({ status, order }) {
  let statusColor = '';
  const getStatus = () => {
    switch (status.toLowerCase()) {
      case 'paid':
      case 'void':
      case 'new':
      case 'pending':
        return status;
      case 'active':
      case 'funded':
        return 'Active';
      default:
        break;
    }
  };

  switch (status) {
    case 'funded':
    case 'active':
      statusColor = 'text-success';
      break;
    case 'created':
    case 'pending':
      statusColor = 'text-warning';
      break;
    case 'paid':
    case 'void':
      statusColor = 'text-tertiary-gray';
      break;
    case 'canceled':
      statusColor = 'text-error';
      break;
    default:
      statusColor = 'text-secondary-gray';
  }

  return (
    <span className="flex items-center gap-1">
      <span className={classNames('capitalize font-semibold', statusColor)}>
        {getStatus()}
      </span>
      {order?.product?.isPastDue && (
        <Tooltip
          tooltip_text={
            <span>
              <span className="font-bold mx-1">
                {order?.product?.daysPastDue}
              </span>
              days past due. <br />
              Last payment attempted on{' '}
              {reformatDate(order?.product?.last_payment_attempted_at)}
            </span>
          }
          trigger_class="cursor-pointer !border-none"
          container_class="text-center p-4 px-6 text-sm bg-background-error !text-error"
        >
          <FontAwesomeIcon
            icon={faInfoCircle}
            className="text-error text-xs mt-0.5"
          />
        </Tooltip>
      )}
    </span>
  );
}
