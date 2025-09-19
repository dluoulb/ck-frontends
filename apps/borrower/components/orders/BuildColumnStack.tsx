import Link from 'next/link';

import { useApprovedTerms } from '@apps/borrower/hooks/useApprovedTerms';
import { formatShortDate } from '@lib/utils/datetime_formatters';
import NextPayment from '../home/table/NextPayment';
import OrderTotalColumn from '../home/table/OrderTotalColumn';
import TermsColumn from '../home/table/TermsColumn';

export const BuildStack = ({ original, openModalForLoan }) => {
  const isEditable = original.terms_editable;
  const installments = Number(original.product?.installments ?? 0);
  const label = installments
    ? `${installments} ${installments === 1 ? 'month' : 'months'}`
    : '—';

  const { terms } = useApprovedTerms(original.id);

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="sm:hidden font-medium flex items-center gap-1">
          <Link
            className="text-primary-blue text-base font-medium cursor-pointer hover:text-primary-blue-hover"
            href={`/orders/${original.order_key}`}
          >
            {original.order_key}
          </Link>
        </p>

        {isEditable ? (
          <div className="sm:hidden">
            <TermsColumn
              order={original}
              terms={terms}
              openModalForLoan={openModalForLoan}
            />
          </div>
        ) : (
          <span className="sm:hidden font-medium">{label}</span>
        )}
      </div>
      <div className="flex items-center justify-between space-x-3 mt-1">
        <div>
          <p className="sm:hidden font-medium flex gap-1">
            <span>{original.merchant?.name}</span>
          </p>
          <p className="font-medium text-tertiary-gray flex gap-1">
            {formatShortDate(original.created_at)}
          </p>
        </div>
        <div className="sm:hidden font-medium flex gap-1">
          <OrderTotalColumn order={original} />
        </div>
        <div className="sm:hidden font-medium flex gap-1">
          <NextPayment order={original} />
        </div>
      </div>
    </>
  );
};
