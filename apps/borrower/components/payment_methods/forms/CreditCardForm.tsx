import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import AcceptBlueHostedForm from '../../third_party/accept_blue_hosted_form';
import CreditCardValidationMessages from './CreditCardValidationMessages';
import CTAButton from '../../shared/CTAButton';
import useCurrentUser from '../../../hooks/useCurrentUser';
import useToast from '../../../hooks/useToast';
import { asyncActions, loading } from '../../../store/actions/general';
import {
  createPaymentMethodPi4Card,
  getPaymentMethods,
} from '../../../store/actions/payment_methods';

function CreditCardForm({ toggleModal }) {
  const dispatch = useDispatch();
  const [user] = useCurrentUser();
  const [cardForm, setCardForm] = useState(undefined);
  const [cardErrors, setCardErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [formInteractedWith, setFormInteractedWith] = useState(false);
  const { makeToast } = useToast();

  const onContinue = async () => {
    const encodedEmail = encodeURIComponent(user.email);

    try {
      setSubmitting(true);
      const processor_data = await cardForm.getNonceToken();

      dispatch(
        asyncActions(
          createPaymentMethodPi4Card(
            {
              processor_data,
              user_id: user.id,
            },
            'card',
          ),
          getPaymentMethods(`filter[email]=${encodedEmail}`),
        ),
      )
        .then(() => {
          makeToast(
            'New Payment Method Added!',
            'positive-green',
            'check-circle',
          );
          toggleModal();
        })
        .finally(() => {
          setSubmitting(false);
        });
    } catch (err) {
      // Error from API
      if (err.json) {
        err.json().then((data) => setCardErrors(data.error));
      }

      // Error from hosted form
      if (err.message) setCardErrors(err.message);
      dispatch(loading(false));
    }
  };

  return (
    <div role={CreditCardForm.role} className='mt-5'>
      <AcceptBlueHostedForm
        setFormInteractedWith={setFormInteractedWith}
        setCardForm={setCardForm}
        cardForm={cardForm}
        setCardErrors={setCardErrors}
      />
      {cardErrors.length > 0 && (
        <CreditCardValidationMessages cardErrors={cardErrors} />
      )}
      <CTAButton
        ariaLabel="save-payment-method"
        buttonClass="px-24 bg-primary-blue text-white"
        buttonText="Save Payment Method"
        containerClass="mb-8 flex justify-center"
        disabled={cardErrors.length > 0 || formInteractedWith === false || submitting}
        icon={['far', 'lock']}
        onClick={onContinue}
        isLoading={submitting}
      />
    </div>
  );
}

CreditCardForm.role = 'credit-card-form-component';

export default CreditCardForm;
