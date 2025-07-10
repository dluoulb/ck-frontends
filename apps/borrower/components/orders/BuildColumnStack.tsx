import Link from 'next/link';
import { faEdit } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { reformatDate } from '@lib/utils/datetime_formatters';
import { formatCurrency } from '@lib/utils/formatters';
import OrderStatus from '../home/table/OrderStatus';

export const BuildStack = ({ original, onEditPaymentTerm }) => {
  return (
    <>
      <p className="block xl:hidden font-semibold flex items-center gap-1">
        <Link
          className="text-primary-blue text-base font-semibold cursor-pointer hover:text-primary-blue-hover"
          href={`/orders/${original.order_key}`}
        >
          {original.order_key}
        </Link>
      </p>
      <p className="font-semibold 3xl:font-normal flex gap-1">
        <span className="2xl:hidden font-normal">Order Date:</span>
        {reformatDate(original.created_at)}
      </p>
      <p className="block 3xl:hidden font-semibold flex gap-1">
        <span className="font-normal">Merchant Name:</span>
        <span>{original.merchant?.name}</span>
      </p>
      <p className="block 3xl:hidden font-semibold flex gap-1">
        <span className="font-normal">Merchant Order ID:</span>
        <span>{original.merchant_order_id}</span>
      </p>
      <div className="block sm:hidden font-semibold flex gap-1">
        <span className="font-normal">Amount:</span>
        {formatCurrency(original.amount)}
      </div>
      <p className="flex mid:hidden font-semibold flex gap-1">
        <span className="font-normal">Status:</span>
        <OrderStatus order={original} isTable={true} />
      </p>
      <div className="block 2xl:hidden font-semibold flex gap-1">
        <span className="font-normal">Payment Terms:</span>
        <div
          className={
            original.terms_editable
              ? 'flex items-center gap-2 cursor-pointer'
              : 'flex items-center gap-2'
          }
          onClick={() =>
            original.terms_editable && onEditPaymentTerm?.(original)
          }
        >
          <span>{original.product?.installments}</span>
          {original.terms_editable && (
            <FontAwesomeIcon icon={faEdit} className="text-gray-400 w-4 h-4" />
          )}
        </div>
      </div>
      <div className="block 2xl:hidden font-semibold flex gap-1">
        <span className="font-normal">Next Payment Date:</span>
        {reformatDate(original.product?.next_payment_date)}
      </div>
      <div className="block 2xl:hidden font-semibold flex gap-1">
        <span className="font-normal">Next Payment Amount:</span>
        {formatCurrency(original.product?.next_payment_due_amount)}
      </div>
    </>
  );
};
