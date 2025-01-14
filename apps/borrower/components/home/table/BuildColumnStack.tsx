import Link from 'next/link';

import { reformatDate } from '@lib/utils/datetime_formatters';
import { formatCurrency } from '@lib/utils/formatters';
import OrderStatus from './OrderStatus';

export const BuildStack = ({ original }) => {
  return (
    <>
      <p className="block lg:hidden font-semibold flex items-center gap-1">
        <Link
          className="text-primary-blue text-base font-semibold cursor-pointer hover:text-primary-blue-hover"
          href={`/orders/${original.order_key}`}
        >
          {original.order_key}
        </Link>
      </p>
      <p className="font-semibold md:font-normal flex gap-1">
        <span className="lg:hidden font-normal">Order Date:</span>
        {reformatDate(original.created_at)}
      </p>
      <p className="block xl:hidden font-semibold flex gap-1">
        <span className="font-normal">Merchant Name:</span>
        <span>{original.merchant?.name}</span>
      </p>
      <div className="block sm:hidden font-semibold flex gap-1">
        <span className="font-normal">Amount:</span>
        {formatCurrency(original.amount)}
      </div>
      <p className="flex mid:hidden font-semibold flex gap-1">
        <span className="font-normal">Status:</span>
        <OrderStatus order={original} isTable={true} />
      </p>
      <div className="block xl:hidden font-semibold flex gap-1">
        <span className="font-normal">Next Payment Date:</span>
        {reformatDate(original.product?.next_payment_date)}
      </div>
    </>
  );
};
