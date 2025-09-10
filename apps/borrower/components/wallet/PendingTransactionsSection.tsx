import React, { useMemo } from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import usePendingAuthorizations from '@apps/borrower/hooks/usePendingAuthorizations';
import BaseTable from '@components/BaseTable';
import { Skeleton } from '@components/components/ui/skeleton';
import { useEntity } from '@contexts/EntityContext';
import { fromISO } from '@lib/utils/datetime_formatters';
import { formatCurrency } from '@lib/utils/formatters';

export const columns = [
  {
    id: 'created_at',
    header: 'Date & Time',
    accessorKey: 'created_at',
  },
  {
    id: 'merchant_name',
    header: 'Merchant',
    accessorKey: 'merchant_name',
  },
  {
    id: 'status',
    header: 'Status',
    accessorKey: 'status',
  },
  {
    id: 'last_four',
    header: 'Card',
    accessorKey: 'last_four',
  },
  {
    id: 'amount',
    header: 'Amount',
    accessorKey: 'amount',
  },
];

export default function PendingTransactionsSection() {
  const { entity } = useEntity();
  const { pendingAuths, pendingAuthsLoading } = usePendingAuthorizations(
    entity?.id
  );

  const { pending_total, authorizations } = pendingAuths ?? {};

  const tableData = useMemo(() => {
    return (
      authorizations?.map((auth) => ({
        ...auth,
        status: 'Pending',
        amount: formatCurrency(auth.amount),
        created_at: fromISO(auth.created_at).toFormat('MMM d, h:mm a'),
        last_four: auth.card?.last_four ? `x${auth.card.last_four}` : 'N/A',
      })) || []
    );
  }, [authorizations]);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (pendingAuthsLoading) {
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

  if (tableData.length === 0) return;

  return (
    <div className="space-y-4">
      <div className="flex max-md:flex-col justify-between items-start gap-2">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-gray-900">
            Pending Transactions
          </h2>
          <p className="text-sm text-secondary-gray">
            Transactions from cards will roll up into orders every 24 hours.
          </p>
        </div>
        <div className="flex gap-2 items-center bg-secondary-blue px-3 py-2 rounded-lg">
          <div className="text-sm">Total Pending Charges</div>
          <div className="text-xl font-bold text-primary">
            {formatCurrency(pending_total || 0)}
          </div>
        </div>
      </div>
      <BaseTable
        table={table}
        hideHeader={true}
        usePagination={false}
        rowClass="!text-sm"
      />
    </div>
  );
}
