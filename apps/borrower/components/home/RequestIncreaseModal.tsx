import React, { useEffect, useState } from 'react';
import { faChevronRight } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import Image from 'next/image';

import BankForm from '@apps/borrower/components/payment_methods/forms/BankForm';
import Plaid from '@apps/borrower/components/payment_methods/Plaid';
import ModalWrapper from '@components/modals/ModalWrapper';
import useApi from '@hooks/useApi';
import useToast from '@hooks/useToast';
import { createLimitIncreaseRequest } from '@lib/actions/companies';
import shieldCheck from '@lib/images/shield-check.svg';
import { formatCurrency } from '@lib/utils/formatters';

interface RequestIncreaseModalProps {
  companyId?: string;
  currentCreditLimit: number;
  hasConnectedPlaidAccount: boolean;
  isModalActive: boolean;
  toggleModal: () => void;
}

type RequestIncreaseStep =
  | 'request-details'
  | 'connected-bank'
  | 'verification-method'
  | 'plaid-verification'
  | 'manual-verification';
type VerificationMethod = 'plaid' | 'manual' | null;

const verificationMethodOptions = [
  {
    method: 'plaid' as const,
    title: 'Instant Bank Verification',
    description: 'Securely connect via Plaid instantly',
    recommended: true,
  },
  {
    method: 'manual' as const,
    title: 'Upload bank statements',
    description: 'Manually upload. Takes up to 3 business days to get a decision.',
    recommended: false,
  },
];

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
  const api = useApi();
  const { makeToast } = useToast();
  const [requestedAmount, setRequestedAmount] = useState('');
  const [comments, setComments] = useState('');
  const [step, setStep] = useState<RequestIncreaseStep>('request-details');
  const [verificationMethod, setVerificationMethod] = useState<VerificationMethod>(null);
  const [focusedVerificationMethod, setFocusedVerificationMethod] =
    useState<VerificationMethod>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasManualVerificationAlert, setHasManualVerificationAlert] = useState(false);

  useEffect(() => {
    if (!isModalActive) {
      setRequestedAmount('');
      setComments('');
      setStep('request-details');
      setVerificationMethod(null);
      setFocusedVerificationMethod(null);
      setHasManualVerificationAlert(false);
    }
  }, [isModalActive]);

  if (!isModalActive) return null;

  const canContinue = Boolean(companyId) && isValidRequestedAmount(requestedAmount);
  const parsedRequestedAmount = Number(requestedAmount.trim());
  const showVerificationMethodStep = () => {
    setVerificationMethod((current) => current ?? 'plaid');
    setStep('verification-method');
  };
  const handleUsePlaidChange = (usePlaid: boolean) => {
    setHasManualVerificationAlert(false);
    setStep(usePlaid ? 'plaid-verification' : 'manual-verification');
  };
  const submitRequest = async () => {
    if (!companyId || !Number.isFinite(parsedRequestedAmount) || parsedRequestedAmount <= 0) return;

    setIsSubmitting(true);

    try {
      await createLimitIncreaseRequest(api, companyId, parsedRequestedAmount, comments);
      makeToast('Credit limit increase request submitted successfully.', 'success');
      toggleModal();
    } catch (_error) {
      makeToast('An error occurred. Please try again or contact our support team.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleVerificationContinue = () => {
    if (verificationMethod === 'plaid') {
      handleUsePlaidChange(true);
      return;
    }

    if (verificationMethod === 'manual') {
      handleUsePlaidChange(false);
    }
  };
  const getVerificationOptionClassName = (method: Exclude<VerificationMethod, null>) => {
    const isSelected = verificationMethod === method;
    const isFocused = focusedVerificationMethod === method;

    return classNames(
      'flex w-full items-center gap-[14px] rounded-md border px-5 py-5 text-left transition',
      isSelected ? 'border-[#C4DBFC] bg-[#F0F6FE]' : 'border-[#D9D9D9] bg-white',
      isFocused && 'ring-2 ring-primary-blue ring-offset-2',
    );
  };
  const handleContinue = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canContinue || !companyId) return;

    if (hasConnectedPlaidAccount) {
      setStep('connected-bank');
      return;
    }

    showVerificationMethodStep();
  };

  return (
    <ModalWrapper
      isModalActive={isModalActive}
      toggleModal={toggleModal}
      modalWidth="w-full sm:max-w-[473px]"
      contentClassName="px-1 py-1"
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
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={submitRequest}
              disabled={isSubmitting}
              className="h-9 rounded-md bg-primary-blue px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue with connected bank
            </button>
            <button
              type="button"
              onClick={showVerificationMethodStep}
              className="text-sm font-semibold text-primary-blue hover:underline"
            >
              Change connected bank
            </button>
          </div>
        </div>
      )}

      {step === 'verification-method' && (
        <div className="space-y-[14px]">
          <div className="space-y-[14px]">
            <h2 className="text-[22px] font-semibold leading-[28.6px] text-primary">
              Bank Statement Verification
            </h2>
            <p className="text-sm leading-[18.2px] text-primary">
              In order to complete your credit limit increase request, we need to verify some
              financial information with you.
            </p>
          </div>
          <fieldset className="m-0 min-w-0 border-0 p-0">
            <legend className="sr-only">Verification method</legend>
            <div className="space-y-[14px]">
              {verificationMethodOptions.map((option) => (
                <label key={option.method} className="block cursor-pointer">
                  <input
                    type="radio"
                    name="verification-method"
                    value={option.method}
                    checked={verificationMethod === option.method}
                    onChange={() => setVerificationMethod(option.method)}
                    onFocus={() => setFocusedVerificationMethod(option.method)}
                    onBlur={() => setFocusedVerificationMethod(null)}
                    className="sr-only"
                  />
                  <span className={getVerificationOptionClassName(option.method)}>
                    <span className="min-w-0 flex-1 space-y-[14px]">
                      <span className="flex w-full items-center gap-[14px]">
                        <span className="text-base font-semibold leading-5 text-primary">
                          {option.title}
                        </span>
                        {option.recommended && (
                          <span className="ml-auto rounded-full bg-[#D7E6FC] px-2.5 py-1 text-[15px] font-semibold leading-[18px] text-primary-blue">
                            Recommended
                          </span>
                        )}
                      </span>
                      <span className="block text-sm font-normal leading-[18.2px] text-primary">
                        {option.description}
                      </span>
                    </span>
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="shrink-0 text-[22px] text-primary"
                    />
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className="flex items-center gap-[14px] bg-[#FAFAFA] px-[10px] py-[10px]">
            <Image src={shieldCheck} alt="" width={24} height={24} aria-hidden />
            <p className="text-xs leading-[15.6px] text-[#8A94A3]">
              Your bank credentials are encrypted and never stored by Credit Key. We use bank-level
              security to protect your information.
            </p>
          </div>
          <div>
            <button
              type="button"
              disabled={!verificationMethod}
              onClick={handleVerificationContinue}
              className="h-[38px] w-full rounded-md bg-primary-blue px-[10px] text-[15px] font-bold leading-[18px] text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {step === 'plaid-verification' && (
        <Plaid
          createVcFlow
          next={() => {}}
          onPaymentMethodCreated={submitRequest}
          toggleModal={toggleModal}
          setUsePlaid={handleUsePlaidChange}
        />
      )}

      {step === 'manual-verification' && (
        <BankForm
          createVcFlow
          hasAlert={hasManualVerificationAlert}
          next={() => {}}
          onPaymentMethodCreated={submitRequest}
          setHasAlert={setHasManualVerificationAlert}
          submitButtonText="Verify and submit request"
          toggleModal={toggleModal}
        />
      )}
    </ModalWrapper>
  );
}
