import React, { useState } from 'react';

import OutlineButton from '@components/buttons/OutlineButton';
import PrimaryButton from '@components/buttons/PrimaryButton';
import { useEntity } from '@contexts/EntityContext';
import { useUser } from '@contexts/UserContext';
import { CardType } from '@lib/constants/Enums';
import { captureEvent } from '@lib/posthog';
import FullStory from '@lib/utils/fullstory';
import CardholderAgreement from './CardholderAgreement';

interface CardholderAgreementModalProps {
  next: () => void;
  goTo: (step: string) => void;
  toggleModal: () => void;
  cardType: (typeof CardType)[keyof typeof CardType];
}

export default function CardholderAgreementModal({
  next,
  goTo,
  toggleModal,
  cardType,
}: CardholderAgreementModalProps) {
  const [agree, setAgree] = useState(false);
  const { entity } = useEntity();
  const { user } = useUser();

  const handleAgree = () => {
    const fullstory = new FullStory();
    fullstory.acceptCardholderAgreementEvent(user?.id, entity?.id);
    captureEvent('accepted_cardholder_agreement', {
      user_id: user?.id,
      company_id: entity?.id,
      name: user?.full_name,
      card_type: cardType,
    });

    if (entity.is_bank_connected) {
      goTo('set_default_terms');
    } else {
      next();
    }
  };

  return (
    <div role={CardholderAgreementModal.role}>
      <section>
        <div className="my-2 space-y-4">
          <CardholderAgreement />
        </div>
        <div className="mt-4">
          <label>
            <input type="checkbox" checked={agree} onChange={() => setAgree(!agree)} />
            <span className="text-base text-primary-blue-hover ml-2">
              I have read and agree to the terms and conditions
            </span>
          </label>
        </div>
        <div className="content flex justify-end mt-8">
          <OutlineButton
            ariaLabel="do-not-agree-to-cardholder-agreement-button"
            buttonText="Cancel"
            buttonColor="bg-white"
            hoverClass="hover:bg-gray-300"
            containerClass="w-max mr-2"
            onClick={toggleModal}
          />
          <PrimaryButton
            ariaLabel="agree-to-cardholder-agreement-button"
            buttonText="Agree"
            buttonColor="bg-primary-blue"
            hoverClass="hover:bg-primary-blue-hover"
            containerClass="w-max"
            onClick={handleAgree}
            disabled={!agree}
          />
        </div>
      </section>
    </div>
  );
}

CardholderAgreementModal.role = 'cardholder-agreement-modal-component';
