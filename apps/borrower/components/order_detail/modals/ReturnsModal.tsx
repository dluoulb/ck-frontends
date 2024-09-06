import React from 'react';
import { faInfoCircle } from '@fortawesome/pro-regular-svg-icons';

import ModalWrapper from '@components/modals/ModalWrapper';

export default function ReturnsModal({ isModalActive, toggleModal }) {
  return (
    <ModalWrapper
      isModalActive={isModalActive}
      toggleModal={toggleModal}
      header="Returns & Refunds"
      modalHeight="!px-2 max-h-modal"
      headerIcon={faInfoCircle}
    >
      <div className="p-4" role={ReturnsModal.role}>
        <header className="text-primary-blue-hover font-bold text-xl">
          Cancellations and Returns
        </header>
        <section className="divide-y">
          <div className="my-4">
            <p className="text-sm">
              To cancel your order or request a refund, first contact your
              merchant and follow their cancellation/refund policies. Notify our
              support team that the cancellation or return has been fully
              processed, then we'll update your Credit Key loan accordingly.
            </p>
            <h5 className="font-semibold text-lg mt-3 mb-1">Making Payments</h5>
            <p className="text-sm">
              While you're waiting for your refund, please continue to make any
              monthly payments that are due.
            </p>
          </div>
          <div className='pt-6'>
            <header className="text-primary-blue-hover font-bold text-xl">
              How are refunds applied?
            </header>

            <h5 className="font-semibold text-lg mt-3 mb-1">
              Refund is less than balance
            </h5>
            <p className="text-sm">
              If your refund is less than your total purchase balance, it might
              not lower or cover your next monthly payment. Instead, you can
              expect fewer monthly payments, a smaller final payment, or both.
            </p>

            <h5 className="font-semibold text-lg mt-3 mb-1">
              Refund is more than balance
            </h5>
            <p className="text-sm">
              If your refund is more than your purchase balance, the difference
              will be refunded, minus any interest paid. Credit Key will credit
              your payment method within 3–10 business days.
            </p>
          </div>
        </section>
      </div>
    </ModalWrapper>
  );
}

ReturnsModal.role = 'returns-modal-component';
