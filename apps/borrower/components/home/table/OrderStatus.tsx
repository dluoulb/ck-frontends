import React from 'react';
import classNames from 'classnames';

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
      bgColor = 'bg-primary-border-gray text';
      break;
    case 'canceled':
      statusColor = ' text-error';
      bgColor = 'bg-background-error';
      break;
    default:
      statusColor;
  }

  return (
    <span role={OrderStatus.role} className="flex flex-col lg:flex-row">
      <span
        className={classNames(
          'capitalize font-medium',
          isTable
            ? statusColor
            : `text-white ${bgColor} rounded-full px-3 py-1 text-sm`
        )}
      >
        {status}
      </span>
      {order.product.isPastDue && (
        <span className="text-error text-xxs ml-0 lg:ml-2">
          {order.product.daysPastDue} Days Past Due!
        </span>
      )}
    </span>
  );
}

OrderStatus.role = 'order-status-component';
