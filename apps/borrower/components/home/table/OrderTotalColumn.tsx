import React from 'react';

import { formatCurrency } from '@lib/utils/formatters';

export default function OrderTotalColumn({ order }) {
  const total = order?.amount != null ? formatCurrency(order.amount) : '—';
  const remaining = order?.total_balance != null ? formatCurrency(order.total_balance) : '—';

  return (
    <div className="flex flex-col leading-tight">
      <span className="font-medium">{total}</span>
      <span className="text-xs text-tertiary-gray">{remaining} remaining</span>
    </div>
  );
}
