import React from 'react';
import { DateTime } from 'luxon';

import { fromISO } from '../../../../lib/utils/datetime_formatters';
import {
  formatCurrency,
  formatPercent,
} from '../../../../lib/utils/formatters';

export default function AdditionalInfo({ product, order, entity }) {
  const isPaymentPlan = order?.product_type !== 'mambu_loan';
  const daysPastDue = () => {
    let today = DateTime.now();
    let due_date = fromISO(
      isPaymentPlan ? product?.last_past_due_at : product?.last_past_due_date
    );
    return Math.round(today.diff(due_date, 'days').toObject().days) || 'N/A';
  };
  const lastAutoPayment = isPaymentPlan
    ? product?.last_payment_attempted_at?.replace(' ', 'T')
    : product?.last_auto_payment_try_date;

  return (
    <>
      <p className="font-semibold tracking-wide text-lg my-4">
        Additional Details
      </p>
      <div className="grid grid-rows-18 !gap-0 sm:grid-rows-8 lg:grid-rows-6 grid-flow-col capitalize rounded shadow bg-secondary-blue text-sm px-6 md:px-10 xl:pl-40 py-4 lg:py-8">
        <p>
          <span className="font-semibold mr-1">interest free months:</span>
          {isPaymentPlan
            ? product?.interest_free_intervals
            : product?.interest_free_months}
        </p>
        <p>
          <span className="font-semibold mr-1">borrower fee:</span>
          {formatPercent(
            (isPaymentPlan
              ? product?.processing_fee_percent
              : product?.borrower_fee) * 100
          )}
        </p>
        <p className="capitalize">
          <span className="font-semibold mr-1">Transaction Type:</span>
          {order?.transaction_type === 'cka' ? 'CKA' : order?.transaction_type}
        </p>
        <p>
          <span className="font-semibold mr-1">days late:</span>
          {daysPastDue()}
        </p>
        <p>
          <span className="font-semibold mr-1">amount refunded:</span>
          {formatCurrency(
            isPaymentPlan
              ? product?.total_amount_refunded
              : product?.amount_refunded
          )}
        </p>
        <p>
          <span className="font-semibold mr-1">settled amount:</span>
          {formatCurrency(product?.settled_amount)}
        </p>
        <p>
          <span className="font-semibold mr-1">monthly payment amount:</span>
          {isPaymentPlan
            ? formatCurrency(product?.next_payment_due_amount || 0)
            : formatCurrency(product?.next_payment_amount)}
        </p>
        <p>
          <span className="font-semibold mr-1">
            {isPaymentPlan ? 'payment plan' : 'loan'} monthly fee:
          </span>
          {formatCurrency(
            isPaymentPlan
              ? (product?.amount - product?.total_amount_refunded) *
                  product?.interest_fee_percent
              : product?.monthly_fee.cents / 100
          )}
        </p>
        <p>
          <span className="font-semibold mr-1">
            {isPaymentPlan ? 'payment plan' : 'loan'} monthly interest:
          </span>
          {formatPercent(
            isPaymentPlan
              ? product?.interest_fee_percent * 100
              : product?.monthly_interest
          )}
        </p>

        <p>
          <span className="font-semibold mr-1">last autopayment date:</span>
          {lastAutoPayment ? fromISO(lastAutoPayment).toLocaleString() : 'N/A'}
        </p>
        <p>
          <span className="font-semibold mr-1">decline charge attempts:</span>
          {isPaymentPlan
            ? product?.nsf_count
            : product?.declined_charge_attempts}
        </p>
        {order?.entity_type === 'company' && (
          <p>
            <span className="font-semibold mr-1">State/Region:</span>
            {entity?.address.state}
          </p>
        )}
        <p>
          <span className="font-semibold mr-1">shipping address:</span>
        </p>
        {!order?.shipping_address || !order?.shipping_address?.address1 ? (
          'Not Provided'
        ) : (
          <>
            <p>{order?.shipping_address.address1}</p>
            <p>{order?.shipping_address.address2}</p>
            <p>
              {order?.shipping_address.city}, {order?.shipping_address.state}{' '}
              {order?.shipping_address?.zip.substring(0, 5)}
            </p>
          </>
        )}
      </div>
    </>
  );
}
