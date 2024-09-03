import React, { useState } from 'react';

import PrimaryButton from '@components/buttons/PrimaryButton';
import { useBorrowerDeps } from '@contexts';
import useApi from '@hooks/useApi';
import useToast from '@hooks/useToast';
import useUser from '@hooks/useUser';
import { createPaymentMethodPi4Card } from '@lib/actions/payment_methods';
import AcceptBlueHostedForm from './AcceptBlueHostedForm';
import CreditCardValidationMessages from './CreditCardValidationMessages';

function CreditCardForm({ toggleModal }) {
  const api = useApi();
  const { user } = useUser();
  const [cardForm, setCardForm] = useState(undefined);
  const [cardErrors, setCardErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [formInteractedWith, setFormInteractedWith] = useState(false);
  const { makeToast } = useToast();
  const { refetchPaymentMethods } = useBorrowerDeps();

  const onContinue = async () => {
    setSubmitting(true);
    const processor_data = await cardForm.getNonceToken();

    createPaymentMethodPi4Card(api, {
      processor_data,
      user_id: user.id,
    })
      .then(() => {
        refetchPaymentMethods();
        makeToast('Payment Method Successfully Created', 'success');
        toggleModal();
      })
      .catch((err) => {
        // Error from API
        if (err.json) {
          err.json().then((data) => setCardErrors(data.error));
        }

        // Error from hosted form
        if (err.message) setCardErrors(err.message);
        setSubmitting(false);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div role={CreditCardForm.role} className="mt-5">
      <AcceptBlueHostedForm
        setFormInteractedWith={setFormInteractedWith}
        setCardForm={setCardForm}
        cardForm={cardForm}
        setCardErrors={setCardErrors}
      />
      {cardErrors.length > 0 && (
        <CreditCardValidationMessages cardErrors={cardErrors} />
      )}
      <PrimaryButton
        ariaLabel="save-payment-method-button"
        buttonText="Save Payment Method"
        buttonColor="bg-primary-blue"
        hoverClass="hover:bg-primary-blue-hover"
        onClick={onContinue}
        isLoading={submitting}
        disabled={
          cardErrors.length > 0 || formInteractedWith === false || submitting
        }
      />
    </div>
  );
}

CreditCardForm.role = 'credit-card-form-component';

export default CreditCardForm;
