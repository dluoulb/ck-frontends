import React from 'react';

import ModalWrapper from '@components/modals/ModalWrapper';
import AddFundsModal from './AddFundsModal';

export default function AddFundsModalWrapper({ isModalActive, toggleModal }) {
  return (
    <div role={AddFundsModalWrapper.role}>
      <ModalWrapper toggleModal={toggleModal} isModalActive={isModalActive} header="">
        <section>
          <AddFundsModal next={toggleModal} />
        </section>
      </ModalWrapper>
    </div>
  );
}

AddFundsModalWrapper.role = 'add-funds-modal-wrapper-component';
