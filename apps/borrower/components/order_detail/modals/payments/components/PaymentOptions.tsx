import React, { useEffect, useRef, useState } from 'react';
import { faDollarSign } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { ErrorMessage, Field } from 'formik';

import { formStyles } from '@lib/constants/SiteVariables';
import { formatCurrency } from '@lib/utils/formatters';

export default function PaymentOptions({
  setFieldValue,
  disabled,
  setDisabled,
  order,
}) {
  const [active, setActive] = useState('minimum');
  const minimumRef = useRef(null);
  const remainingRef = useRef(null);
  const customPaymentRef = useRef(null);

  useEffect(() => {
    if (minimumRef.current) {
      minimumRef.current.value =
        order.product.next_payment_due_amount.toString();
    }
    if (remainingRef.current) {
      remainingRef.current.value = order.product.payoff_balance.toString();
    }
  }, [order]);

  const options = [
    {
      tag: 'minimum',
      title: 'Make Minimum Payment',
      display: formatCurrency(order.product.next_payment_due_amount),
      inputName: 'minimum_payment',
      inputValue: order.product.next_payment_due_amount.toString(),
      ref: minimumRef,
      setDisabled: true,
    },
    {
      tag: 'remaining',
      title: 'Pay Off Full Balance',
      display: formatCurrency(order.product.payoff_balance),
      inputName: 'remaining_balance',
      inputValue: order.product.payoff_balance.toString(),
      ref: remainingRef,
      setDisabled: true,
    },
    {
      tag: 'custom',
      title: 'Make Custom Payment',
      display:
        customPaymentRef.current && customPaymentRef.current.value > 0
          ? formatCurrency(customPaymentRef.current.value)
          : '---',
      ref: customPaymentRef,
      setDisabled: false,
    },
  ];

  return (
    <>
      <div className="flex justify-between items-stretch">
        {options.map((op) => {
          return (
            <Field
              name="amount"
              value={op.ref.current ? op.ref.current.value : ''}
              key={op.tag}
            >
              {() => (
                <div
                  className={classNames(
                    'col-span-1 flex flex-col rounded-lg shadow cursor-pointer border-2 border-transparent hover:border-primary-blue w-1/3 mr-2 min-h-32 xs:min-h-28',
                    {
                      '!border-primary-blue bg-primary-blue bg-opacity-10':
                        active === op.tag,
                    }
                  )}
                  onClick={() => {
                    setActive(op.tag);
                    setDisabled(op.setDisabled);
                    setFieldValue(
                      'amount',
                      op.ref.current ? op.ref.current.value : ''
                    );

                    if (op.tag !== 'custom' && customPaymentRef.current) {
                      customPaymentRef.current.value = '';
                    }

                    if (op.tag === 'custom') {
                      customPaymentRef?.current?.focus();
                    }
                  }}
                >
                  <div className="flex-1 flex flex-col p-4 justify-between">
                    <h3 className="text-secondary-gray font-medium text-sm">
                      {op.title}
                    </h3>
                    <dl className="mt-1 flex flex-col">
                      <dt className="sr-only">{op.title}</dt>
                      <dd
                        className={classNames('font-bold truncate', {
                          'text-primary-blue': active === op.tag,
                        })}
                      >
                        {op.display}
                      </dd>
                    </dl>
                    {op.inputValue && (
                      <input
                        value={op.inputValue}
                        name={op.inputName}
                        ref={op.ref}
                        className="hidden"
                        readOnly
                      />
                    )}
                  </div>
                </div>
              )}
            </Field>
          );
        })}
      </div>
      <div className="my-2">
        <label className="text-sm text-secondary-gray font-medium px-0.5">
          Please input custom payment amount
        </label>
        <div className="relative mt-2 rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <FontAwesomeIcon
              icon={faDollarSign}
              className="h-4 w-4 text-gray-400"
            />
          </div>
          <input
            ref={customPaymentRef}
            id="payment_option_custom"
            name="payment_option_custom"
            type="number"
            disabled={disabled}
            placeholder="Enter payment amount"
            onFocus={(e) => {
              setFieldValue('amount', e.target.value);
            }}
            onChange={(e) => {
              setFieldValue('amount', e.target.value);
            }}
            className={classNames(
              'block w-full rounded-md border py-1.5 pl-10 pr-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6',
              disabled
                ? 'cursor-not-allowed border-primary-gray-border'
                : 'border-primary-blue'
            )}
          />
        </div>
        <ErrorMessage
          name="amount"
          component="div"
          className={formStyles.validation}
        />
      </div>
    </>
  );
}
