import { reformatDate } from '@lib/utils/datetime_formatters';
import { formatCurrency } from '@lib/utils/formatters';

export const BuildStack = ({ original }) => {
  return (
    <>
      <p className="font-semibold sm:font-normal flex gap-1">
        <span className="sm:hidden font-normal">ID:</span>
        <span className="sm:hidden">{original.id}</span>
      </p>
      <p className="font-semibold md:font-normal flex gap-1">
        <span className="md:hidden font-normal">Value date:</span>
        {original.loan_id
          ? reformatDate(original.payment_date)
          : reformatDate(original.value_date)}
      </p>
      <p className="block sm:hidden font-semibold flex gap-1">
        <span className="font-normal">Amount:</span>
        <span className="text-primary-blue-hover">
          {original.loan_id
            ? formatCurrency(original.amount.cents / 100)
            : formatCurrency(original.amount)}
        </span>
      </p>
      <p className="block text-sm lg:hidden font-semibold flex gap-1 capitalize">
        <span className="font-normal">Note:</span>
        {original?.note?.toLowerCase().replaceAll('_', ' ')}
      </p>
      <p className="block mid:hidden font-semibold capitalize flex gap-1">
        <span className="font-normal">Transaction Type:</span>
        {original?.type?.toLowerCase().replaceAll('_', ' ')}
      </p>
    </>
  );
};
