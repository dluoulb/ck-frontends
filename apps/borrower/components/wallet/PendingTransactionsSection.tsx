import React, { useMemo, useState } from 'react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { DateTime } from 'luxon';
import Link from 'next/link';

import usePendingAuthorizations from '@apps/borrower/hooks/usePendingAuthorizations';
import BaseTable from '@components/BaseTable';
import { Skeleton } from '@components/components/ui/skeleton';
import Pagination from '@components/Pagination';
import { useEntity } from '@contexts/EntityContext';
import useOrders from '@hooks/useOrders';
import { fromISO } from '@lib/utils/datetime_formatters';
import { formatCreditTransactionAmount, formatCurrency } from '@lib/utils/formatters';

const columns = [
  {
    id: 'date',
    header: 'Date',
    accessorKey: 'created_at',
    className: 'hidden md:table-cell',
    cell: ({ getValue }) => (
      <div className="text-sm">
        {getValue() ? fromISO(getValue()).toLocaleString(DateTime.DATE_MED) : 'N/A'}
      </div>
    ),
  },
  {
    id: 'merchant',
    header: 'Merchant',
    accessorKey: 'merchant_name',
    cell: ({ getValue }) => <div className="text-sm">{getValue() || 'N/A'}</div>,
  },
  {
    id: 'status',
    header: 'Status',
    accessorKey: 'status',
    className: 'hidden md:table-cell',
    cell: ({ getValue }) => <div className="text-sm">{getValue()}</div>,
  },
  {
    id: 'card',
    header: 'Card',
    accessorKey: 'card_last_four',
    cell: ({ getValue }) => {
      const lastFour = getValue();
      return <div className="text-sm">{lastFour ? `x${lastFour}` : 'N/A'}</div>;
    },
  },
  {
    id: 'amount',
    header: 'Amount',
    accessorKey: 'amount',
    cell: ({ getValue, row }) => {
      return (
        <div className="text-sm">
          {formatCreditTransactionAmount(getValue(), row.original.entry_type)}
        </div>
      );
    },
  },
];

function OrderTransactionsTable({ transactions }) {
  return (
    <div className="divide-y">
      {transactions.map((transaction) => {
        return (
          <div key={transaction.id} className="grid grid-cols-6 gap-2 md:gap-4 px-3 py-2 text-sm">
            <div className="hidden md:block">
              {transaction.created_at
                ? fromISO(transaction.created_at).toLocaleString(DateTime.DATE_MED)
                : 'N/A'}
            </div>
            <div className="col-span-3 md:col-span-2">{transaction.merchant_name || 'N/A'}</div>
            <div className="hidden md:block">{transaction.status}</div>
            <div>{transaction.card_last_four ? `x${transaction.card_last_four}` : 'N/A'}</div>
            <div>
              {formatCreditTransactionAmount(transaction.amount, transaction.transaction_type)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function PendingTransactionsSection() {
  const { entity } = useEntity();
  const [currentPage, setCurrentPage] = useState(0);

  const { pendingAuths, pendingAuthsLoading } = usePendingAuthorizations(entity?.id);
  const { pending_total, authorizations } = pendingAuths ?? {};
  const { orders, ordersLoading, pageCount } = useOrders(entity, true, currentPage);

  const creditKeyCardOrders = useMemo(() => {
    return orders?.filter((order) => order.card_transactions?.length > 0) || [];
  }, [orders]);

  const pendingData = useMemo(() => {
    if (!authorizations?.length) return [];
    return authorizations.map((auth) => {
      return {
        id: auth.authorization_id,
        created_at: auth.created_at,
        merchant_name: auth.merchant_name,
        status: 'Pending',
        card_last_four: auth.card?.last_four,
        amount: auth.amount,
        entry_type: auth.entry_type,
      };
    });
  }, [authorizations]);

  const pendingTable = useReactTable({
    data: pendingData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const mockTable = {
    getState: () => ({
      pagination: {
        pageIndex: currentPage,
        pageSize: creditKeyCardOrders.length,
      },
    }),
    getPageCount: () => pageCount || 1,
    getCanPreviousPage: () => currentPage > 0,
    getCanNextPage: () => currentPage < pageCount - 1,
    previousPage: () => setCurrentPage((prev) => Math.max(0, prev - 1)),
    nextPage: () => setCurrentPage((prev) => Math.min((pageCount || 1) - 1, prev + 1)),
  };

  if (pendingAuthsLoading || ordersLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="w-48 h-8" />
          <Skeleton className="w-32 h-8" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between items-center py-2">
              <Skeleton className="w-24 h-6" />
              <Skeleton className="w-40 h-6" />
              <Skeleton className="w-16 h-6" />
              <Skeleton className="w-16 h-6" />
              <Skeleton className="w-16 h-6" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex max-md:flex-col justify-between items-start gap-2">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-gray-900">Credit Key Card Transactions</h2>
          <p className="text-sm text-secondary-gray">
            Transactions from cards will roll up into orders every 24 hours.
          </p>
        </div>
        <div className="flex gap-2 items-center bg-secondary-blue px-3 py-2 rounded-lg">
          <div className="text-sm">Total Pending Charges</div>
          <div className="text-xl font-bold text-primary">{formatCurrency(pending_total || 0)}</div>
        </div>
      </div>

      {pendingData.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-[#F4F8FF] p-3 font-medium text-sm border-b">Pending Transactions</div>
          <BaseTable
            table={pendingTable}
            hideHeader={true}
            usePagination={false}
            tableClass="text-sm"
            rowClass="px-2 sm:px-3"
          />
        </div>
      )}

      {creditKeyCardOrders.length > 0 && (
        <div className="border rounded-lg overflow-hidden divide-y">
          {creditKeyCardOrders.map((order) => {
            const transactions = order.card_transactions.map((transaction) => {
              const isCredit = transaction.transaction_type === 'credit';

              return {
                id: transaction.transaction_id,
                created_at: order.created_at,
                merchant_name: transaction.merchant_name || transaction.description,
                status: isCredit ? 'Refunded' : 'Approved',
                card_last_four: transaction.card_last_four,
                amount: parseFloat(transaction.amount),
                transaction_type: transaction.transaction_type,
              };
            });

            return (
              <div key={order.id}>
                <div className="bg-[#F4F8FF] p-3 text-sm border-b">
                  <p>
                    Order{' '}
                    <Link href={`/orders/${order.id}`} className="text-primary-blue font-medium">
                      {order.order_key}
                    </Link>
                  </p>
                </div>
                <OrderTransactionsTable transactions={transactions} />
              </div>
            );
          })}
        </div>
      )}

      {pageCount > 1 && <Pagination totalCount={creditKeyCardOrders.length} table={mockTable} />}

      {!pendingData.length && !creditKeyCardOrders.length && (
        <div className="text-gray-300 text-sm">No transactions yet.</div>
      )}
    </div>
  );
}
