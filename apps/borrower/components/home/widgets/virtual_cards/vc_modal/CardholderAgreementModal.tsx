import React from 'react';
import PrimaryButton from '@components/buttons/PrimaryButton';
import CardholderAgreement from './CardholderAgreement';

export default function CardholderAgreementModal({ next }) {
  return (
    <div role={CardholderAgreementModal.role}>
      <section>
        <div className="my-2 space-y-4">
          <CardholderAgreement />
        </div>
        <div className="content flex flex-col gap-2 items-center mt-8">
          <PrimaryButton
            ariaLabel="agree-to-cardholder-agreement-button"
            buttonText="I Agree"
            buttonColor="bg-primary-blue"
            hoverClass="hover:bg-primary-blue-hover"
            onClick={next}
          />
        </div>
      </section>
    </div>
  );
}

CardholderAgreementModal.role = 'cardholder-agreement-modal-component';

