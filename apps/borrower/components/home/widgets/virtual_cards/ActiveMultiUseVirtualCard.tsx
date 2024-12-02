import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/pro-regular-svg-icons';
import useModal from '@hooks/useModal';
import MultiUseVirtualCardDetailsModal from './vc_modal/MultiUseVirtualCardDetailsModal';

export default function ActiveMultiUseVirtualCard({ virtualCard }) {
  const { isModalActive, toggleModal } = useModal();

  return (
    <div>
      <span className="text-navy-blue">{`XXXX XXXX XXXX ${virtualCard.last_four}`}</span>
      <button
        type="button"
        className="tracking-wider text-navy-blue hover:text-primary-blue text-sm ml-4 inline-block"
        onClick={() =>
          toggleModal()
        }
      >
        <FontAwesomeIcon icon={faEye} />
      </button>
      <MultiUseVirtualCardDetailsModal isModalActive={isModalActive} toggleModal={toggleModal} />
    </div>
  );
}
