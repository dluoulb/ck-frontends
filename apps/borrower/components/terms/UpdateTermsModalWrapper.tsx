import React, { useEffect, useState } from 'react';
import { faCalendar } from '@fortawesome/pro-regular-svg-icons';

import Loading from '@components/Loading';
import ModalWrapper from '@components/modals/ModalWrapper';
import { useBorrowerDeps } from '@contexts/BorrowerContext';
import useApi from '@hooks/useApi';
import useModal from '@hooks/useModal';
import useToast from '@hooks/useToast';
import { updatePaymentTerms } from '@lib/actions/orders';
import UpdateTermsModalForm from './UpdateTermsModalForm';
import { useApprovedTerms } from '@apps/borrower/hooks/useApprovedTerms';
export default function UpdateTermsModalWrapper({
  loan,
  isTermsModalOpen,
  toggleTermsModal,
  refetchOrder,
}: {
  loan: any;
  isTermsModalOpen: boolean;
  toggleTermsModal: () => void;
  refetchOrder?: () => Promise<any>;
}) {
  const { makeToast } = useToast();
  const { refetchOrders } = useBorrowerDeps();
  const { modalState, setModalState, resetModalState } = useModal();
  const { terms, loading: termsLoading } = useApprovedTerms(loan.id);
  const api = useApi();

  useEffect(() => {
    resetModalState();
  }, [isTermsModalOpen]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (values.paymentTerms == loan.product.installments) {
        makeToast(
          `Payment terms are already ${values.paymentTerms} month${values.paymentTerms > 1 ? 's' : ''}`,
          'info'
        );
        toggleTermsModal();
        return;
      }

      await updatePaymentTerms(api, loan.id, values.paymentTerms);
      makeToast(
        `Updated ${loan.order_key} terms to ${values.paymentTerms} month${values.paymentTerms > 1 ? 's' : ''}`,
        'success'
      );
      await refetchOrders(); // dashboard refresh
      await refetchOrder?.(); // optional order details page refresh
      toggleTermsModal();
    } catch (err) {
      makeToast(
        'An error occurred. Please contact our support team (support@creditkey.com)',
        'error'
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
            Edit Payment Terms
            <p className="font-normal text-xs text-secondary-gray">
              Change the number of installments
            </p>
          </div>
        }
        modalWidth="sm:max-w-xl w-full"
        headerIcon={faCalendar}
      >
        {termsLoading ? (
          <Loading className="w-10 h-10 my-8" />
        ) : (
          <UpdateTermsModalForm
            loan={loan}
            onSubmit={handleSubmit}
            toggleTermsModal={toggleTermsModal}
            availableTerms={terms}
          />
        )}
      </ModalWrapper>
    </div>
  );
}

UpdateTermsModalWrapper.role = 'update-terms-modal-wrapper';
