import React from 'react';
import classNames from 'classnames';

export default function OrderStatus({ status }) {
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
    <span className={classNames('capitalize font-semibold', statusColor)}>
      {getStatus()}
    </span>
  );
}
