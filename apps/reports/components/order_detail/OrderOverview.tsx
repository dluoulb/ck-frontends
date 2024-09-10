import React from 'react';
import classNames from 'classnames';
import { DateTime } from 'luxon';

import DocumentLink from '@components/DocumentLink';
import Loading from '@components/Loading';
import useUser from '@hooks/useUser';
import { reformatDate } from '@lib/utils/datetime_formatters';

export default function OrderOverview({ order, product }) {
  let statusColor;
  let statusText;
  const { user } = useUser();
  const isPaymentPlan = order?.product_type !== 'mambu_loan';

  const status = isPaymentPlan
    ? product?.payment_plan_status.toLowerCase()
    : product?.status.toLowerCase();
  switch (status) {
    case 'paid':
    case 'void':
      statusColor = 'bg-gray-200 text-primary';
      statusText = status;
      break;
    case 'new':
      statusColor = 'bg-secondary-blue text-primary-blue';
      statusText = status;
      break;
    case 'active':
    case 'funded':
      statusColor = 'bg-background-success text-success';
      statusText = 'Active';
      break;
    default:
      statusColor = 'bg-secondary-blue text-primary-blue';
      statusText = status;
      break;
  }

  if (!user) return <Loading className="w-14 h-14 my-16" />;

  return (
    <div className="flex justify-between items-center">
      <div className="w-full flex flex-col sm:flex-row justify-between capitalize">
        <div>
          <p className="font-semibold">
            Merchant Order ID: {order?.merchant_order_id}
          </p>
          {product?.mambu_loan_id && (
            <p className="mx-1">{product?.mambu_loan_id} | </p>
          )}
          <p>
            {reformatDate(
              isPaymentPlan
                ? product?.disbursement_date
                : product?.capture_date,
              false,
              DateTime.DATE_MED_WITH_WEEKDAY
            )}
          </p>
          {['superadmin', 'admin'].includes(user?.role) && (
            <a
              href={order?.checkout_url}
              target="_new"
              className="text-sm text-primary-blue hover:text-primary-blue-hover font-medium"
            >
              Checkout Session URL
            </a>
          )}
        </div>
        <div className="flex flex-col-reverse sm:flex-col sm:items-end justify-between gap-2">
          <span
            className={classNames(
              'inline-flex items-center text-lg rounded-md px-4 py-2 font-semibold tracking-wide',
              statusColor
            )}
          >
            {statusText}
          </span>
          <DocumentLink
            buttonClass="cursor-pointer text-sm text-primary-blue hover:text-primary-blue-hover font-medium flex items-center"
            buttonText={
              isPaymentPlan ? 'Payment Plan Agreement' : 'Loan Agreement'
            }
            order={order}
            type="agreement"
          />
        </div>
      </div>
    </div>
  );
}
