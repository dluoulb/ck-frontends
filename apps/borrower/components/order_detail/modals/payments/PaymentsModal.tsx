import React, { useState } from 'react';
import { Formik } from 'formik';

import { useBorrowerDeps } from '@contexts/BorrowerContext';
import { amountBand, captureEvent } from '@lib/posthog';
import PaymentModalForm from './components/PaymentModalForm';

type FormValues = {
  amount: string;
  payment_method_id: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

export default function PaymentsModal({ next, order, setModalState, toggleModal, paymentMethods }) {
  const isPaymentPlan = order.product_type !== 'mambu_loan';
  const { defaultCard, defaultBank } = useBorrowerDeps();
  const [disabled, setDisabled] = useState(true);

  const defaultPayment = order.entity_type === 'account' ? defaultCard : defaultBank;

  const setConfirmModal = (values) => {
    captureEvent('payment_initiated', {
      payment_type: isPaymentPlan ? 'payment_plan' : 'loan',
      amount_band: amountBand(parseFloat(values.amount)),
    });
    setModalState(values);
    next();
  };

  return (
    <div className="px-4 py-2" role={PaymentsModal.role}>
      <section>
        <Formik
          initialValues={{
            amount: order.product.next_payment_due_amount.toString(),
            payment_method_id: defaultPayment?.id,
            loan_id: !isPaymentPlan ? order.product.id : '',
            order_id: isPaymentPlan ? order.id : '',
          }}
          validate={async (values) => {
            const errors: FormErrors = {};

            if ([NaN, 0].includes(parseFloat(values.amount)))
              errors.amount = 'Value must be greater than zero (0)';
            if (!values.payment_method_id) {
              errors.payment_method_id = '* Payment Method Required';
            }
            return errors;
          }}
          onSubmit={async (values) => {
            setConfirmModal(values);
          }}
        >
          {(props) => (
            <PaymentModalForm
              {...props}
              order={order}
              paymentMethods={paymentMethods}
              disabled={disabled}
              setDisabled={setDisabled}
              toggleModal={toggleModal}
            />
          )}
        </Formik>
      </section>
    </div>
  );
}

PaymentsModal.role = 'payments-modal-component';
