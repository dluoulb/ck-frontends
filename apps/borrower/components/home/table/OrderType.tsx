import React from 'react';

export default function OrderType({ type }) {
  switch (type) {
    case 'mambu_loan':
      type = 'Term Loan';
      break;
    case 'enterprise_net_30':
      type = 'Net 30';
      break;
    case 'payment_plan':
      type = 'Pay in 4 Order';
      break;
    default:
      type = 'Term Loan';
  }

  return <div role={OrderType.role}> {type}</div>;
}

OrderType.role = 'order-type-component';
