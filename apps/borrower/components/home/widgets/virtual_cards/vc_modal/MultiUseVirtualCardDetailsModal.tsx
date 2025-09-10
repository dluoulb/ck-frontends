import React from 'react';

import ModalWrapper from '@components/modals/ModalWrapper';
import MultiUseVirtualCardDetails from './MultiUseVirtualCardDetails';
import { faCreditCard } from '@fortawesome/pro-regular-svg-icons';

export default function MultiUseVirtualCardDetailsModal({
  isModalActive,
  toggleModal,
}) {
  return (
    <div data-testid={MultiUseVirtualCardDetailsModal.role}>
      <ModalWrapper
        toggleModal={toggleModal}
        isModalActive={isModalActive}
        header={'View Card'}
        headerIcon={faCreditCard}
      >
        <MultiUseVirtualCardDetails />
        <p className="text-xs sm:text-sm text-gray-400 mt-3">
          This card is issued by Sutton Bank, Member FDIC, pursuant to license
          by Mastercard International Inc.
        </p>
      </ModalWrapper>
    </div>
  );
}

MultiUseVirtualCardDetailsModal.role =
  'multi-use-virtual-card-details-modal-component';
