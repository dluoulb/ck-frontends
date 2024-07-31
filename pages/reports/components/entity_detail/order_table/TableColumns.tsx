import Tooltip from '@components/Tooltip';
import DownloadAgreement from '@reports/order_detail/DownloadAgreement';
import { formatCurrency } from 'lib/utils/formatters';
import Link from 'next/link';

import { BuildStack } from './BuildColumnStack';
import OrderStatus from './OrderStatus';

export const TableColumns = [
  {
    Header: 'Date',
    accessor: 'product.capture_date',
    Cell: ({ row: { original } }) => <BuildStack original={original} />,
  },
  {
    Header: 'Order Key',
    hideColumn: 1024,
    accessor: 'order_key',
    Cell: ({ value }) => {
      return (
        <Link
          className="text-primary-blue font-semibold cursor-pointer hover:text-primary-blue-hover"
          href={`/reports/orders/${value}`}
        >
          {value}
        </Link>
      );
    },
  },
  {
    Header: 'Term',
    hideColumn: 1024,
    accessor: 'product.installments',
    Cell: ({ value }) => {
      return value === 4 ? value * 2 + 'w' : value * 30 + 'd';
    },
  },
  {
    Header: 'Amount',
    hideColumn: 640,
    accessor: 'amount',
    Cell: ({ value }) => (
      <Tooltip
        tooltip_text="Principal loan amount not including interest & fees"
        trigger_class="cursor-pointer"
        container_class="text-center p-4 px-6 text-sm bg-secondary-blue"
      >
        {formatCurrency(value)}
      </Tooltip>
    ),
  },
  {
    Header: 'Status',
    hideColumn: 768,
    accessor: 'product.status',
    Cell: ({ row: { original } }) => (
      <OrderStatus
        status={
          original.product.status
            ? original.product.status
            : original.product.payment_plan_status
        }
      />
    ),
  },
  {
    Header: 'Agreement',
    hideColumn: 856,
    accessor: 'id',
    Cell: ({ row: { original } }) => (
      <DownloadAgreement
        buttonClass="cursor-pointer text-sm text-primary-blue hover:text-primary-blue-hover flex items-center"
        order={original}
        isTable={true}
      />
    ),
  },
];
