import React from 'react';
import { faArrowRightFromBracket } from '@fortawesome/pro-regular-svg-icons';

import OutlineButton from '@components/buttons/OutlineButton';
import PrimaryButton from '@components/buttons/PrimaryButton';
import ModalWrapper from '@components/modals/ModalWrapper';

export default function PossessUserModal({ isModalActive, toggleModal, clearUser }) {
  return (
    <div data-testid={PossessUserModal.role}>
      <ModalWrapper
        toggleModal={toggleModal}
        isModalActive={isModalActive}
        modalHeight="sm:max-h-recharge sm:min-h-recharge"
        header="Where to?"
        headerIcon={faArrowRightFromBracket}
      >
        <div className="my-3 space-y-3">
          <div>
            <p>Please confirm how you'd like to proceed.</p>
          </div>
          <div className="w-full flex justify-center items-center gap-2">
            <PrimaryButton
              ariaLabel="delete-payment-method-button"
              buttonText="Return to Admin"
              buttonColor="bg-primary-blue-hover !font-normal py-2 sm:py-3 px-4 !md:px-8 xs:!my-2 md:!py-2.5"
              hoverClass="hover:bg-primary-blue-hover/80"
              onClick={() => {
                console.log('takeme to admin');
                // clearUser
              }}
            />
            <OutlineButton
              ariaLabel="Close"
              buttonText="Sign Out"
              buttonColor="border-primary-blue text-primary-blue"
              hoverClass=" hover:text-primary-blue-hover hover:border-primary-blue-hover"
              onClick={() => {
                console.log('sign me out');
              }}
            />
          </div>
        </div>
      </ModalWrapper>
    </div>
  );
}

PossessUserModal.role = 'possess-user-modal-component';
