import React, { useState } from 'react';
import { faTrashXmark } from '@fortawesome/pro-regular-svg-icons';

import OutlineButton from '@components/buttons/OutlineButton';
import PrimaryButton from '@components/buttons/PrimaryButton';
import ModalWrapper from '@components/modals/ModalWrapper';
import { useBorrowerDeps } from '@contexts';
import useApi from '@hooks/useApi';
import useToast from '@hooks/useToast';
import { deleteCompanyUser } from '@lib/actions/users';

export default function DeleteUserModal({ isModalActive, toggleModal, user }) {
  const api = useApi();
  const { refetchCompanyUsers } = useBorrowerDeps();
  const { makeToast } = useToast();
  const [loading, setLoading] = useState(false);

  const deleteUser = () => {
    setLoading(true);
    deleteCompanyUser(api, user)
      .then(() => {
        refetchCompanyUsers();
        makeToast('User Successfully Deleted', 'success');
        toggleModal();
      })
      .catch((err) =>
        makeToast(
          'An error occurred. Please try again or contact our support team.',
          'error'
        )
      )
      .finally(() => setLoading(false));
  };

  return (
    <div data-testid={DeleteUserModal.role}>
      <ModalWrapper
        toggleModal={toggleModal}
        isModalActive={isModalActive}
        modalHeight="sm:max-h-recharge sm:min-h-recharge"
        header="Delete Purchaser?"
        headerIcon={faTrashXmark}
      >
        <div className="my-3 space-y-3">
          <div className="text-xl font-semibold">Are you sure?</div>
          <div>
            <p>
              Please confirm you'd like to delete
              <span className="mx-1 font-medium text-primary-blue">
                {user?.first_name} {user?.last_name}
              </span>
              as a purchasing user.
            </p>
          </div>
          <div className="w-full flex justify-center items-center gap-2">
            <PrimaryButton
              ariaLabel="delete-user-button"
              buttonText="Yes, Delete"
              buttonColor="bg-error"
              hoverClass="hover:bg-icon-error"
              isLoading={loading}
              disabled={loading}
              onClick={deleteUser}
            />
            <OutlineButton
              ariaLabel="Close"
              buttonText="Cancel"
              buttonColor="border-error text-error"
              hoverClass=" hover:text-icon-error hover:border-icon-error"
              disabled={loading}
              onClick={toggleModal}
            />
          </div>
        </div>
      </ModalWrapper>
    </div>
  );
}

DeleteUserModal.role = 'delete-user-modal-component';
