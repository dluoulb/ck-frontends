import React from 'react';
import classNames from 'classnames';

import Tooltip from '@components/Tooltip';
import { formatCurrency, formatPercent } from '@lib/utils/formatters';

export default function Stats({ order }) {
  const stats = [
    {
      name: 'Order Amount',
      stat: formatCurrency(order?.net_amount),
      className: 'text-success',
    },
    {
      name: `Interest (${
        order?.product_type === 'mambu_loan'
          ? `${order?.product.monthly_interest}%`
          : formatPercent(order?.product.interest_fee_percent * 100)
      })`,
      stat: formatCurrency(order?.expected_interest),
      className: 'text-primary',
    },
    {
      name: 'Additional Fees',
      stat: (
        <Tooltip
          tooltip_text="This notates fees processed at the time of the order. Any additional fees can be found in the fee breakdown below."
          trigger_class="cursor-pointer flex items-start max-w-max"
          container_class="font-normal text-center p-4 px-6 text-sm bg-secondary-blue text-primary-blue-hover w-1/3 tracking-wide"
        >
          {formatCurrency(order?.processing_fee_amount)}
          <span className="text-sm ml-0.5">*</span>
        </Tooltip>
      ),
      className: 'text-primary',
    },
    {
      name: 'Loan Amount',
      stat: formatCurrency(
        parseFloat(order?.net_amount) +
          parseFloat(order?.expected_interest) +
          parseFloat(order?.processing_fee_amount)
      ),
      className: 'text-primary-blue-hover',
    },
  ];
  return (
    <div className="px-2 md:px-3 border-y border-primary-gray-border">
      <dl className="mx-auto grid grid-cols-1 gap-px bg-gray-900/5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => {
          return (
            <div
              key={stat.name}
              className={classNames(
                'flex flex-wrap items-baseline justify-between md:gap-x-4 md:gap-y-2 bg-white py-6',
                idx === 0 ? 'px-4' : 'px-4 md:px-6'
              )}
            >
              <dt className="text-sm leading-3 text-tertiary-gray">
                {stat.name}
              </dt>
              <dd
                className={classNames(
                  'w-full flex-none text-2xl md:text-3xl font-semibold leading-10 tracking-tight',
                  stat.className
                )}
              >
                {stat.stat}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
