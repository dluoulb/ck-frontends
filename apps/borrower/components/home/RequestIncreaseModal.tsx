import React, { useEffect, useRef, useState } from 'react';

import ModalWrapper from '@components/modals/ModalWrapper';
import useApi from '@hooks/useApi';
import { createLimitIncreaseRequest } from '@lib/actions/companies';
import { formatCurrency } from '@lib/utils/formatters';

interface RequestIncreaseModalProps {
  companyId?: string;
  currentCreditLimit: number;
  isModalActive: boolean;
  toggleModal: () => void;
}

const isValidRequestedAmount = (value: string) => {
  const requestedAmount = Number(value.trim());

  return value.trim() !== '' && Number.isFinite(requestedAmount) && requestedAmount > 0;
};

export default function RequestIncreaseModal({
  companyId,
  currentCreditLimit,
  isModalActive,
  toggleModal,
}: RequestIncreaseModalProps) {
  const api = useApi();
  const [requestedAmount, setRequestedAmount] = useState('');
  const [comments, setComments] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const submitAttemptRef = useRef(0);

  useEffect(() => {
    if (!isModalActive) {
      submitAttemptRef.current += 1;
      setRequestedAmount('');
      setComments('');
      setStatus('idle');
    }
  }, [isModalActive]);

  if (!isModalActive) return null;

  const canContinue =
    Boolean(companyId) && isValidRequestedAmount(requestedAmount) && status !== 'submitting';
  const handleContinue = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canContinue || !companyId) return;

    const submitAttempt = submitAttemptRef.current + 1;
    submitAttemptRef.current = submitAttempt;

    try {
      setStatus('submitting');
      await createLimitIncreaseRequest(api, companyId, Number(requestedAmount.trim()), comments);
      if (submitAttemptRef.current !== submitAttempt) return;
      setStatus('success');
    } catch (_error) {
      if (submitAttemptRef.current !== submitAttempt) return;
      setStatus('error');
    }
  };

  return (
    <ModalWrapper
      isModalActive={isModalActive}
      toggleModal={toggleModal}
      disableDismiss={status === 'submitting'}
      modalWidth="w-full sm:max-w-[448px]"
      contentClassName="px-0 py-1"
    >
      {status === 'success' ? (
        <div className="py-4 space-y-4">
          <div>
            <p className="text-lg font-semibold text-primary-blue-hover">Request submitted</p>
            <p className="mt-2 text-sm text-secondary-gray">
              We will review your request and follow up soon.
            </p>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={toggleModal}
              className="rounded-md bg-primary-blue px-4 py-2 text-sm font-semibold text-white"
            >
              Close
            </button>
          </div>
        </div>
      ) : (
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
                if (status === 'error') setStatus('idle');
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
                if (status === 'error') setStatus('idle');
              }}
              rows={3}
              className="h-14 w-full rounded border border-primary-gray-border px-3 py-2 text-sm text-primary"
            />
          </div>

          {status === 'error' && (
            <p role="alert" className="text-sm text-error">
              We couldn&apos;t submit your request. Please try again.
            </p>
          )}

          <div>
            <button
              type="submit"
              disabled={!canContinue}
              className="h-9 w-full rounded-md bg-primary-blue px-4 text-base font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === 'submitting' ? 'Submitting...' : 'Continue'}
            </button>
          </div>
        </form>
      )}
    </ModalWrapper>
  );
}
