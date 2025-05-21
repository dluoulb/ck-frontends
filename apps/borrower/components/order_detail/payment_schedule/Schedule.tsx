import React from 'react';
import { faArrowRotateLeft, faCheck } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DateTime } from 'luxon';

import PrimaryButton from '@components/buttons/PrimaryButton';
import Loading from '@components/Loading';
import { fromISO } from '@lib/utils/datetime_formatters';
import { formatCurrency } from '@lib/utils/formatters';
import { NoScheduleTimeline, ScheduleTimeline } from './ScheduleTimeline';

export default function Schedule({ order, toggleTermsModal }) {
  if (!order) return <Loading className="w-14 h-14 my-20" />;

  return (
    <div role={Schedule.role}>
      {order.terms_editable && (
        <div className="flex justify-end p-8">
          <PrimaryButton
            ariaLabel="toggle-terms-modal-button"
            buttonText="Update Payment Terms"
            buttonColor="bg-primary-blue"
            hoverClass="hover:bg-primary-blue-hover"
            containerClass="max-w-max"
            onClick={toggleTermsModal}
          />
        </div>
      )}
      <div className="p-6 px-12">
        <ol className="relative border-l border-opaque-navy-border">
          <li className="mb-10 ml-8">
            <div className="flex justify-between items-start">
              <div>
                <span className="flex absolute -left-3.5 justify-center items-center w-7 h-7 bg-success rounded-full ring-8 ring-white">
                  <div className="text-white font-bold text-sm mt-0.5">
                    <FontAwesomeIcon icon={faCheck} />
                  </div>
                </span>
                <div className="space-y-1">
                  <h3 className="flex items-center text-lg font-semibold">
                    Order Processed
                  </h3>
                  <time className="block text-sm font-medium leading-none text-secondary-gray">
                    {fromISO(order.created_at).toLocaleString(
                      DateTime.DATE_MED
                    )}
                  </time>
                </div>
              </div>
              <p className="font-bold text-base">
                {formatCurrency(order.product.amount)}
              </p>
            </div>
          </li>
          {parseFloat(order.amount_refunded) > 0 && (
            <li className="mb-16 ml-8">
              <div className="flex justify-between items-start">
                <div className="flex justify-center items-center">
                  <span className="flex absolute -left-3.5 justify-center items-center w-7 h-7 bg-gray-500 rounded-full ring-8 ring-white">
                    <div className="text-white text-sm">
                      <FontAwesomeIcon icon={faArrowRotateLeft} />
                    </div>
                  </span>
                  <h3 className="flex items-center text-base">
                    Refund(s) Processed
                  </h3>
                </div>
                <p className="text-lg font-bold">
                  {formatCurrency(order.amount_refunded)}
                </p>
              </div>
            </li>
          )}
          {order?.product?.payment_schedule?.length > 0 ? (
            <ScheduleTimeline order={order} />
          ) : (
            <NoScheduleTimeline />
          )}
        </ol>
      </div>
    </div>
  );
}

Schedule.role = 'schedule-component';
