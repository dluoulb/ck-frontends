import React, { useEffect, useRef, useState } from 'react';
import { faArrowLeft, faArrowUpFromBracket, faFile } from '@fortawesome/pro-regular-svg-icons';
import { faChevronRight } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import Image from 'next/image';

import Plaid from '@apps/borrower/components/payment_methods/Plaid';
import ModalWrapper from '@components/modals/ModalWrapper';
import useApi from '@hooks/useApi';
import useToast from '@hooks/useToast';
import { createLimitIncreaseRequest, uploadCompanyDocument } from '@lib/actions/companies';
import shieldCheck from '@lib/images/shield-check.svg';
import PaymentMethodRecord from '@lib/records/payment_method';
import { formatCurrency } from '@lib/utils/formatters';

interface RequestIncreaseModalProps {
  companyId?: string;
  currentCreditLimit: number;
  hasConnectedPlaidAccount: boolean;
  connectedBank?: PaymentMethodRecord | null;
  isModalActive: boolean;
  toggleModal: () => void;
}

const formatConnectedBankLabel = (paymentMethod: PaymentMethodRecord | null | undefined) => {
  if (!paymentMethod) return null;

  const name = paymentMethod.bank_name || paymentMethod.label;
  const lastFour = paymentMethod.bank_account ? paymentMethod.payment_method_last_4 : '';

  return lastFour ? `${name} ••••${lastFour}` : name;
};

type RequestIncreaseStep =
  | 'request-details'
  | 'connected-bank'
  | 'verification-method'
  | 'plaid-verification'
  | 'manual-verification'
  | 'review'
  | 'confirmation';
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
const emptyManualStatementFiles = (): (File | null)[] => [null, null, null];
const emptyManualStatementFileErrors = (): string[] => ['', '', ''];
const manualBankStatementAcceptedExtensions = [
  '.pdf',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
  '.jpg',
  '.jpeg',
  '.png',
];
const manualBankStatementAcceptedFileTypes = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
]);
const manualBankStatementAcceptedExtensionSet = new Set(manualBankStatementAcceptedExtensions);
const manualBankStatementAcceptAttribute = manualBankStatementAcceptedExtensions.join(',');
const manualBankStatementMaxSizeBytes = 10 * 1024 * 1024;
const invalidManualBankStatementTypeMessage =
  'Invalid file type. Please upload a PDF, Word doc, Excel sheet, JPG, or PNG.';
const oversizedManualBankStatementMessage =
  'File is too large. Please upload a file smaller than 10MB.';
const manualBankStatementUploadErrorMessage = 'Unable to upload one or more bank statements.';

const getFileExtension = (fileName: string) => {
  const extensionIndex = fileName.lastIndexOf('.');

  return extensionIndex === -1 ? '' : fileName.slice(extensionIndex).toLowerCase();
};

const isAcceptedManualBankStatementFile = (file: File) => {
  const hasAcceptedExtension = manualBankStatementAcceptedExtensionSet.has(
    getFileExtension(file.name),
  );
  const hasAcceptedType = file.type === '' || manualBankStatementAcceptedFileTypes.has(file.type);

  return hasAcceptedExtension && hasAcceptedType;
};

export default function RequestIncreaseModal({
  companyId,
  currentCreditLimit,
  hasConnectedPlaidAccount,
  connectedBank,
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
  const [manualStatementFiles, setManualStatementFiles] =
    useState<(File | null)[]>(emptyManualStatementFiles);
  const [manualStatementFileErrors, setManualStatementFileErrors] = useState<string[]>(
    emptyManualStatementFileErrors,
  );
  const [manualDisclaimerAccepted, setManualDisclaimerAccepted] = useState(false);
  const [hasUploadedManualStatements, setHasUploadedManualStatements] = useState(false);
  const [connectedPaymentMethod, setConnectedPaymentMethod] = useState<PaymentMethodRecord | null>(
    null,
  );
  const [softCreditPullAccepted, setSoftCreditPullAccepted] = useState(false);
  const confirmationHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!isModalActive) {
      setRequestedAmount('');
      setComments('');
      setStep('request-details');
      setVerificationMethod(null);
      setFocusedVerificationMethod(null);
      setManualStatementFiles(emptyManualStatementFiles());
      setManualStatementFileErrors(emptyManualStatementFileErrors());
      setManualDisclaimerAccepted(false);
      setHasUploadedManualStatements(false);
      setConnectedPaymentMethod(null);
      setSoftCreditPullAccepted(false);
    }
  }, [isModalActive]);

  useEffect(() => {
    if (step === 'confirmation') {
      confirmationHeadingRef.current?.focus();
    }
  }, [step]);

  if (!isModalActive) return null;

  const canContinue = Boolean(companyId) && isValidRequestedAmount(requestedAmount);
  const parsedRequestedAmount = Number(requestedAmount.trim());
  const newCreditLimit = currentCreditLimit + parsedRequestedAmount;
  const showVerificationMethodStep = () => {
    setVerificationMethod((current) => current ?? 'plaid');
    setStep('verification-method');
  };
  const handleUsePlaidChange = (usePlaid: boolean) => {
    setVerificationMethod(usePlaid ? 'plaid' : 'manual');
    setStep(usePlaid ? 'plaid-verification' : 'manual-verification');
  };
  const selectedManualStatementFiles = manualStatementFiles.filter((file): file is File =>
    Boolean(file),
  );
  const canContinueToReview =
    Boolean(companyId) && selectedManualStatementFiles.length === 3 && manualDisclaimerAccepted;
  const showSubmissionConfirmation = () => {
    setStep('confirmation');
  };
  const handleManualStatementFileChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.currentTarget.files?.[0] ?? null;
    setHasUploadedManualStatements(false);

    if (file && file.size > manualBankStatementMaxSizeBytes) {
      event.currentTarget.value = '';
      setManualStatementFiles((currentFiles) =>
        currentFiles.map((currentFile, currentIndex) =>
          currentIndex === index ? null : currentFile,
        ),
      );
      setManualStatementFileErrors((currentErrors) =>
        currentErrors.map((currentError, currentIndex) =>
          currentIndex === index ? oversizedManualBankStatementMessage : currentError,
        ),
      );
      return;
    }

    if (file && !isAcceptedManualBankStatementFile(file)) {
      event.currentTarget.value = '';
      setManualStatementFiles((currentFiles) =>
        currentFiles.map((currentFile, currentIndex) =>
          currentIndex === index ? null : currentFile,
        ),
      );
      setManualStatementFileErrors((currentErrors) =>
        currentErrors.map((currentError, currentIndex) =>
          currentIndex === index ? invalidManualBankStatementTypeMessage : currentError,
        ),
      );
      return;
    }

    setManualStatementFiles((currentFiles) =>
      currentFiles.map((currentFile, currentIndex) =>
        currentIndex === index ? file : currentFile,
      ),
    );
    setManualStatementFileErrors((currentErrors) =>
      currentErrors.map((currentError, currentIndex) =>
        currentIndex === index ? '' : currentError,
      ),
    );
  };
  const submitRequest = async () => {
    if (!companyId || !Number.isFinite(parsedRequestedAmount) || parsedRequestedAmount <= 0) return;

    setIsSubmitting(true);

    try {
      await createLimitIncreaseRequest(api, companyId, parsedRequestedAmount, comments);
      showSubmissionConfirmation();
    } catch (_error) {
      makeToast('An error occurred. Please try again or contact our support team.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  const submitManualBankStatementRequest = async () => {
    if (
      !companyId ||
      !Number.isFinite(parsedRequestedAmount) ||
      parsedRequestedAmount <= 0 ||
      selectedManualStatementFiles.length !== 3 ||
      !manualDisclaimerAccepted
    ) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (!hasUploadedManualStatements) {
        const uploadResults = await Promise.allSettled(
          selectedManualStatementFiles.map((file, index) =>
            uploadCompanyDocument(
              api,
              companyId,
              file,
              'bank_statements',
              `Credit limit increase bank statement ${index + 1}`,
            ),
          ),
        );

        if (uploadResults.some((result) => result.status === 'rejected')) {
          throw new Error(manualBankStatementUploadErrorMessage);
        }

        setHasUploadedManualStatements(true);
      }

      await createLimitIncreaseRequest(api, companyId, parsedRequestedAmount, comments);
      showSubmissionConfirmation();
    } catch (error) {
      makeToast(
        error instanceof Error && error.message === manualBankStatementUploadErrorMessage
          ? error.message
          : 'An error occurred. Please try again or contact our support team.',
        'error',
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  const handlePlaidComplete = (paymentMethod?: PaymentMethodRecord | null) => {
    setConnectedPaymentMethod(paymentMethod ?? null);
    setStep('review');
  };
  const handleManualContinueToReview = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canContinueToReview) return;

    setStep('review');
  };
  const handleReviewSubmit = () => {
    if (verificationMethod === 'manual') {
      submitManualBankStatementRequest();
    } else {
      submitRequest();
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
  const handleVerificationMethodSelect = (method: Exclude<VerificationMethod, null>) => {
    setVerificationMethod(method);
    handleUsePlaidChange(method === 'plaid');
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
      disableDismiss={isSubmitting}
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
          <div className="space-y-1">
            <h2 className="text-xl font-bold leading-7 text-primary">Review Increase Request</h2>
            <p className="text-sm text-primary">
              Review the details of your credit limit increase request before submitting.
            </p>
          </div>

          <div className="space-y-2 rounded-md border border-primary-gray-border p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-secondary-gray">Current credit limit</span>
              <span className="text-sm font-semibold text-primary">
                {formatCurrency(currentCreditLimit)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-secondary-gray">New credit limit</span>
              <span className="text-sm font-semibold text-primary">
                {formatCurrency(newCreditLimit)}
              </span>
            </div>
          </div>

          <div className="rounded-md border border-primary-gray-border p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-primary">Connected bank account</p>
                <p className="mt-1 text-sm text-secondary-gray">
                  {formatConnectedBankLabel(connectedBank) ?? 'Bank account connected'}
                </p>
              </div>
              <button
                type="button"
                onClick={showVerificationMethodStep}
                disabled={isSubmitting}
                className="shrink-0 text-sm font-semibold text-primary-blue hover:underline disabled:cursor-not-allowed disabled:opacity-50"
              >
                Change
              </button>
            </div>
          </div>

          <label className="flex items-start gap-3 rounded-md bg-[#FAFAFA] p-3 text-sm leading-[18.2px] text-primary">
            <input
              type="checkbox"
              checked={softCreditPullAccepted}
              disabled={isSubmitting}
              onChange={(event) => setSoftCreditPullAccepted(event.target.checked)}
              className="mt-1 h-4 w-4 shrink-0"
            />
            <span>
              I authorize Credit Key to perform a soft credit pull as part of this credit limit
              increase request. This will not affect my credit score.
            </span>
          </label>

          <button
            type="button"
            onClick={submitRequest}
            disabled={!softCreditPullAccepted || isSubmitting}
            className="h-9 w-full rounded-md bg-primary-blue px-4 text-base font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit request'}
          </button>
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
                    onClick={() => handleVerificationMethodSelect(option.method)}
                    onFocus={() => setFocusedVerificationMethod(option.method)}
                    onBlur={() => setFocusedVerificationMethod(null)}
                    className="sr-only"
                  />
                  <span className={getVerificationOptionClassName(option.method)}>
                    <span className="min-w-0 flex-1 space-y-1.5">
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
          onPaymentMethodCreated={handlePlaidComplete}
          toggleModal={toggleModal}
          setUsePlaid={handleUsePlaidChange}
        />
      )}

      {step === 'manual-verification' && (
        <form className="space-y-4" onSubmit={handleManualContinueToReview}>
          <div className="space-y-2">
            <h2 className="text-xl font-bold leading-7 text-primary">Financial Information</h2>
            <p className="text-sm leading-[18.2px] text-primary">
              Lastly, we need to collect some financial information about your business in order to
              provide you with business credit.
            </p>
            <button
              type="button"
              onClick={() => handleUsePlaidChange(true)}
              className="flex items-center gap-1.5 text-sm font-semibold text-primary-blue hover:underline"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
              Connect bank instantly instead
            </button>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-primary">
              Upload last 3 months of bank statements
            </p>
            <div className="grid grid-cols-3 gap-2">
              {manualStatementFiles.map((file, index) => {
                const statementNumber = index + 1;
                const inputId = `request-increase-bank-statement-${statementNumber}`;
                const errorId = `${inputId}-error`;
                const fileError = manualStatementFileErrors[index];

                return (
                  <div key={inputId} className="space-y-1">
                    <label
                      htmlFor={inputId}
                      className={classNames(
                        'flex min-h-[90px] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed px-2 py-4 transition',
                        file ? 'border-primary-blue' : 'border-[#D9D9D9] hover:border-primary-blue',
                      )}
                    >
                      {file ? (
                        <>
                          <FontAwesomeIcon icon={faFile} className="text-2xl text-primary-blue" />
                          <span
                            title={file.name}
                            className="line-clamp-2 w-full break-all px-0.5 text-center text-xs leading-tight text-primary"
                          >
                            {file.name}
                          </span>
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon
                            icon={faArrowUpFromBracket}
                            className="text-2xl text-[#9CA3AF]"
                          />
                          <span className="text-xs text-[#9CA3AF]">Upload</span>
                        </>
                      )}
                    </label>
                    <input
                      id={inputId}
                      type="file"
                      aria-label={`Bank statement ${statementNumber}`}
                      accept={manualBankStatementAcceptAttribute}
                      aria-describedby={fileError ? errorId : undefined}
                      aria-invalid={Boolean(fileError)}
                      onChange={(event) => handleManualStatementFileChange(index, event)}
                      className="sr-only"
                    />
                    {fileError && (
                      <p id={errorId} className="text-center text-xs text-red-600">
                        {fileError}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-start gap-[10px] rounded-md bg-[#FAFAFA] px-[10px] py-[10px]">
            <Image src={shieldCheck} alt="" width={20} height={20} />
            <p className="text-xs leading-[15.6px] text-tertiary-gray">
              Your bank credentials are encrypted and never stored by Credit Key. We use bank-level
              security to protect your information.
            </p>
          </div>

          <label className="flex items-start gap-3 p-1 text-sm leading-[18.2px] text-primary">
            <input
              type="checkbox"
              checked={manualDisclaimerAccepted}
              onChange={(event) => setManualDisclaimerAccepted(event.target.checked)}
              className="mt-1 h-4 w-4 shrink-0"
            />
            <span>
              I acknowledge that the business bank statements I am submitting are a match to the
              payment method on my Credit Key account. If they don't match, I understand this will
              delay my request for a credit line increase until I provide the correct statements.
            </span>
          </label>

          <button
            type="submit"
            disabled={!canContinueToReview}
            className="h-9 w-full rounded-md bg-primary-blue px-4 text-base font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue
          </button>
        </form>
      )}

      {step === 'review' && (
        <div className="space-y-4 py-2">
          <div className="space-y-1">
            <h2 className="text-xl font-bold leading-7 text-primary">Review Increase Request</h2>
            <p className="text-sm text-primary">
              Review the details of your credit limit increase request before submitting.
            </p>
          </div>

          <div className="space-y-2 rounded-md border border-primary-gray-border p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-secondary-gray">Current credit limit</span>
              <span className="text-sm font-semibold text-primary">
                {formatCurrency(currentCreditLimit)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-secondary-gray">New credit limit</span>
              <span className="text-sm font-semibold text-primary">
                {formatCurrency(newCreditLimit)}
              </span>
            </div>
          </div>

          <div className="space-y-2 rounded-md border border-primary-gray-border p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                {verificationMethod === 'plaid' ? (
                  <>
                    <p className="text-sm font-semibold text-primary">Connected bank account</p>
                    {connectedPaymentMethod ? (
                      <p className="mt-1 text-sm text-secondary-gray">
                        {connectedPaymentMethod.bank_name || connectedPaymentMethod.label}
                        {connectedPaymentMethod.payment_method_last_4 &&
                          ` ••••${connectedPaymentMethod.payment_method_last_4}`}
                      </p>
                    ) : (
                      <p className="mt-1 text-sm text-secondary-gray">
                        Bank account connected via Plaid
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-primary">Bank statements</p>
                    <ul className="mt-1 space-y-0.5">
                      {selectedManualStatementFiles.map((file, index) => (
                        <li key={`${index}-${file.name}`} className="text-sm text-secondary-gray">
                          {file.name}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
              <button
                type="button"
                onClick={showVerificationMethodStep}
                disabled={isSubmitting}
                className="shrink-0 text-sm font-semibold text-primary-blue hover:underline disabled:cursor-not-allowed disabled:opacity-50"
              >
                Change
              </button>
            </div>
          </div>

          <label className="flex items-start gap-3 rounded-md bg-[#FAFAFA] p-3 text-sm leading-[18.2px] text-primary">
            <input
              type="checkbox"
              checked={softCreditPullAccepted}
              disabled={isSubmitting}
              onChange={(event) => setSoftCreditPullAccepted(event.target.checked)}
              className="mt-1 h-4 w-4 shrink-0"
            />
            <span>
              I authorize Credit Key to perform a soft credit pull as part of this credit limit
              increase request. This will not affect my credit score.
            </span>
          </label>

          <button
            type="button"
            onClick={handleReviewSubmit}
            disabled={!softCreditPullAccepted || isSubmitting}
            className="h-9 w-full rounded-md bg-primary-blue px-4 text-base font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit request'}
          </button>
        </div>
      )}

      {step === 'confirmation' && (
        <div className="space-y-8">
          <div className="rounded-md border border-primary-gray-border p-6">
            <div className="space-y-4">
              <span className="inline-flex rounded-full bg-[#F6EAD5] px-5 py-1.5 text-base font-semibold leading-5 text-[#8A4F08]">
                Under review
              </span>
              <div className="space-y-3">
                <h2
                  ref={confirmationHeadingRef}
                  tabIndex={-1}
                  className="text-[32px] font-normal leading-[38px] text-primary focus:outline-none"
                >
                  Your request is being reviewed
                </h2>
                <p className="text-[17px] leading-[24px] text-secondary-gray">
                  Our team is reviewing your request and will follow up by email. Please allow at
                  least 1 business day. All messages will come through support@creditkey.com.
                </p>
              </div>
            </div>

            <dl className="mt-6 space-y-6">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-base text-secondary-gray">Requested increase</dt>
                <dd className="text-base font-semibold text-primary">
                  {formatCurrency(parsedRequestedAmount)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-base text-secondary-gray">Status</dt>
                <dd className="text-base font-semibold text-primary">Pending review</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-base text-secondary-gray">Current limit</dt>
                <dd className="text-base font-semibold text-primary">
                  {formatCurrency(currentCreditLimit)}
                </dd>
              </div>
            </dl>
          </div>

          <button
            type="button"
            onClick={toggleModal}
            className="h-12 w-full rounded-md bg-primary-blue px-4 text-base font-semibold text-white"
          >
            Close
          </button>
        </div>
      )}
    </ModalWrapper>
  );
}
