import React, { useMemo, useState } from 'react';
import type { ColumnDef, SortingState } from '@tanstack/react-table';
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import BaseTable from '@components/BaseTable';
import { RewardPointStatus, RewardTransactionRecord, RewardType } from '@lib/records/reward';
import SubscriptionRecord from '@lib/records/subscription';
import { fromISO, toISO } from '@lib/utils/datetime_formatters';
import { formatCurrency } from '@lib/utils/formatters';

type RewardsActivityTableProps = {
  activeSubscription: SubscriptionRecord;
  transactions: RewardTransactionRecord[];
  loading?: boolean;
  error?: any;
};

const getStatusBadgeClass = (status: RewardPointStatus) => {
  if (status === RewardPointStatus.PENDING) return 'text-gray-400';
  return '';
};

const getPointsColor = (status: RewardPointStatus) => {
  if (status === RewardPointStatus.PENDING) return 'text-gray-400';
  if (status === RewardPointStatus.POSTED) return 'text-green-600';
  return '';
};

const getRewardPercentage = (type: RewardType) => {
  if (type === RewardType.IN_NETWORK) return '3%';
  if (type === RewardType.OUT_OF_NETWORK) return '1%';
  return null;
};

export default function RewardsActivityTable({
  activeSubscription,
  transactions,
  loading,
  error,
}: RewardsActivityTableProps) {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'created_at', desc: true }]);

  const columns = useMemo<ColumnDef<RewardTransactionRecord>[]>(() => {
    return [
      {
        id: 'created_at',
        header: 'Date',
        accessorKey: 'created_at',
        cell: ({ getValue }) => {
          const dateValue = getValue<any>();
          if (!dateValue) return <span className="text-sm">-</span>;

          return <span className="text-sm">{fromISO(toISO(dateValue)).toFormat('M/d/yy')}</span>;
        },
      },
      {
        id: 'source',
        header: 'Source',
        accessorKey: 'source',
        cell: ({ row }) => <span className="text-sm">{row.original?.source || '-'}</span>,
      },
      {
        id: 'amount',
        header: 'Amount',
        accessorKey: 'amount',
        cell: ({ getValue, row }) => {
          const amount = getValue<any>();
          const type = row.original.type;

          return (
            <span className="text-sm">
              {amount ? (
                <>
                  {formatCurrency(amount)}
                  {getRewardPercentage(type) && (
                    <span className="ml-1 text-xs text-gray-500">{getRewardPercentage(type)}</span>
                  )}
                </>
              ) : (
                '-'
              )}
            </span>
          );
        },
      },
      {
        id: 'status',
        header: 'Status',
        accessorKey: 'status',
        cell: ({ getValue }) => {
          const status = getValue() as RewardPointStatus;

          const statusLabels: Record<RewardPointStatus, string> = {
            [RewardPointStatus.PENDING]: 'Pending',
            [RewardPointStatus.POSTED]: 'Posted',
            [RewardPointStatus.CANCELED]: 'Canceled',
          };

          return (
            <span className={`text-sm ${getStatusBadgeClass(status)}`}>
              {statusLabels[status] || String(status)}
            </span>
          );
        },
      },
      {
        id: 'points',
        header: 'Points',
        accessorKey: 'points',
        cell: ({ row }) => {
          const { status, type, points } = row.original;

          const isNegative = type === RewardType.SPENT || type === RewardType.EXPIRED;
          const isAdjustment = type === RewardType.ADJUSTED;

          let displayPoints = points;
          if (isNegative) {
            displayPoints = -Math.abs(points);
          } else if (isAdjustment && points < 0) {
            displayPoints = points;
          }

          const color = getPointsColor(status);
          const sign = displayPoints > 0 ? '+' : '';

          return (
            <span className={`text-sm font-semibold ${color} text-right block`}>
              {sign}
              {displayPoints} pts
            </span>
          );
        },
      },
    ];
  }, []);

  const data = useMemo(() => transactions || [], [transactions]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { sorting },
    initialState: {
      pagination: { pageSize: 10, pageIndex: 0 },
    },
    onSortingChange: setSorting,
  });

  const showPlusCTA = !loading && !activeSubscription;

  return (
    <div className="border border-primary-gray-border rounded-md bg-white">
      <div className="p-4 border-b border-primary-gray-border">
        <h2 className="text-lg font-bold text-primary">Rewards Activity</h2>
      </div>

      {showPlusCTA ? (
        <div className="p-6 text-sm text-gray-600 text-center">
          Activities you perform that earn rewards will be listed here.
          <br />
          <a href="/plus" className="no-underline text-primary-blue cursor-pointer">
            Join Credit Key Plus
          </a>{' '}
          to earn rewards on every purchase with Credit Key.
        </div>
      ) : (
        <BaseTable
          table={table}
          tableClass="text-sm"
          rowClass="!text-sm"
          headerClass="!bg-[#F4F8FF]"
          isFetching={loading}
          noDataFoundWarning={
            error ? 'Unable to load rewards activity' : 'No rewards activity found'
          }
          usePagination={true}
        />
      )}
    </div>
  );
}
