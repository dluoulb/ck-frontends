import React from 'react';
import axios from 'axios';

import PrimaryButton from '@components/buttons/PrimaryButton';
import useModal from '@hooks/useModal';
import useUser from '@hooks/useUser';
import PossessUserModal from './PossessUserModal';

export default function PossessUser() {
  const { user } = useUser();
  const { isModalActive, toggleModal } = useModal();

  const clearUser = () => {
    axios.delete(
      `${process.env.NEXT_PUBLIC_SUPERTOKENS_API_DOMAIN}/impersonate`
    );
  };

  return (
    <div
      role={PossessUser.role}
      className="border-b border-primary-gray-border"
    >
      <PossessUserModal
        isModalActive={isModalActive}
        toggleModal={toggleModal}
        clearUser={clearUser}
      />
      <div className="rounded-md bg-primary-beige/20 px-6 py-4 w-full mt-6 mb-3 min-h-28">
        <div>
          <h3 className="text-lg font-medium text-yellow-800">
            Possessing User:
          </h3>
          <div className="flex justify-between items-end">
            <div className="mt-2 text-yellow-700">
              <p>Name: {user?.full_name}</p>
              <p>Email: {user?.email}</p>
            </div>
            <div className="max-w-max">
              <PrimaryButton
                ariaLabel="save-default-terms-button"
                buttonText="Clear User"
                buttonColor="bg-warning w-full sm:w-auto sm:min-w-max !px-6 !my-0"
                hoverClass="hover:bg-warning/80"
                onClick={toggleModal}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

PossessUser.role = 'possess-user-component';
