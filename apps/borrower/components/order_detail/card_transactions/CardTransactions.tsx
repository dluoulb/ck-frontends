import React from 'react';
import Loading from '@components/Loading';
import { DateTime } from 'luxon';
import { fromISO } from '@lib/utils/datetime_formatters';
import { formatCurrency } from '@lib/utils/formatters';

export default function CardTransactions({ order }) {
  if (!order) return <Loading className="w-14 h-14 my-20" />;

  const renderTransactions = () => {
    return order.card_transactions.map(t => (
      <div key={t.transaction_id} className="grid grid-cols-5 gap-2 md:gap-4 mb-3">
        <div className="hidden md:block">
          {fromISO(order.created_at).toLocaleString(DateTime.DATE_MED)}
        </div>
        <div className="col-span-3 md:col-span-1">{t.merchant_name}</div>
        <div className="hidden md:block">Approved</div>
        <div>x{t.card_last_four}</div>
        <div>{formatCurrency(t.amount)}</div>
      </div>
    ));
  };

  return (
    <div role={CardTransactions.role}>
      <div className="p-6 px-2 sm:px-6">
        {renderTransactions()}
      </div>
    </div>
  );
}

CardTransactions.role = 'card-transactions-component';

