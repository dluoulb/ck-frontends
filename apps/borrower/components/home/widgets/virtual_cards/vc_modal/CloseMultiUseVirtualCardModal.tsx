import React from 'react';

import PrimaryButton from '@components/buttons/PrimaryButton';
import ModalWrapper from '@components/modals/ModalWrapper';
import useToast from '@hooks/useToast';
import { closeVirtualCard } from '@lib/actions/companies';
import useApi from '@hooks/useApi';
import { useEntity } from '@contexts/EntityContext';
import useCompanyVirtualCard from '@apps/borrower/hooks/useCompanyVirtualCard';

export default function CloseMultiUseVirtualCardModal({ isModalActive, toggleModal }) {
  const { makeToast } = useToast();
  const api = useApi();
  const { entity } = useEntity();
  const { refetchVirtualCard } = useCompanyVirtualCard();

  const closeCard = () => {
    closeVirtualCard(api, entity.id)
    .then(() => {
      refetchVirtualCard();
      makeToast('Credit Key Card successfully closed', 'success');
    })
    .catch(() => {
      makeToast('Failed to close Credit Key Card. Please contact Credit Key Support', 'error');
    });
    toggleModal();
  };

  return (
    <div role={CloseMultiUseVirtualCardModal.role}>
      <ModalWrapper
        toggleModal={toggleModal}
        isModalActive={isModalActive}
        header=""
      >
        <section>
          <div className="my-2 space-y-4">
            <p className="text-center text-2xl font-bold tracking-wider">
              Close Credit Key Card
            </p>
            <div>
              <p>Are you sure you want to close this card? Once this card has been closed, it can no longer be used.</p>
            </div>
          </div>
          <div className="content flex flex-col gap-2 items-center mt-8">
            <PrimaryButton
              ariaLabel="close-virtual-card-button"
              buttonText="I Understand, Close My Card"
              buttonColor="bg-red-700"
              hoverClass="hover:bg-red-900"
              onClick={closeCard}
            />
          </div>
        </section>
      </ModalWrapper>
    </div>
  );
}

CloseMultiUseVirtualCardModal.role = 'close-multi-use-virtual-card-modal-component';
