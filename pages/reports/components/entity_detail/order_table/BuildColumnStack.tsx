import Tooltip from '@components/Tooltip';
import DownloadAgreement from '@reports/order_detail/DownloadAgreement';
import { reformatDate } from 'lib/utils/datetime_formatters';
import { formatCurrency } from 'lib/utils/formatters';
import Link from 'next/link';

import OrderStatus from './OrderStatus';

export const BuildStack = ({ original }) => {
  return (
    <>
      <p className="font-semibold lg:font-normal">
        <span className="lg:hidden mr-1 font-normal">Date:</span>
        {reformatDate(
          original.product.disbursement_date
            ? original.product.disbursement_date
            : original.product.capture_date
        )}
      </p>
      <p className="block lg:hidden font-semibold">
        <span className="mr-1 font-normal">Order Key:</span>
        <Link
          className="text-primary-blue font-semibold cursor-pointer hover:text-primary-blue-hover"
          href={`/orders/${original.order_key}`}
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
        <Tooltip
          tooltip_text="Principal loan amount not including interest & fees"
          trigger_class="cursor-pointer"
          container_class="text-center p-2 sm:p-4 px-6 text-sm bg-secondary-blue font-normal w-3/4"
        >
          {formatCurrency(original.amount)}
        </Tooltip>
      </div>
      <p className="block md:hidden font-semibold">
        <span className="mr-1 font-normal">Status:</span>
        <OrderStatus
          status={
            original.product.status
              ? original.product.status
              : original.product.payment_plan_status
          }
        />
      </p>
      <div className="block mid:hidden">
        <DownloadAgreement
          buttonText={
            original.product_type ? 'Payment Plan Agreement' : 'Loan Agreement'
          }
          buttonClass="cursor-pointer text-sm text-primary-blue hover:text-primary-blue-hover font-medium flex items-center"
          order={original}
        />
      </div>
    </>
  );
};
