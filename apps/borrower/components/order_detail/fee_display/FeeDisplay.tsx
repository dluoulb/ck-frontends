import React from 'react';
import classNames from 'classnames';
import { DateTime } from 'luxon';

import useOrderFees from '@apps/borrower/hooks/useOrderFees';
import { fromISO } from '@lib/utils/datetime_formatters';
import { formatCurrency } from '@lib/utils/formatters';

export default function FeesDisplay({ order, open }) {
  const {
    compressedFeeSummary,
    feeDisplay,
    setFeeDisplay,
    getFeeTitle,
    getFeeBreakdownDisplay,
  } = useOrderFees(order);

  return (
    <div className="flex flex-col">
      <h1 className="font-medium text-secondary-gray px-4 py-2">
        Click on a fee type below to see more details
      </h1>
      <div className="divide-y">
        {compressedFeeSummary?.map((f) => {
          return (
            <div
              key={f.fee_type}
              onClick={() => {
                setFeeDisplay((prevFeeDisplay) => ({
                  ...prevFeeDisplay,
                  [f.fee_type]: !feeDisplay[f.fee_type],
                }));
              }}
              className="flex flex-col border-y"
            >
              <div
                className={classNames(
                  'p-4 flex items-center justify-between hover:bg-secondary-blue/60 hover:cursor-pointer',
                  { 'bg-secondary-blue/60': open }
                )}
              >
                <div className="font-bold flex items-center gap-1.5">
                  <span>
                    {getFeeTitle(f.fee_type)}
                    (s)
                  </span>
                  <span className="text-tertiary-gray">x{f.count}</span>
                </div>
                {f.fee_type === 'PROCESSING_FEE' && f.adjustments ? (
                  <p className="font-bold">
                    {formatCurrency(
                      f.totalAmount -
                        f.adjustments.fees[f.adjustments.fees.length - 1]
                          ?.amount
                    )}
                  </p>
                ) : (
                  <p className="font-bold">
                    {f.adjustments
                      ? formatCurrency(
                          f.totalAmount - f.adjustments.totalAmount
                        )
                      : formatCurrency(f.totalAmount)}
                  </p>
                )}
              </div>
              {feeDisplay && feeDisplay[f.fee_type] && (
                <div className="divide-y bg-tertiary-gray/5">
                  {f.adjustments
                    ? getFeeBreakdownDisplay(f, f.adjustments)
                    : f.fees.map((i) => {
                        return (
                          <div
                            key={i.id}
                            className="px-6 py-2 flex justify-between"
                          >
                            <p>
                              {fromISO(
                                i.value_date.replace(' ', 'T')
                              ).toLocaleString(DateTime.DATE_SHORT)}
                            </p>
                            <p>{formatCurrency(i.amount)}</p>
                          </div>
                        );
                      })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
