import React, { useCallback, useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';

import PrimaryButton from '@components/buttons/PrimaryButton';
import { useBorrowerDeps } from '@contexts/BorrowerContext';
import { useUser } from '@contexts/UserContext';
import useApi from '@hooks/useApi';
import usePlaid from '@hooks/usePlaid';
import useToast from '@hooks/useToast';
import { createPaymentMethodBank } from '@lib/actions/payment_methods';
import PaymentMethodRecord from '@lib/records/payment_method';

export default function Plaid({
  hasAlert,
  next,
  setHasAlert,
  toggleModal,
  setUsePlaid,
  createVcFlow = false,
}) {
  const [loading, setLoading] = useState(false);
  const { refetchPaymentMethods } = useBorrowerDeps();
  const { user } = useUser();
  const { makeToast } = useToast();
  const api = useApi();
  const { fetchLinkToken, linkToken, resetLinkFlow, accessToken, exchangePublicToken } =
    usePlaid(user);

  const onSuccess = useCallback(async (publicToken) => {
    exchangePublicToken(publicToken);
  }, []);

  const onExit = useCallback(async (err) => {
    console.log(err);
  }, []);

  const linkConfig = {
    token: linkToken,
    onSuccess,
    onExit,
  };

  const createPaymentMethod = async () => {
    setLoading(true);
    createPaymentMethodBank(api, new PaymentMethodRecord({ user_id: user.id }), true)
      .then(() => {
        refetchPaymentMethods();
        makeToast('Payment Method Successfully Created', 'success');
        resetLinkFlow();

        if (createVcFlow) {
          next();
        } else {
          toggleModal();
        }
      })
      .catch((err) => {
        console.error('SAD', err?.response?.data?.error);

        // TODO: show a thing when these happen; today we have <ErrorAlert />
        const generic_fail = err?.response?.data?.error?.includes('invalid_bank');
        const plaid_fail = err?.response?.data?.error?.includes('invalid_plaid');

        //setHasAlert(true);
        makeToast('An error occurred. Please try again or contact our support team.', 'error');
        resetLinkFlow();
        toggleModal();
      })
      .finally(() => setLoading(false));
  };

  const { open, ready } = usePlaidLink(linkConfig);

  useEffect(() => {
    fetchLinkToken();

    return () => resetLinkFlow();
  }, []);

  useEffect(() => {
    if (accessToken) {
      createPaymentMethod();
    }
  }, [accessToken]);

  return (
    <>
      <div>
        <p className="mt-5">
          Credit Key uses Plaid in order for you to securely share banking details with us.
        </p>
        <p className="mt-5">
          <b>Trusted and Secure</b> Plaid secures your information with bank-level 256-bit
          encryption. Credit Key never stores your credentials.
        </p>

        <PrimaryButton
          buttonText="Connect a bank account"
          buttonColor="bg-primary-blue"
          hoverClass="hover:bg-primary-blue-hover"
          onClick={() => open()}
          disabled={!ready || loading}
          isLoading={loading}
        />
      </div>

      <p className="mt-8">
        Unable to link your bank via Plaid? Try{' '}
        <button className="underline text-primary-blue" onClick={() => setUsePlaid(false)}>
          adding it manually
        </button>
      </p>
    </>
  );
}

Plaid.role = 'plaid-page';
