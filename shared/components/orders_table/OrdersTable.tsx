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

import BaseTable from '@components/BaseTable';
import TableHeader from '@components/TableHeader';
import { useWindowSize } from '@hooks/useWindowSize';
import { orderStatusTabs } from '@lib/constants/SiteVariables';

export default function OrdersTable({
  orders,
  entity,
  pageSize,
  pageCount,
  tableClass = '',
  tableColumns,
  rowClass = '',
  withHeader = false,
  withDisclaimer = false,
  onClickHandler = null,
  isFetching = false,
  setOrdersPageIndex = (pageIndex) => {},
  defaultSort = '',
}) {
  const queryClient = useQueryClient();
  const size = useWindowSize();
  const [active, setActive] = useState('all');
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([{ id: defaultSort, desc: true }]);

  const data = useMemo(() => orders || [], [orders, orders?.length]);
  const columns = React.useMemo(() => {
    return tableColumns.map((col) => ({
      ...col,
      meta: {
        ...col.meta,
        isVisible:
          col.hideColumn !== true
            ? size.width >= col.hideColumn
            : !col.hideColumn,
      },
    }));
  }, [size.width]);

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
      columnVisibility: columns.reduce((acc, col) => {
        acc[col.id] = col.meta.isVisible;
        return acc;
      }, {}),
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
          noDataFoundWarning={getNoDataMessage()}
        />
      </div>
    </div>
  );
}

OrdersTable.role = 'orders-table-component';
