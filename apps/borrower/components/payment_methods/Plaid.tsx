import React, { useCallback, useEffect, useRef, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';

import PrimaryButton from '@components/buttons/PrimaryButton';
import { useBorrowerDeps } from '@contexts/BorrowerContext';
import { useEntity } from '@contexts/EntityContext';
import { useUser } from '@contexts/UserContext';
import useApi from '@hooks/useApi';
import usePlaid from '@hooks/usePlaid';
import useToast from '@hooks/useToast';
import { createPaymentMethodBank } from '@lib/actions/payment_methods';
import PaymentMethodRecord from '@lib/records/payment_method';

interface PlaidProps {
  hasAlert?: boolean;
  next?: () => void;
  setHasAlert?: (value: boolean) => void;
  toggleModal?: () => void;
  setUsePlaid?: React.Dispatch<React.SetStateAction<boolean>>;
  createVcFlow?: boolean;
  onPaymentMethodCreated?: (paymentMethod?: PaymentMethodRecord | null) => void;
  autoOpen?: boolean;
}

export default function Plaid({
  hasAlert: _hasAlert,
  next,
  setHasAlert: _setHasAlert,
  toggleModal,
  setUsePlaid,
  createVcFlow = false,
  onPaymentMethodCreated,
  autoOpen = false,
}: PlaidProps) {
  const [loading, setLoading] = useState(false);
  const { refetchPaymentMethods } = useBorrowerDeps();
  const { entity, fetchEntity } = useEntity();
  const { user } = useUser();
  const { makeToast } = useToast();
  const api = useApi();
  const { fetchLinkToken, linkToken, resetLinkFlow, accessToken, exchangePublicToken } =
    usePlaid(user);
  const handledAccessTokenRef = useRef(false);
  const fetchLinkTokenRef = useRef(fetchLinkToken);
  const resetLinkFlowRef = useRef(resetLinkFlow);
  const autoOpenedRef = useRef(false);

  useEffect(() => {
    fetchLinkTokenRef.current = fetchLinkToken;
  }, [fetchLinkToken]);

  useEffect(() => {
    resetLinkFlowRef.current = resetLinkFlow;
  }, [resetLinkFlow]);

  const onSuccess = useCallback(
    (publicToken) => {
      exchangePublicToken(publicToken);
    },
    [exchangePublicToken],
  );

  const onExit = useCallback((err) => {
    console.log(err);
  }, []);

  const linkConfig = {
    token: linkToken,
    onSuccess,
    onExit,
  };

  const createPaymentMethod = useCallback(() => {
    setLoading(true);
    createPaymentMethodBank(api, new PaymentMethodRecord({ user_id: user?.id }), true)
      .then(async (createdPaymentMethod) => {
        const [paymentMethodsResult] = await Promise.all([
          refetchPaymentMethods(),
          Promise.resolve(fetchEntity()),
        ]);
        const refreshedPaymentMethods = paymentMethodsResult?.data ?? [];
        const connectedPaymentMethod =
          refreshedPaymentMethods.find(
            (paymentMethod) => paymentMethod.id === createdPaymentMethod?.id,
          ) ??
          refreshedPaymentMethods.find(
            (paymentMethod) =>
              paymentMethod.payment_type === 'bank_account' && paymentMethod.is_default,
          ) ??
          createdPaymentMethod ??
          null;

        if (onPaymentMethodCreated) {
          onPaymentMethodCreated(connectedPaymentMethod);
        }

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
        makeToast('An error occurred. Please try again or contact our support team.', 'error');
        resetLinkFlow();
        toggleModal();
      })
      .finally(() => setLoading(false));
  }, [
    api,
    createVcFlow,
    fetchEntity,
    makeToast,
    next,
    onPaymentMethodCreated,
    refetchPaymentMethods,
    resetLinkFlow,
    toggleModal,
    user,
  ]);

  const { open, ready } = usePlaidLink(linkConfig);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    handledAccessTokenRef.current = false;
    fetchLinkTokenRef.current();

    return () => resetLinkFlowRef.current();
  }, [user?.id]);

  useEffect(() => {
    if (!accessToken || handledAccessTokenRef.current) {
      return;
    }

    handledAccessTokenRef.current = true;

    const timeoutId = window.setTimeout(() => {
      createPaymentMethod();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [accessToken, createPaymentMethod]);

  useEffect(() => {
    if (!autoOpen || !ready || !linkToken || autoOpenedRef.current) {
      return;
    }

    autoOpenedRef.current = true;
    open();
  }, [autoOpen, linkToken, open, ready]);

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

      {(entity?.bank_verification_attempts || 0) < 2 && (
        <p className="mt-8">
          Unable to link your bank via Plaid? Try{' '}
          <button className="underline text-primary-blue" onClick={() => setUsePlaid(false)}>
            adding it manually
          </button>
        </p>
      )}
    </>
  );
}

Plaid.role = 'plaid-page';
