import React from 'react';
import useModal from '@hooks/useModal';
import MultiUseVirtualCardDetailsModal from './vc_modal/MultiUseVirtualCardDetailsModal';
import Loading from '@components/Loading';
import MaskedVirtualCard from './MaskedVirtualCard';

export default function ActiveMultiUseVirtualCard({ virtualCard }) {
  const { isModalActive, toggleModal } = useModal();

  if (!virtualCard) return <Loading />;

  return (
    <div
      className="w-full"
      role={ActiveMultiUseVirtualCard.role}
    >
      <MaskedVirtualCard
        virtualCard={virtualCard}
        onView={toggleModal}
      />
      <MultiUseVirtualCardDetailsModal
        isModalActive={isModalActive}
        toggleModal={toggleModal}
      />
    </div>
  );
}

ActiveMultiUseVirtualCard.role = 'active-multi-use-virtual-card-component';
