import React from 'react';
import ModalWrapper from '@components/modals/ModalWrapper';
import MultiUseVirtualCardDetails from './MultiUseVirtualCardDetails';

export default function MultiUseVirtualCardDetailsModal({ isModalActive, toggleModal }) {
  return (
    <div data-testid={MultiUseVirtualCardDetailsModal.role}>
      <ModalWrapper
        toggleModal={toggleModal}
        isModalActive={isModalActive}
        header=""
      >
        <MultiUseVirtualCardDetails />
      </ModalWrapper>
    </div>
  );
}

MultiUseVirtualCardDetailsModal.role = 'multi-use-virtual-card-details-modal-component';
