import React from 'react';
import { faTrashXmark } from '@fortawesome/pro-regular-svg-icons';

import OutlineButton from '@components/buttons/OutlineButton';
import PrimaryButton from '@components/buttons/PrimaryButton';
import ModalWrapper from '@components/modals/ModalWrapper';
import { useBorrowerDeps } from '@contexts/BorrowerContext';
import useApi from '@hooks/useApi';
import useToast from '@hooks/useToast';
import { deletePaymentMethod } from '@lib/actions/payment_methods';
import { supportPhone } from '@lib/constants/SiteVariables';

export default function DeletePmModal({ isModalActive, toggleModal, payment_method, setLoading }) {
  const api = useApi();
  const { makeToast } = useToast();
  const { refetchPaymentMethods } = useBorrowerDeps();

  const deletePM = (payment_method) => {
    setLoading(payment_method?.id);
    deletePaymentMethod(api, payment_method)
      .then(() => {
        refetchPaymentMethods();
        makeToast('Payment Method Successfully Deleted', 'success');
      })
      .catch(() => {
        makeToast('An error occurred. Please try again or contact our support team.', 'error');
        setLoading(null);
      })
      .finally(() => {
        setLoading(null);
      });
  };

  return (
    <div data-testid={DeletePmModal.role}>
      <ModalWrapper
        toggleModal={toggleModal}
        isModalActive={isModalActive}
        modalHeight="sm:max-h-recharge sm:min-h-recharge"
        header="Delete Payment Method?"
        headerIcon={faTrashXmark}
      >
        <div className="my-3 space-y-3">
          <div className="text-lg sm:text-xl font-semibold">
            {!payment_method?.is_default
              ? 'Are you sure?'
              : 'Default payment methods cannot be deleted.'}
          </div>
          <div className="text-sm sm:text-base">
            {!payment_method?.is_default ? (
              <p>
                Please confirm you'd like to delete
                <span className="mx-1 font-medium text-primary-blue">
                  {payment_method?.payment_type === 'card'
                    ? payment_method?.credit_card_type
                    : payment_method?.payment_method_label}
                  <span className="ml-1">x</span>
                  {payment_method?.payment_method_last_4}
                </span>
                as a payment method.
              </p>
            ) : (
              // ---------> You cannot remove a default PM <---------
              <div>
                Please set a new default payment method before proceeding or contact our support
                team for further assistance.
                <p className="my-2">
                  <a
                    href="mailto:support@creditkey.com"
                    className="no-underline text-primary-blue mr-2 cursor-pointer"
                  >
                    support@creditkey.com
                  </a>
                  or
                  <a
                    href={`tel:${supportPhone}`}
                    className="ml-2 no-underline text-primary-blue cursor-pointer"
                  >
                    {supportPhone}
                  </a>
                </p>
              </div>
            )}
          </div>
          <div className="w-full flex justify-center items-center gap-2">
            {!payment_method?.is_default && (
              <PrimaryButton
                ariaLabel="delete-payment-method-button"
                buttonText="Delete"
                buttonColor="bg-error"
                hoverClass="hover:bg-icon-error"
                onClick={() => {
                  deletePM(payment_method);
                  toggleModal();
                }}
              />
            )}
            <OutlineButton
              ariaLabel="Close"
              buttonText="Cancel"
              buttonColor="border-error text-error"
              hoverClass=" hover:text-icon-error hover:border-icon-error"
              onClick={toggleModal}
            />
          </div>
        </div>
      </ModalWrapper>
    </div>
  );
}

DeletePmModal.role = 'delete-pm-modal-component';
