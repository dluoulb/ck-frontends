import React, { useEffect, useMemo, useState } from 'react';
import { faInfoCircle } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQueryClient } from '@tanstack/react-query';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import classNames from 'classnames';

import BaseTable from '@components/BaseTable';
import TableHeader from '@components/TableHeader';
import { orderStatusTabs } from '@lib/constants/SiteVariables';

export default function OrdersTable({
  orders,
  entity,
  pageSize,
  pageCount,
  tableClass = '',
  tableColumns,
  totalOrderCount = 0,
  rowClass = '',
  withHeader = false,
  withDisclaimer = false,
  onClickHandler = null,
  isFetching = false,
  setOrdersPageIndex = (pageIndex) => {},
  defaultSort = '',
}) {
  const queryClient = useQueryClient();
  const [active, setActive] = useState('all');
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([{ id: defaultSort, desc: true }]);

  const data = useMemo(() => orders || [], [orders, orders?.length]);
  const columns = useMemo(() => tableColumns || [], [tableColumns]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    pageCount,
    initialState: {
      columnVisibility: { isPastDue: false },
      pagination: {
        pageSize: pageSize,
        pageIndex: 0,
      },
    },
    state: {
      sorting,
      globalFilter,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    manualPagination: true,
  });

  const { pageIndex } = table.getState().pagination;
  const isPageCached = queryClient.getQueryData([
    'orders',
    entity,
    entity?.type,
    pageIndex,
  ]);

  const getNoDataMessage = () => {
    const filter = active === 'all' ? '' : active;
    const pageMessage = !pageCount ? '' : ' or try another page.';

    return `No ${filter} orders found. Please try additional filters${pageMessage}`;
  };

  useEffect(() => {
    setOrdersPageIndex(pageIndex);
  }, [pageIndex]);

  return (
    <div role={OrdersTable.role}>
      {withDisclaimer && (
        <div className="py-4 px-8 flex items-center gap-2 text-sm font-medium border-b border-primary-gray-border">
          <FontAwesomeIcon icon={faInfoCircle} />
          <p>
            The amount displayed is the principal loan amount not including
            interest & fees
          </p>
        </div>
      )}
      <div className="col-span-full rounded-lg border border-primary-gray-border overflow-x-scroll">
        {withHeader && (
          <TableHeader
            table={table}
            active={active}
            setActive={setActive}
            statusTabs={orderStatusTabs}
            tabClass="border-transparent"
            headerClass="px-2"
            filterType="status"
          />
        )}
        <BaseTable
          table={table}
          rowClass={rowClass}
          isFetching={isFetching}
          tableClass={tableClass}
          isPageCached={!!isPageCached}
          onClickHandler={onClickHandler}
          totalCount={totalOrderCount}
          noDataFoundWarning={getNoDataMessage()}
        />
      </div>
    </div>
  );
}

OrdersTable.role = 'orders-table-component';
