import React from 'react';
import { DateTime } from 'luxon';

import { fromISO } from '@lib/utils/datetime_formatters';
import { formatCurrency } from '@lib/utils/formatters';

import { Installments, NextPayment, OrderStatus, OrderType } from '../home/table';

function multiValueFilter(rows, columnIds, filterValue) {
  if (filterValue.length === 0) return rows;
  return rows.filter((row) => filterValue.includes(row.values[columnIds]));
}

export const TableColumns = [
  {
    Header: 'Order Type',
    accessor: 'product_type',
    Cell: ({ value }) => <OrderType type={value} />,
  },
  {
    Header: 'Merchant Name',
    accessor: 'merchant.name',
  },
  {
    Header: 'Order Date',
    accessor: 'created_at',
    id: 'created_at',
    Cell: ({ value }) => fromISO(value).toLocaleString(DateTime.DATE_SHORT),
  },
  {
    Header: 'Merchant Order ID',
    accessor: 'merchant_order_id',
    className: 'font-semibold text-primary-blue',
  },
  {
    Header: 'Term',
    accessor: 'product.installments',
    Cell: ({ row: { original } }) => <Installments order={original} />,
  },
  {
    Header: 'Total Amount',
    accessor: 'amount',
    Cell: ({ row: { original } }) => formatCurrency(original.net_amount),
  },
  {
    Header: 'Remaining Balance',
    accessor: 'total_balance',
    Cell: ({ value }) => formatCurrency(value),
  },
  {
    Header: 'Order Status',
    accessor: 'product.status',
    id: 'product.status',
    className: 'font-semibold',
    filter: multiValueFilter,
    Cell: ({ row: { original } }) => (
      <OrderStatus order={original} isTable={true} />
    ),
  },
  {
    Header: 'Next Payment Date',
    accessor: 'product.next_payment_date',
    className: 'font-semibold',
    Cell: ({ row: { original } }) => <NextPayment order={original} />,
  },
];
