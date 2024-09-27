import React, { useState } from 'react';
import { faArrowLeft, faLockAlt } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import OutlineButton from '@components/buttons/OutlineButton';
import PrimaryButton from '@components/buttons/PrimaryButton';
import useApi from '@hooks/useApi';
import useToast from '@hooks/useToast';
import {
  createLoanPayment,
  createPaymentPlanPayment,
} from '@lib/actions/payments';
import PaymentRecord from '@lib/records/payment';
import ConfirmationData from './components/ConfirmationData';

export default function ConfirmModal({
  order,
  toggleModal,
  modalState,
  next,
  prev,
  reset,
  resetModalState,
  paymentMethods,
  refetchOrder,
}) {
  const api = useApi();
  const { makeToast } = useToast();
  const [loading, setLoading] = useState(false);
  const chosenMethod = paymentMethods?.find(
    (pm) => pm.id === modalState.payment_method_id
  );
  const accountNum = ` x${chosenMethod?.payment_method_last_4}`;

  const onSubmit = async (values) => {
    const payment = new PaymentRecord(values);
    function createPayment() {
      return order.product_type === 'mambu_loan'
        ? createLoanPayment(api, payment)
        : createPaymentPlanPayment(api, payment);
    }

    setLoading(true);
    createPayment()
      .then(() => {
        refetchOrder();
        toggleModal()
        setLoading(false);
        next();
      })
      .catch(async (err) => {
        const error = await err;
        let msg;
        if (error.message === 'Unauthorized') {
          msg =
            'An error occurred. Please try again or contact our support team.';
        } else {
          msg = error.message;
        }
        makeToast(msg, 'error');
        toggleModal();
        setLoading(false);
      });
  };

  return (
    <div role={ConfirmModal.role}>
      <section>
        <div className="pb-4 border-b border-primary-gray-border">
          <div
            onClick={prev}
            className="flex items-center gap-2 text-secondary-gray border-b border-transparent hover:border-secondary-gray hover:cursor-pointer font-semibold my-2 max-w-max"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-sm mt-0.5" />
            <p>Return to Form</p>
          </div>
          <h5 className="font-bold text-2xl text-primary-blue-hover mt-3 mb-1">
            Confirm
          </h5>
          <p>
            Please confirm the details below before submitting your payment.
          </p>
        </div>
        <ConfirmationData
          chosenMethod={chosenMethod}
          accountNum={accountNum}
          order={order}
          modalState={modalState}
        />
        <div className="w-full flex justify-center items-center gap-3">
          <PrimaryButton
            ariaLabel="submit-payment-button"
            buttonText="Submit Payment"
            buttonColor="bg-primary-blue"
            hoverClass="hover:bg-primary-blue-hover"
            icon={faLockAlt}
            disabled={loading}
            isLoading={loading}
            onClick={() => onSubmit(modalState)}
          />
          <OutlineButton
            ariaLabel="Close"
            buttonText="Cancel"
            buttonColor="border-primary-blue text-primary-blue"
            hoverClass=" hover:text-primary-blue-hover hover:border-primary-blue-hover"
            disabled={loading}
            onClick={() => {
              toggleModal();
              reset();
              resetModalState();
            }}
          />
        </div>
      </section>
    </div>
  );
}

ConfirmModal.role = 'confirm-modal-component';
