import React from 'react';
import { faTrashCan, faXmark } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import PrimaryButton from '@components/buttons/PrimaryButton';
import useModal from '@hooks/useModal';
import DeleteUserModal from './DeleteUserModal';

export default function DeleteUserButton({ user }) {
  const { isModalActive, toggleModal } = useModal();

  return (
    <>
      <DeleteUserModal isModalActive={isModalActive} toggleModal={toggleModal} user={user} />
      <div
        onClick={toggleModal}
        className="font-semibold flex items-center gap-1 block xl:hidden text-error hover:cursor-pointer border-b border-transparent hover:border-error max-w-max"
      >
        <FontAwesomeIcon icon={faTrashCan} className="text-xs" />
        <p>Delete User</p>
      </div>
      <div className="hidden xl:block">
        <PrimaryButton
          ariaLabel="delete-payment-method-button"
          buttonText="Delete User"
          icon={faXmark}
          buttonColor="bg-background-error !text-error !max-w-max"
          containerClass="!my-0"
          hoverClass="hover:!text-icon-error"
          onClick={toggleModal}
          isSmall={true}
        />
      </div>
    </>
  );
}
