import React, { useState } from 'react';
import { faCreditCard, faEnvelope, faPhone } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import useCompanyPhysicalCard from '@apps/borrower/hooks/useCompanyPhysicalCard';
import PrimaryButton from '@components/buttons/PrimaryButton';
import ModalWrapper from '@components/modals/ModalWrapper';
import { useEntity } from '@contexts/EntityContext';
import useApi from '@hooks/useApi';
import useToast from '@hooks/useToast';
import { activatePhysicalCard } from '@lib/actions/companies';
import { supportPhone } from '@lib/constants/SiteVariables';

export default function PhysicalCardActivationModal({ isModalActive, toggleModal }) {
  const api = useApi();
  const { fetchEntity } = useEntity();
  const [lastFour, setLastFour] = useState('');
  const [loading, setLoading] = useState(false);
  const { makeToast } = useToast();
  const pcProps = useCompanyPhysicalCard();
  const { refetchPhysicalCard } = pcProps;

  const handleActivate = async () => {
    setLoading(true);
    try {
      await activatePhysicalCard(
        api,
        pcProps.physicalCard.external_company_id,
        pcProps.physicalCard.id,
        lastFour,
      );
      refetchPhysicalCard();
      fetchEntity({ company_id: pcProps.physicalCard.external_company_id });
      makeToast('Physical card activated successfully', 'success');
      toggleModal();
    } catch (e) {
      makeToast('Activation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWrapper
      toggleModal={toggleModal}
      isModalActive={isModalActive}
      header="Activate Card"
      headerIcon={faCreditCard}
    >
      <div className="space-y-2">
        <p>
          To activate your physical card, please enter the last 4 numbers on the front of your
          physical card
        </p>
        <input
          type="text"
          maxLength={4}
          value={lastFour}
          onChange={(e) => setLastFour(e.target.value.replace(/\D/, ''))}
          className="w-full border rounded px-3 py-2 my-4"
          placeholder="Enter last 4 numbers of your card"
        />
        <p className="font-semibold ">Need assistance? We're happy to help.</p>
        <p className="text-sm text-gray-600 ">
          Support available Monday - Friday from 9AM - 1PM & 2PM - 6PM CT
        </p>
        <p className="text-sm text-gray-600 ">
          When purchasing in-person, you may be asked for a PIN. Call +1 (833) 425-5888 to set your
          pin.
        </p>
        <div className="space-y-1">
          <a
            href={`tel:${supportPhone}`}
            className="flex items-center gap-2 no-underline text-primary-blue hover:text-primary-blue/80 cursor-pointer font-medium"
          >
            <FontAwesomeIcon icon={faPhone} className="text-sm" />
            Call:{supportPhone}
          </a>

          <a
            href="mailto:support@creditkey.com"
            className="flex items-center gap-2 text-primary-blue hover:text-primary-blue/80 font-medium text-base"
          >
            <FontAwesomeIcon icon={faEnvelope} className="text-sm" />
            Email: support@creditkey.com
          </a>
        </div>
        <PrimaryButton
          ariaLabel="save-default-terms-button"
          buttonText="Activate"
          buttonColor="bg-primary-blue"
          hoverClass="hover:bg-primary-blue-hover"
          disabled={loading || lastFour.length !== 4}
          isLoading={loading}
          onClick={handleActivate}
        />
      </div>
    </ModalWrapper>
  );
}
