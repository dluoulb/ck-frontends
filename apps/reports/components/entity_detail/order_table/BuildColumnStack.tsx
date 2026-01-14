import Link from 'next/link';

import DocumentLink from '@components/DocumentLink';
import { reformatDate } from '@lib/utils/datetime_formatters';
import { formatCurrency } from '@lib/utils/formatters';
import OrderStatus from './OrderStatus';

export const BuildStack = ({ original }) => {
  return (
    <>
      <p className="font-semibold lg:font-normal">
        <span className="lg:hidden mr-1 font-normal">Date:</span>
        {reformatDate(
          original.product.disbursement_date
            ? original.product.disbursement_date
            : original.product.capture_date,
        )}
      </p>
      <p className="block lg:hidden font-semibold">
        <span className="mr-1 font-normal">Order Key:</span>
        <Link
          className="text-primary-blue font-semibold cursor-pointer hover:text-primary-blue-hover"
          href={`/reports/orders/${original.order_key}`}
        >
          {original.order_key}
        </Link>
      </p>
      <p className="block lg:hidden font-semibold">
        <span className="mr-1 font-normal">Term:</span>
        <span className="font-avenir-black text-navy-blue ml-1.5">
          {original.product.installments === 4
            ? original.product.installments * 2 + 'w'
            : original.product.installments * 30 + 'd'}
        </span>
      </p>
      <div className="block sm:hidden font-semibold">
        <span className="mr-1 font-normal">Amount:</span>
        {formatCurrency(original.amount)}
      </div>
      <p className="flex md:hidden font-semibold">
        <span className="mr-1 font-normal">Status:</span>
        <OrderStatus
          order={original}
          status={
            original.product.status ? original.product.status : original.product.payment_plan_status
          }
        />
      </p>
      <div className="block mid:hidden">
        <DocumentLink
          buttonText={original.product_type ? 'Payment Plan Agreement' : 'Loan Agreement'}
          buttonClass="cursor-pointer text-sm text-primary-blue hover:text-primary-blue-hover font-medium flex items-center"
          order={original}
          type="agreement"
        />
      </div>
    </>
  );
};
