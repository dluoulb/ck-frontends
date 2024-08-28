import React from 'react';

import Tooltip from '@components/Tooltip';

export default function Installments({ order }) {
  const getTerm = () => {
    switch (order?.product_type) {
      case 'payment_plan':
        return order.product.installments * 2 + 'w*';
      case 'enterprise_net_30':
        return '30d';
      default:
        return order.product.installments * 30 + 'd';
    }
  };

  let tooltip =
    order.product_type === 'payment_plan' ? (
      <div>
        <p>$0 interest</p>
        <p>Payments processed every 2 weeks</p>
      </div>
    ) : null;

  return (
    <div role={Installments.role}>
      {tooltip ? (
        <Tooltip
          tooltip_text={tooltip}
          trigger_class="hover:border-b hover:border-black"
          container_class="text-center p-4 px-6 bg-dark-gray"
        >
          {getTerm()}
        </Tooltip>
      ) : (
        <div>{getTerm()}</div>
      )}
    </div>
  );
}

Installments.role = 'installments-component';
