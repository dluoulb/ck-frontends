import React from 'react';
import classNames from 'classnames';
import { startCase } from 'lodash';
import { DateTime } from 'luxon';

import { getIcon } from '@apps/borrower/utils/status_helper';
import Tooltip from '@components/Tooltip';
import { fromISO } from '@lib/utils/datetime_formatters';
import { formatCurrency } from '@lib/utils/formatters';

export const ScheduleTimeline = ({ order }) => {
  return order.product.payment_schedule.map((ps, idx) => {
    const { iconClass, scheduleIcon } = getIcon(ps.status);

    return (
      <li className="mb-8 xs:mb-16 ml-8" key={idx}>
        <div className="flex justify-between items-start">
          <div className="flex justify-center items-start">
            <span
              className={classNames(
                'flex absolute -left-3.5 justify-center items-center w-7 h-7 rounded-full ring-8 ring-white',
                iconClass
              )}
            >
              <div className="text-white font-bold text-sm">{scheduleIcon}</div>
            </span>
            <div className="space-y-1">
              <h3 className="flex items-center text-lg font-semibold">
                {startCase(ps.status)}
              </h3>
              <time className="block text-sm font-medium leading-none text-secondary-gray">
                {fromISO(ps.date).toLocaleString(DateTime.DATE_MED)}
              </time>
            </div>
          </div>
          <div className="text-base">
            <span className="font-bold ml-1">{formatCurrency(ps.amount)}</span>
          </div>
        </div>
      </li>
    );
  });
};

export const NoScheduleTimeline = () => {
  return (
    <li className="ml-8">
      <div className="flex justify-between items-start">
        <div className="flex justify-center items-center">
          <span
            className={`flex absolute -left-2.5 justify-center items-center w-5 h-5 bg-gray-700 rounded-full ring-8 ring-white`}
          />
          <Tooltip
            tooltip_text="If your order is still pending, your payments will be scheduled when your order is shipped."
            trigger_class="cursor-pointer flex items-start max-w-max text-base"
            container_class="font-normal text-center p-4 px-6 text-sm bg-secondary-blue text-primary-blue-hover w-1/3 tracking-wide"
          >
            No Upcoming Payments
            <span className="text-sm ml-0.5">*</span>
          </Tooltip>
        </div>
      </div>
    </li>
  );
};
