import React from 'react';
import { faArrowRight } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Form, Formik } from 'formik';

import OutlineButton from '@components/buttons/OutlineButton';
import PrimaryButton from '@components/buttons/PrimaryButton';
import { addMonths, formatShortDate } from '@lib/utils/datetime_formatters';
import { formatCurrency } from '@lib/utils/formatters';

type UpdateTermsFormValues = {
  paymentTerms: string;
};

export default function UpdateTermsModalForm({
  loan,
  onSubmit,
  toggleTermsModal,
}) {
  const ATTEMPT_KEY = `update-terms-attempt-${loan.id}`;
  const lastAttempt = localStorage.getItem(ATTEMPT_KEY);
  const today = new Date().toISOString().slice(0, 10);
  const attemptedToday = lastAttempt === today;

  const oldTerm = loan.product?.installments;
  const newTerm = Number(loan.newTerm);

  const oldTermInfo = loan.approved_terms?.find((t) => t.term === oldTerm);
  const oldNextPayment = oldTermInfo?.monthly_payment;

  const newTermInfo = loan.approved_terms?.find((t) => t.term === newTerm);
  const newNextPayment = newTermInfo?.monthly_payment;

  const disbursementDate = loan.product?.disbursement_date || '';

  const paymentSchedule = loan.product?.payment_schedule || [];

  const scheduledPayments = paymentSchedule.filter(
    (p) => p.status === 'scheduled'
  ).length;

  const oldRemainingPayments = scheduledPayments;
  const newRemainingPayments = Math.max(
    0,
    scheduledPayments - (oldTerm - newTerm)
  );

  const oldDueBy = disbursementDate
    ? formatShortDate(addMonths(disbursementDate, oldTerm))
    : '--';

  const newDueBy = disbursementDate
    ? formatShortDate(addMonths(disbursementDate, newTerm))
    : '--';

  return (
    <Formik<UpdateTermsFormValues> initialValues={{paymentTerms: String(newTerm)}} onSubmit={async (values, actions) => {
      await onSubmit(values, actions);
      localStorage.setItem(ATTEMPT_KEY, today);
    }}>
      {({ isSubmitting }) => (
        <Form>
          <div className="flex justify-between mb-1">
            <span className="font-semibold">New Payment Term</span>
            <span className="flex items-center gap-2">
              <span>
                {oldTerm} {oldTerm == 1 ? 'month' : 'months'}
              </span>
              <FontAwesomeIcon icon={faArrowRight} />
              <span className="bg-white text-right rounded font-semibold">
                {newTerm} {newTerm == 1 ? 'month' : 'months'}
              </span>
            </span>
          </div>
          <div className="flex justify-between mb-1">
            <span className="font-semibold">Remaining Payments</span>
            <span className="flex items-center gap-2">
              <span>{oldRemainingPayments} payments</span>
              <FontAwesomeIcon icon={faArrowRight} />
              <span className="bg-white text-right rounded font-semibold">
                {newRemainingPayments} payments
              </span>
            </span>
          </div>
          <div className="flex justify-between mb-1">
            <span className="font-semibold">Next Payment Amount</span>
            <span className="flex items-center gap-2">
              <span>{formatCurrency(oldNextPayment)}</span>
              <FontAwesomeIcon icon={faArrowRight} />
              <span className="bg-white text-right rounded font-semibold">
                {formatCurrency(newNextPayment)}
              </span>
            </span>
          </div>
          <div className="flex justify-between mb-1">
            <span className="font-semibold">Due by</span>
            <span className="flex items-center gap-2">
              <span>{oldDueBy}</span>
              <FontAwesomeIcon icon={faArrowRight} />
              <span className="bg-white text-right rounded font-semibold">
                {newDueBy}
              </span>
            </span>
          </div>

          {attemptedToday && (<p className="p-3 mt-3 bg-[#F1F2F5] rounded-md">
            <strong>Note: </strong> You are only able to change your term once
            per day. Changing your term does not change the next payment due
            date.
          </p>)}

          <div className="w-full flex justify-between items-center gap-3 mt-4">
            <OutlineButton
              ariaLabel="cancel-update"
              buttonText="Cancel"
              buttonColor="border-primary-blue text-primary-blue"
              hoverClass="hover:text-primary-blue-hover hover:border-primary-blue-hover"
              onClick={toggleTermsModal}
              disabled={isSubmitting}
              containerClass="w-full"
              type="button"
            />
            <PrimaryButton
              ariaLabel="submit-loan-terms"
              buttonText="Confirm Change"
              buttonColor="bg-primary-blue text-white"
              hoverClass="hover:bg-primary-blue-hover"
              disabled={isSubmitting || attemptedToday}
              isLoading={isSubmitting}
              containerClass="w-full whitespace-nowrap"
            />
          </div>
        </Form>
      )}
    </Formik>
  );
}
