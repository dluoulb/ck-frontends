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
  activeSubscription?: SubscriptionRecord | null;
  transactions: RewardTransactionRecord[];
  loading?: boolean;
  error?: any;
};

const statusLabels: Record<RewardPointStatus, string> = {
  [RewardPointStatus.PENDING]: 'Pending',
  [RewardPointStatus.POSTED]: 'Posted',
  [RewardPointStatus.CANCELED]: 'Canceled',
};
const DEFAULT_STATUS_BADGE_CLASS = '';
const PENDING_STATUS_BADGE_CLASS = 'text-gray-400';

const normalizeStatus = (status?: RewardPointStatus | string) => {
  if (!status) return undefined;

  const normalizedStatus = String(status).toUpperCase() as RewardPointStatus;
  if (Object.values(RewardPointStatus).includes(normalizedStatus)) {
    return normalizedStatus;
  }

  return undefined;
};

const normalizeRewardType = (type?: RewardType | string) => {
  if (!type) return undefined;

  const normalizedType = String(type).toUpperCase() as RewardType;
  if (Object.values(RewardType).includes(normalizedType)) {
    return normalizedType;
  }

  return undefined;
};

const getDisplayStatus = (status?: RewardPointStatus | string, normalizedType?: RewardType) => {
  if (normalizedType === RewardType.SPENT) return 'Redeemed';

  const normalizedStatus = normalizeStatus(status);
  return normalizedStatus ? statusLabels[normalizedStatus] : String(status ?? '');
};

const getStatusBadgeClass = (normalizedStatus?: RewardPointStatus, normalizedType?: RewardType) => {
  if (normalizedType === RewardType.SPENT) return DEFAULT_STATUS_BADGE_CLASS;

  if (normalizedStatus === RewardPointStatus.PENDING) return PENDING_STATUS_BADGE_CLASS;
  return DEFAULT_STATUS_BADGE_CLASS;
};

const getPointsColor = (status?: RewardPointStatus | string) => {
  const normalizedStatus = normalizeStatus(status);

  if (normalizedStatus === RewardPointStatus.PENDING) return 'text-gray-400';
  if (normalizedStatus === RewardPointStatus.POSTED) return 'text-green-600';
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
        header: 'Order Amount',
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
        cell: ({ row }) => {
          const { status, type } = row.original;
          const normalizedStatus = normalizeStatus(status);
          const normalizedType = normalizeRewardType(type);

          return (
            <span className={`text-sm ${getStatusBadgeClass(normalizedStatus, normalizedType)}`}>
              {getDisplayStatus(status, normalizedType)}
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
          const isRedeemed = type === RewardType.SPENT;
          const isAdjustment = type === RewardType.ADJUSTED;

          let displayPoints = points;
          if (isNegative) {
            displayPoints = -Math.abs(points);
          } else if (isAdjustment && points < 0) {
            displayPoints = points;
          }

          const color = getPointsColor(status);
          const sign = displayPoints > 0 ? '+' : '';
          const redeemedAmount = isRedeemed ? formatCurrency(Math.abs(displayPoints) / 100) : null;

          return (
            <span className={`block text-sm font-semibold ${color}`}>
              {sign}
              {displayPoints} pts
              {redeemedAmount && (
                <>
                  {' '}
                  <span className="text-gray-500">({redeemedAmount})</span>
                </>
              )}
            </span>
          );
        },
      },
    ];
  }, []);

  const data = useMemo(() => transactions || [], [transactions]);
  const hasTransactions = data.length > 0;

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

  const showPlusCTA = !loading && !activeSubscription && hasTransactions;

  return (
    <div className="border border-primary-gray-border rounded-md bg-white">
      <div className="p-4 border-b border-primary-gray-border">
        <h2 className="text-lg font-bold text-primary">Rewards Activity</h2>
      </div>

      {showPlusCTA && (
        <div className="p-6 text-sm text-gray-600 text-center">
          Activities you perform that earn rewards will be listed here.
          <br />
          <a href="/plus" className="no-underline text-primary-blue cursor-pointer">
            Join Credit Key Plus
          </a>{' '}
          to earn rewards on every purchase with Credit Key.
        </div>
      )}

      <BaseTable
        table={table}
        tableClass="text-sm"
        rowClass="!text-sm"
        headerClass="!bg-[#F4F8FF]"
        isFetching={loading}
        noDataFoundWarning={error ? 'Unable to load rewards activity' : 'No rewards activity found'}
        usePagination={true}
      />
    </div>
  );
}
