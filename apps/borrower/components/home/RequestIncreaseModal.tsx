import React, { useEffect, useState } from 'react';

import ModalWrapper from '@components/modals/ModalWrapper';
import { formatCurrency } from '@lib/utils/formatters';

interface RequestIncreaseModalProps {
  companyId?: string;
  currentCreditLimit: number;
  hasConnectedPlaidAccount: boolean;
  isModalActive: boolean;
  toggleModal: () => void;
}

type RequestIncreaseStep = 'request-details' | 'connected-bank' | 'verification-method';
type VerificationMethod = 'plaid' | 'manual' | null;

const isValidRequestedAmount = (value: string) => {
  const requestedAmount = Number(value.trim());

  return value.trim() !== '' && Number.isFinite(requestedAmount) && requestedAmount > 0;
};

export default function RequestIncreaseModal({
  companyId,
  currentCreditLimit,
  hasConnectedPlaidAccount,
  isModalActive,
  toggleModal,
}: RequestIncreaseModalProps) {
  const [requestedAmount, setRequestedAmount] = useState('');
  const [comments, setComments] = useState('');
  const [step, setStep] = useState<RequestIncreaseStep>('request-details');
  const [verificationMethod, setVerificationMethod] = useState<VerificationMethod>(null);
  const [focusedVerificationMethod, setFocusedVerificationMethod] =
    useState<VerificationMethod>(null);

  useEffect(() => {
    if (!isModalActive) {
      setRequestedAmount('');
      setComments('');
      setStep('request-details');
      setVerificationMethod(null);
      setFocusedVerificationMethod(null);
    }
  }, [isModalActive]);

  if (!isModalActive) return null;

  const canContinue = Boolean(companyId) && isValidRequestedAmount(requestedAmount);
  const getVerificationOptionClassName = (method: Exclude<VerificationMethod, null>) => {
    const isSelected = verificationMethod === method;
    const isFocused = focusedVerificationMethod === method;

    return [
      'block w-full rounded-md border px-4 py-3 text-left text-sm font-semibold text-primary transition',
      isSelected ? 'border-primary-blue bg-primary-blue/5' : 'border-primary-gray-border',
      isFocused ? 'ring-2 ring-primary-blue ring-offset-2' : '',
    ].join(' ');
  };
  const handleContinue = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canContinue || !companyId) return;

    setStep(hasConnectedPlaidAccount ? 'connected-bank' : 'verification-method');
  };

  return (
    <ModalWrapper
      isModalActive={isModalActive}
      toggleModal={toggleModal}
      modalWidth="w-full sm:max-w-[448px]"
      contentClassName="px-0 py-1"
    >
      {step === 'request-details' && (
        <form className="space-y-2" onSubmit={handleContinue}>
          <h2 className="text-xl font-bold leading-7 text-primary">Request Credit Line Increase</h2>
          <p className="text-sm text-primary">
            See if you qualify for a larger credit line in just a few minutes.
          </p>
          <div>
            <p className="text-sm text-primary">Current Credit Limit</p>
            <p className="text-lg font-semibold leading-6 text-primary">
              {formatCurrency(currentCreditLimit)}
            </p>
          </div>

          <div className="space-y-1">
            <label htmlFor="request-increase-requested-amount" className="text-sm text-primary">
              What is the additional amount you are requesting?
            </label>
            <input
              id="request-increase-requested-amount"
              name="requested_amount"
              type="text"
              inputMode="decimal"
              placeholder="$"
              value={requestedAmount}
              onChange={(event) => {
                setRequestedAmount(event.target.value);
              }}
              className="h-9 w-full rounded border border-primary-gray-border px-3 text-sm text-primary placeholder:text-tertiary-gray"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="request-increase-comments" className="text-sm text-primary">
              Comments
            </label>
            <textarea
              id="request-increase-comments"
              name="comments"
              value={comments}
              onChange={(event) => {
                setComments(event.target.value);
              }}
              rows={3}
              className="h-14 w-full rounded border border-primary-gray-border px-3 py-2 text-sm text-primary"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={!canContinue}
              className="h-9 w-full rounded-md bg-primary-blue px-4 text-base font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        </form>
      )}

      {step === 'connected-bank' && (
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <h2 className="text-xl font-bold leading-7 text-primary">Review Increase Request</h2>
            <p className="text-sm text-primary">
              You already have a bank account connected. You can keep using it for this request or
              switch to a different verification method.
            </p>
          </div>
          <div className="rounded-md border border-primary-gray-border p-3">
            <p className="text-sm font-semibold text-primary">Increase request preview</p>
            <p className="mt-1 text-sm text-secondary-gray">
              Requested amount: {formatCurrency(Number(requestedAmount.trim() || '0'))}
            </p>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setStep('verification-method')}
              className="text-sm font-semibold text-primary-blue hover:underline"
            >
              Change connected bank
            </button>
          </div>
        </div>
      )}

      {step === 'verification-method' && (
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <h2 className="text-xl font-bold leading-7 text-primary">Verify your bank account</h2>
            <p className="text-sm text-primary">
              Choose how you want to verify your bank account before continuing your credit line
              increase request.
            </p>
          </div>
          <div role="radiogroup" aria-label="Verification method" className="space-y-3">
            <label className="block cursor-pointer">
              <input
                type="radio"
                name="verification-method"
                value="plaid"
                checked={verificationMethod === 'plaid'}
                onChange={() => setVerificationMethod('plaid')}
                onFocus={() => setFocusedVerificationMethod('plaid')}
                onBlur={() => setFocusedVerificationMethod(null)}
                className="sr-only"
              />
              <span className={getVerificationOptionClassName('plaid')}>
                Connect bank account with Plaid
              </span>
            </label>
            <label className="block cursor-pointer">
              <input
                type="radio"
                name="verification-method"
                value="manual"
                checked={verificationMethod === 'manual'}
                onChange={() => setVerificationMethod('manual')}
                onFocus={() => setFocusedVerificationMethod('manual')}
                onBlur={() => setFocusedVerificationMethod(null)}
                className="sr-only"
              />
              <span className={getVerificationOptionClassName('manual')}>
                Upload bank statements manually
              </span>
            </label>
          </div>
        </div>
      )}
    </ModalWrapper>
  );
}
