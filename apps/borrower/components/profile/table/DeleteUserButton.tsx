import React from 'react';
import { faXmark } from '@fortawesome/pro-regular-svg-icons';

import PrimaryButton from '@components/buttons/PrimaryButton';
import useModal from '@hooks/useModal';
import DeleteUserModal from './DeleteUserModal';

export default function DeleteUserButton({ user }) {
  const { isModalActive, toggleModal } = useModal();

  return (
    <>
      <DeleteUserModal
        isModalActive={isModalActive}
        toggleModal={toggleModal}
        user={user}
      />
      <PrimaryButton
        ariaLabel="delete-payment-method-button"
        buttonText="Remove"
        icon={faXmark}
        buttonColor="bg-background-error !text-error !max-w-max"
        hoverClass="hover:!text-icon-error"
        onClick={toggleModal}
        isSmall={true}
      />
    </>
  );
}
