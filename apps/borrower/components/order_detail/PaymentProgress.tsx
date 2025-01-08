import React from 'react';
import classNames from 'classnames';
import { useRouter } from 'next/router';

import PrimaryButton from '@components/buttons/PrimaryButton';
import { formatCurrency } from '@lib/utils/formatters';

export default function PaymentProgress({
  order,
  paymentMethods,
  toggleModal,
}) {
  let progressColor;
  const router = useRouter();

  const active = ['active', 'funded'].includes(order?.product.status);

  if (order?.product.isPastDue) {
    progressColor = 'bg-error';
  } else if (active && order?.product?.progress < 100) {
    progressColor = 'bg-success';
  } else {
    progressColor = 'bg-secondary-gray';
  }

  return (
    <div className="rounded-md p-8 w-full">
      <h4 className="sr-only">Status</h4>
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold">Payment Progress</p>
        {active &&
          order.product.next_payment_due_amount &&
          (!paymentMethods?.length ? (
            <PrimaryButton
              ariaLabel="link-to-payment-methods-page-button"
              buttonText="Connect A Bank"
              buttonColor="bg-error"
              hoverClass="hover:bg-icon-error"
              containerClass="max-w-max"
              onClick={() => router.push('/payment_methods')}
            />
          ) : (
            <PrimaryButton
              ariaLabel="toggle-payment-modal-button"
              buttonText="Make a Payment"
              buttonColor="bg-primary-blue !my-0"
              hoverClass="hover:bg-primary-blue-hover"
              containerClass="max-w-max"
              onClick={toggleModal}
            />
          ))}
      </div>
      <div aria-hidden="true" className="mt-8">
        <div className="bg-stroke rounded-full bg-gray-200 relative h-2.5 w-full">
          <div
            className={`absolute top-0 left-0 h-full rounded-full ${progressColor}`}
            style={{ width: `${order?.product?.progress > 100 ? 100 : order?.product?.progress}%` }}
          >
            <span
              className={classNames(
                'absolute -right-4 bottom-full mb-2 rounded-sm px-3.5 py-1 text-sm text-white',
                progressColor,
                {'hidden': !order?.product?.progress || order?.product?.progress >= 100 }
              )}
            >
              <span
                className={classNames(
                  'absolute bottom-[-2px] left-1/2 -z-10 h-2 w-2 -translate-x-1/2 rotate-45 rounded-sm',
                  progressColor
                )}
              ></span>
              {formatCurrency(order?.product?.paid_amount)}
            </span>
          </div>
        </div>

        <div className="mt-6 w-full flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-secondary-gray">
              Total Amount
            </p>
            <p className="font-bold text-base sm:text-xl my-1">
              {formatCurrency(order?.net_amount)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-secondary-gray">
              Remaining Balance
            </p>
            <p className="font-bold text-base sm:text-xl my-1">
              {formatCurrency(order?.total_balance)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
