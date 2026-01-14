import React from 'react';
import { ErrorMessage, Field } from 'formik';

import { formStyles } from '@lib/constants/SiteVariables';

export default function PaymentMethods({ order, paymentMethods, setFieldValue }) {
  const pmType = order.entity_type === 'account' ? 'card' : 'bank_account';
  const paymentList = paymentMethods
    ?.filter((pm) => pm.payment_type === pmType)
    .sort((a, b) => (b.is_default ? 1 : 0) - (a.is_default ? 1 : 0));

  return (
    <div>
      <fieldset>
        <legend className="sr-only">Payment Methods</legend>
        <div className="divide-y divide-border-gray">
          {paymentList.map((pm, idx) => {
            return (
              <div key={idx} className="relative flex items-start py-4">
                <div className="flex items-center">
                  <Field
                    id={pm.id.toString()}
                    type="radio"
                    name="payment_method_id"
                    value={pm.id.toString()}
                    className="focus:ring-primary-blue h-4 w-4 mr-3 text-primary-blue"
                  />
                  <div
                    className="min-w-0 flex-1 cursor-pointer"
                    onClick={() => setFieldValue('payment_method_id', pm.id.toString())}
                  >
                    <label className="font-bold">
                      {order.entity_type === 'account'
                        ? pm.credit_card_type
                        : pm.payment_method_label}
                      <span className="mx-4 font-medium text-secondary-gray text-sm">
                        x{pm.payment_method_last_4}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </fieldset>
      <ErrorMessage name="payment_method_id" component="div" className={formStyles.validation} />
    </div>
  );
}
