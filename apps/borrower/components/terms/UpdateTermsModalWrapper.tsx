import React, { useEffect, useState } from 'react';
import { faCalendar } from '@fortawesome/pro-regular-svg-icons';

import ModalWrapper from '@components/modals/ModalWrapper';
import useApi from '@hooks/useApi';
import useToast from '@hooks/useToast';
import { updatePaymentTerms } from '@lib/actions/orders';
import UpdateTermsModalForm from './UpdateTermsModalForm';
import UpdateTermsSelect from './UpdateTermsSelect';
import useOrders from '../../../../shared/hooks/useOrders';

export default function UpdateTermsModalWrapper({
  loan,
  isTermsModalOpen,
  toggleTermsModal,
  refetchOrder,
  startStep = 1,
  refetchOrders,
}: {
  loan: any;
  isTermsModalOpen: boolean;
  toggleTermsModal: () => void;
  refetchOrder?: () => Promise<any>;
  startStep?: number;
  refetchOrders?: () => Promise<any>;
}) {
  const { makeToast } = useToast();
  const [step, setStep] = useState(1);
  const [selectedTerm, setSelectedTerm] = useState(null);

  const api = useApi();

  useEffect(() => {
    if (!isTermsModalOpen) {
      setStep(1);
      setSelectedTerm(null);
    }
  }, [isTermsModalOpen]);

  useEffect(() => {
    if (isTermsModalOpen) {
      setStep(startStep);
      setSelectedTerm(loan.newTerm ?? null);
    }
  }, [isTermsModalOpen, startStep, loan.newTerm]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (values.paymentTerms == loan.product.installments) {
        makeToast(
          `Payment terms are already ${values.paymentTerms} month${values.paymentTerms > 1 ? 's' : ''}`,
          'info',
        );
        toggleTermsModal();
        return;
      }

      await updatePaymentTerms(api, loan.id, values.paymentTerms);
      makeToast(
        `Updated ${loan.order_key} terms to ${values.paymentTerms} month${values.paymentTerms > 1 ? 's' : ''}`,
        'success',
      );
      await refetchOrders?.(); // dashboard refresh
      await refetchOrder?.(); // optional order details page refresh
      toggleTermsModal();
    } catch (err) {
      makeToast(
        'An error occurred. Please contact our support team (support@creditkey.com)',
        'error',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div data-testid={UpdateTermsModalWrapper.role}>
      <ModalWrapper
        isModalActive={isTermsModalOpen}
        toggleModal={toggleTermsModal}
        header={
          <div>
            Confirm Term Change
            <p className="font-normal text-sm text-secondary-gray">
              <span className="font-semibold">{loan.merchant.name}</span> • {loan.order_key}
            </p>
          </div>
        }
        modalWidth="sm:max-w-xl w-full"
        headerIcon={faCalendar}
      >
        {isTermsModalOpen &&
          (step === 1 ? (
            <UpdateTermsSelect
              terms={loan.approved_terms}
              oldTerm={loan.product?.installments}
              selectedTerm={selectedTerm}
              setSelectedTerm={setSelectedTerm}
              onNext={() => setStep(2)}
            />
          ) : (
            <UpdateTermsModalForm
              loan={{ ...loan, newTerm: selectedTerm }}
              onSubmit={handleSubmit}
              toggleTermsModal={toggleTermsModal}
            />
          ))}
      </ModalWrapper>
    </div>
  );
}

UpdateTermsModalWrapper.role = 'update-terms-modal-wrapper';
