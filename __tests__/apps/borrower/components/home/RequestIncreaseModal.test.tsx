import React, { useState } from 'react';

import RequestIncreaseModal from '@apps/borrower/components/home/RequestIncreaseModal';
import useToast from '@hooks/useToast';
import { createLimitIncreaseRequest, uploadCompanyDocument } from '@lib/actions/companies';
import { act, customRender, fireEvent, screen, waitFor } from '@lib/testing/test-utils';

const mockApi = {};
const mockMakeToast = jest.fn();
const plaidPropsHistory: any[] = [];

const mockPlaidPaymentMethod = {
  id: 'pm-1',
  user_id: 'u-1',
  account_id: 'a-1',
  payment_type: 'ach',
  label: '1234',
  bank_name: 'Test Bank',
  bank_account: '000001234',
  status: 'active',
  is_default: false,
};

jest.mock('@components/modals/ModalWrapper', () => ({
  __esModule: true,
  default: ({ children, header, isModalActive, toggleModal, disableDismiss }) =>
    isModalActive ? (
      <div>
        <div>{header}</div>
        <button type="button" onClick={toggleModal} disabled={disableDismiss}>
          Close modal
        </button>
        {children}
      </div>
    ) : null,
}));

jest.mock('@apps/borrower/components/payment_methods/Plaid', () => ({
  __esModule: true,
  default: (props) => {
    plaidPropsHistory.push(props);

    return (
      <div>
        <p>Plaid verification screen</p>
        <button type="button" onClick={() => props.onPaymentMethodCreated(mockPlaidPaymentMethod)}>
          Complete Plaid verification
        </button>
        <button type="button" onClick={() => props.setUsePlaid(false)}>
          Switch to manual verification
        </button>
        <button type="button" onClick={props.toggleModal}>
          Close from Plaid
        </button>
      </div>
    );
  },
}));

jest.mock('@hooks/useApi', () => ({
  __esModule: true,
  default: jest.fn(() => mockApi),
}));

jest.mock('@hooks/useToast');

jest.mock('@lib/actions/companies', () => ({
  ...jest.requireActual('@lib/actions/companies'),
  createLimitIncreaseRequest: jest.fn(),
  uploadCompanyDocument: jest.fn(),
}));

const mockUseToast = useToast as jest.MockedFunction<typeof useToast>;
const mockCreateLimitIncreaseRequest = createLimitIncreaseRequest as jest.MockedFunction<
  typeof createLimitIncreaseRequest
>;
const mockUploadCompanyDocument = uploadCompanyDocument as jest.MockedFunction<
  typeof uploadCompanyDocument
>;

const openManualBankStatementUploadStep = () => {
  fireEvent.change(screen.getByLabelText('What is the additional amount you are requesting?'), {
    target: { value: '25000' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
  fireEvent.click(screen.getByText('Upload bank statements'));
  fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
};

const uploadThreeStatements = () => {
  const statementFiles = [
    new File(['statement-one'], 'statement-one.pdf', { type: 'application/pdf' }),
    new File(['statement-two'], 'statement-two.pdf', { type: 'application/pdf' }),
    new File(['statement-three'], 'statement-three.pdf', { type: 'application/pdf' }),
  ];
  fireEvent.change(screen.getByLabelText('Bank statement 1'), {
    target: { files: [statementFiles[0]] },
  });
  fireEvent.change(screen.getByLabelText('Bank statement 2'), {
    target: { files: [statementFiles[1]] },
  });
  fireEvent.change(screen.getByLabelText('Bank statement 3'), {
    target: { files: [statementFiles[2]] },
  });
  return statementFiles;
};

const createManualReviewStatementFiles = () => [
  new File(['statement-one'], 'statement-one.pdf', { type: 'application/pdf' }),
  new File(['statement-two'], 'statement-two.pdf', { type: 'application/pdf' }),
  new File(['statement-three'], 'statement-three.pdf', { type: 'application/pdf' }),
];

const renderSeededManualReviewStep = (
  options: {
    companyId?: string;
    requestedAmount?: string;
    manualStatementFiles?: (File | null)[];
    manualDisclaimerAccepted?: boolean;
  } = {},
) => {
  const {
    companyId,
    requestedAmount = '25000',
    manualStatementFiles = createManualReviewStatementFiles(),
    manualDisclaimerAccepted = true,
  } = options;
  const resolvedCompanyId = 'companyId' in options ? companyId : '123';
  const setStateFns = Array.from({ length: 12 }, () => jest.fn());
  let renderResult;

  jest.isolateModules(() => {
    jest.doMock('react', () => {
      const actualReact = jest.requireActual('react');
      let stateIndex = 0;
      const stateValues = [
        requestedAmount,
        'Need additional purchasing flexibility',
        'review',
        'manual',
        null,
        false,
        manualStatementFiles,
        ['', '', ''],
        manualDisclaimerAccepted,
        false,
        null,
        true,
      ];

      return {
        __esModule: true,
        ...actualReact,
        default: actualReact,
        useState: jest.fn((initialState) => {
          const value =
            stateIndex < stateValues.length
              ? stateValues[stateIndex]
              : typeof initialState === 'function'
                ? initialState()
                : initialState;
          const setState = setStateFns[stateIndex] ?? jest.fn();

          stateIndex += 1;
          return [value, setState];
        }),
      };
    });

    const isolatedReact = require('react');
    const { render: isolatedRender } = require('@testing-library/react/pure');
    const SeededRequestIncreaseModal =
      require('@apps/borrower/components/home/RequestIncreaseModal').default;

    renderResult = isolatedRender(
      isolatedReact.createElement(SeededRequestIncreaseModal, {
        companyId: resolvedCompanyId,
        currentCreditLimit: 20000,
        hasConnectedPlaidAccount: false,
        isModalActive: true,
        toggleModal: jest.fn(),
      }),
    );
  });

  jest.dontMock('react');

  return { ...renderResult, setIsSubmitting: setStateFns[5] };
};

const expectSubmissionConfirmation = async (requestedIncrease: string, currentLimit: string) => {
  const heading = await screen.findByRole('heading', { name: 'Your request is being reviewed' });

  expect(heading).toHaveFocus();
  expect(screen.getByText('Under review')).toBeInTheDocument();
  expect(
    screen.getByText(
      'Our team is reviewing your request and will follow up by email. Please allow at least 1 business day. All messages will come through support@creditkey.com.',
    ),
  ).toBeInTheDocument();
  expect(screen.getByText('Requested increase')).toBeInTheDocument();
  expect(screen.getByText(requestedIncrease)).toBeInTheDocument();
  expect(screen.getByText('Status')).toBeInTheDocument();
  expect(screen.getByText('Pending review')).toBeInTheDocument();
  expect(screen.getByText('Current limit')).toBeInTheDocument();
  expect(screen.getByText(currentLimit)).toBeInTheDocument();
};

describe('RequestIncreaseModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    plaidPropsHistory.length = 0;
    mockUseToast.mockReturnValue({ makeToast: mockMakeToast } as any);
    mockCreateLimitIncreaseRequest.mockResolvedValue({} as any);
    mockUploadCompanyDocument.mockResolvedValue(true);
  });

  test('renders first-step UI with current credit limit and dollar-prefixed amount input', () => {
    customRender(
      <RequestIncreaseModal
        companyId="123"
        currentCreditLimit={22500}
        hasConnectedPlaidAccount={false}
        isModalActive
        toggleModal={jest.fn()}
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'Request Credit Line Increase' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('See if you qualify for a larger credit line in just a few minutes.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Current Credit Limit')).toBeInTheDocument();
    expect(screen.getByText('$22,500.00')).toBeInTheDocument();
    expect(
      screen.getByLabelText('What is the additional amount you are requesting?'),
    ).toHaveAttribute('placeholder', '$');
    expect(screen.getByLabelText(/comments/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();
  });

  test('keeps Continue disabled when the request cannot proceed without a company id', () => {
    customRender(
      <RequestIncreaseModal
        currentCreditLimit={20000}
        hasConnectedPlaidAccount={false}
        isModalActive
        toggleModal={jest.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText('What is the additional amount you are requesting?'), {
      target: { value: '25000' },
    });

    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();
  });

  test('continues to the verification-method selection step when no Plaid account is connected', () => {
    customRender(
      <RequestIncreaseModal
        companyId="123"
        currentCreditLimit={20000}
        hasConnectedPlaidAccount={false}
        isModalActive
        toggleModal={jest.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText('What is the additional amount you are requesting?'), {
      target: { value: '25000' },
    });
    fireEvent.change(screen.getByLabelText(/comments/i), {
      target: { value: 'Need additional purchasing flexibility' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    expect(
      screen.getByRole('heading', { name: 'Bank Statement Verification' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'In order to complete your credit limit increase request, we need to verify some financial information with you.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Verification method' })).toBeInTheDocument();
    expect(
      screen.queryByRole('radiogroup', { name: 'Verification method' }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Instant Bank Verification/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Upload bank statements/i })).toBeInTheDocument();
    expect(screen.getByText('Securely connect via Plaid instantly')).toBeInTheDocument();
    expect(
      screen.getByText('Manually upload. Takes up to 3 business days to get a decision.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Recommended')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Your bank credentials are encrypted and never stored by Credit Key. We use bank-level security to protect your information.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue' })).toBeEnabled();
    expect(
      screen.queryByLabelText('What is the additional amount you are requesting?'),
    ).not.toBeInTheDocument();

    const plaidRadio = screen.getByRole('radio', { name: /Instant Bank Verification/i });
    const manualRadio = screen.getByRole('radio', { name: /Upload bank statements/i });
    const plaidCard = plaidRadio.nextElementSibling as HTMLElement;
    const manualCard = manualRadio.nextElementSibling as HTMLElement;
    const recommendationBadge = screen.getByText('Recommended');
    const securityNote = screen
      .getByText(
        'Your bank credentials are encrypted and never stored by Credit Key. We use bank-level security to protect your information.',
      )
      .closest('div') as HTMLElement;
    const verificationContinueButton = screen.getByRole('button', { name: 'Continue' });

    expect(plaidRadio).toBeChecked();
    expect(manualRadio).not.toBeChecked();
    expect(plaidCard).toHaveClass('gap-[14px]', 'border-[#C4DBFC]', 'bg-[#F0F6FE]');
    expect(manualCard).toHaveClass('gap-[14px]', 'border-[#D9D9D9]', 'bg-white');
    expect(recommendationBadge).toHaveClass('ml-auto');
    expect(securityNote).toHaveClass('gap-[14px]', 'px-[10px]', 'py-[10px]');
    expect(verificationContinueButton).toHaveClass('h-[38px]', 'text-[15px]');

    act(() => {
      plaidRadio.focus();
    });
    expect(plaidRadio).toHaveFocus();
    expect(plaidCard).toHaveClass('ring-2', 'ring-primary-blue', 'ring-offset-2');
    expect(manualCard).not.toHaveClass('ring-2');

    fireEvent.click(plaidCard);
    expect(plaidRadio).toBeChecked();
    expect(plaidCard).toHaveClass('border-[#C4DBFC]', 'bg-[#F0F6FE]');
    expect(manualCard).toHaveClass('border-[#D9D9D9]', 'bg-white');
    expect(manualRadio).not.toBeChecked();

    fireEvent.click(screen.getByText('Upload bank statements'));
    expect(manualRadio).toBeChecked();
    expect(plaidRadio).not.toBeChecked();
  });

  test('continues into the Plaid verification screen from the default verification method', () => {
    customRender(
      <RequestIncreaseModal
        companyId="123"
        currentCreditLimit={20000}
        hasConnectedPlaidAccount={false}
        isModalActive
        toggleModal={jest.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText('What is the additional amount you are requesting?'), {
      target: { value: '25000' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    expect(screen.getByText('Plaid verification screen')).toBeInTheDocument();
  });

  test('lets the Plaid fallback switch the modal into the manual bank statement upload screen', () => {
    customRender(
      <RequestIncreaseModal
        companyId="123"
        currentCreditLimit={20000}
        hasConnectedPlaidAccount={false}
        isModalActive
        toggleModal={jest.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText('What is the additional amount you are requesting?'), {
      target: { value: '25000' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    fireEvent.click(screen.getByRole('button', { name: 'Switch to manual verification' }));

    expect(screen.getByRole('heading', { name: 'Financial Information' })).toBeInTheDocument();
    expect(screen.queryByText('Manual bank verification screen')).not.toBeInTheDocument();
  });

  test('can close the modal from the Plaid verification step', () => {
    function RequestIncreaseModalHarness() {
      const [isModalActive, setIsModalActive] = useState(true);

      return (
        <RequestIncreaseModal
          companyId="123"
          currentCreditLimit={20000}
          hasConnectedPlaidAccount={false}
          isModalActive={isModalActive}
          toggleModal={() => setIsModalActive(false)}
        />
      );
    }

    customRender(<RequestIncreaseModalHarness />);

    fireEvent.change(screen.getByLabelText('What is the additional amount you are requesting?'), {
      target: { value: '25000' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    fireEvent.click(screen.getByRole('button', { name: 'Close from Plaid' }));

    expect(screen.queryByText('Plaid verification screen')).not.toBeInTheDocument();
  });

  test('navigates to the review step after Plaid verification completes', () => {
    customRender(
      <RequestIncreaseModal
        companyId="123"
        currentCreditLimit={20000}
        hasConnectedPlaidAccount={false}
        isModalActive
        toggleModal={jest.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText('What is the additional amount you are requesting?'), {
      target: { value: '5000' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    fireEvent.click(screen.getByRole('button', { name: 'Complete Plaid verification' }));

    expect(screen.getByRole('heading', { name: 'Review Increase Request' })).toBeInTheDocument();
    expect(screen.getByText('Current credit limit')).toBeInTheDocument();
    expect(screen.getByText('$20,000.00')).toBeInTheDocument();
    expect(screen.getByText('New credit limit')).toBeInTheDocument();
    expect(screen.getByText('$25,000.00')).toBeInTheDocument();
    expect(screen.getByText('Connected bank account')).toBeInTheDocument();
    expect(screen.getByText(/Test Bank/)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/I authorize Credit Key to perform a soft credit pull/),
    ).not.toBeChecked();
    expect(screen.getByRole('button', { name: 'Submit request' })).toBeDisabled();
  });

  test('shows the under-review confirmation after submitting via Plaid', async () => {
    const toggleModal = jest.fn();

    customRender(
      <RequestIncreaseModal
        companyId="123"
        currentCreditLimit={20000}
        hasConnectedPlaidAccount={false}
        isModalActive
        toggleModal={toggleModal}
      />,
    );

    fireEvent.change(screen.getByLabelText('What is the additional amount you are requesting?'), {
      target: { value: '5000' },
    });
    fireEvent.change(screen.getByLabelText(/comments/i), {
      target: { value: 'Need more credit' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    fireEvent.click(screen.getByRole('button', { name: 'Complete Plaid verification' }));

    fireEvent.click(screen.getByLabelText(/I authorize Credit Key to perform a soft credit pull/));
    fireEvent.click(screen.getByRole('button', { name: 'Submit request' }));

    await waitFor(() => {
      expect(mockCreateLimitIncreaseRequest).toHaveBeenCalledWith(
        expect.any(Object),
        '123',
        5000,
        'Need more credit',
      );
    });
    expect(mockUploadCompanyDocument).not.toHaveBeenCalled();
    expect(toggleModal).not.toHaveBeenCalled();
    expect(mockMakeToast).not.toHaveBeenCalled();

    await expectSubmissionConfirmation('$5,000.00', '$20,000.00');

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(toggleModal).toHaveBeenCalledTimes(1);
  });

  test('uses the manual upload submit path after falling back from Plaid', async () => {
    const toggleModal = jest.fn();

    customRender(
      <RequestIncreaseModal
        companyId="123"
        currentCreditLimit={20000}
        hasConnectedPlaidAccount={false}
        isModalActive
        toggleModal={toggleModal}
      />,
    );

    fireEvent.change(screen.getByLabelText('What is the additional amount you are requesting?'), {
      target: { value: '25000' },
    });
    fireEvent.change(screen.getByLabelText(/comments/i), {
      target: { value: 'Need additional purchasing flexibility' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    fireEvent.click(screen.getByRole('button', { name: 'Switch to manual verification' }));

    expect(screen.getByRole('heading', { name: 'Financial Information' })).toBeInTheDocument();

    const statementFiles = uploadThreeStatements();

    fireEvent.click(
      screen.getByLabelText(
        "I acknowledge that the business bank statements I am submitting are a match to the payment method on my Credit Key account. If they don't match, I understand this will delay my request for a credit line increase until I provide the correct statements.",
      ),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    expect(screen.getByRole('heading', { name: 'Review Increase Request' })).toBeInTheDocument();
    expect(screen.getByText('Bank statements')).toBeInTheDocument();
    expect(screen.getByText(statementFiles[0].name)).toBeInTheDocument();
    expect(screen.getByText(statementFiles[1].name)).toBeInTheDocument();
    expect(screen.getByText(statementFiles[2].name)).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText(/I authorize Credit Key to perform a soft credit pull/));
    fireEvent.click(screen.getByRole('button', { name: 'Submit request' }));

    await waitFor(() => {
      expect(mockUploadCompanyDocument).toHaveBeenCalledTimes(3);
    });
    expect(mockUploadCompanyDocument).toHaveBeenNthCalledWith(
      1,
      expect.any(Object),
      '123',
      statementFiles[0],
      'bank_statements',
      'Credit limit increase bank statement 1',
    );
    expect(mockUploadCompanyDocument).toHaveBeenNthCalledWith(
      2,
      expect.any(Object),
      '123',
      statementFiles[1],
      'bank_statements',
      'Credit limit increase bank statement 2',
    );
    expect(mockUploadCompanyDocument).toHaveBeenNthCalledWith(
      3,
      expect.any(Object),
      '123',
      statementFiles[2],
      'bank_statements',
      'Credit limit increase bank statement 3',
    );
    await waitFor(() => {
      expect(mockCreateLimitIncreaseRequest).toHaveBeenCalledWith(
        expect.any(Object),
        '123',
        25000,
        'Need additional purchasing flexibility',
      );
    });
    expect(mockCreateLimitIncreaseRequest.mock.invocationCallOrder[0]).toBeGreaterThan(
      mockUploadCompanyDocument.mock.invocationCallOrder[2],
    );
    expect(toggleModal).not.toHaveBeenCalled();
    expect(mockMakeToast).not.toHaveBeenCalled();

    await expectSubmissionConfirmation('$25,000.00', '$20,000.00');
  });

  test('shows the generic support toast when manual request creation fails after uploads', async () => {
    customRender(
      <RequestIncreaseModal
        companyId="123"
        currentCreditLimit={20000}
        hasConnectedPlaidAccount={false}
        isModalActive
        toggleModal={jest.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText('What is the additional amount you are requesting?'), {
      target: { value: '25000' },
    });
    fireEvent.change(screen.getByLabelText(/comments/i), {
      target: { value: 'Need additional purchasing flexibility' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    fireEvent.click(screen.getByRole('button', { name: 'Switch to manual verification' }));
    uploadThreeStatements();

    fireEvent.click(
      screen.getByLabelText(
        "I acknowledge that the business bank statements I am submitting are a match to the payment method on my Credit Key account. If they don't match, I understand this will delay my request for a credit line increase until I provide the correct statements.",
      ),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    fireEvent.click(screen.getByLabelText(/I authorize Credit Key to perform a soft credit pull/));

    mockCreateLimitIncreaseRequest.mockRejectedValueOnce(
      new Error('Request failed with status code 500'),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Submit request' }));

    await waitFor(() => {
      expect(mockUploadCompanyDocument).toHaveBeenCalledTimes(3);
    });
    expect(mockCreateLimitIncreaseRequest).toHaveBeenCalledWith(
      expect.any(Object),
      '123',
      25000,
      'Need additional purchasing flexibility',
    );
    expect(mockMakeToast).toHaveBeenCalledWith(
      'An error occurred. Please try again or contact our support team.',
      'error',
    );
    expect(mockMakeToast).not.toHaveBeenCalledWith('Request failed with status code 500', 'error');
  });

  test('does not reupload manual statements when request creation fails and the user retries', async () => {
    const toggleModal = jest.fn();

    customRender(
      <RequestIncreaseModal
        companyId="123"
        currentCreditLimit={20000}
        hasConnectedPlaidAccount={false}
        isModalActive
        toggleModal={toggleModal}
      />,
    );

    fireEvent.change(screen.getByLabelText('What is the additional amount you are requesting?'), {
      target: { value: '25000' },
    });
    fireEvent.change(screen.getByLabelText(/comments/i), {
      target: { value: 'Need additional purchasing flexibility' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    fireEvent.click(screen.getByRole('button', { name: 'Switch to manual verification' }));
    uploadThreeStatements();

    fireEvent.click(
      screen.getByLabelText(
        "I acknowledge that the business bank statements I am submitting are a match to the payment method on my Credit Key account. If they don't match, I understand this will delay my request for a credit line increase until I provide the correct statements.",
      ),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    fireEvent.click(screen.getByLabelText(/I authorize Credit Key to perform a soft credit pull/));

    mockCreateLimitIncreaseRequest.mockRejectedValueOnce(
      new Error('Request failed with status code 500'),
    );

    fireEvent.click(screen.getByRole('button', { name: 'Submit request' }));

    await waitFor(() => {
      expect(mockUploadCompanyDocument).toHaveBeenCalledTimes(3);
    });
    await waitFor(() => {
      expect(mockCreateLimitIncreaseRequest).toHaveBeenCalledTimes(1);
    });
    expect(mockMakeToast).toHaveBeenCalledWith(
      'An error occurred. Please try again or contact our support team.',
      'error',
    );

    fireEvent.click(screen.getByRole('button', { name: 'Submit request' }));

    await waitFor(() => {
      expect(mockCreateLimitIncreaseRequest).toHaveBeenCalledTimes(2);
    });
    expect(mockUploadCompanyDocument).toHaveBeenCalledTimes(3);

    await expectSubmissionConfirmation('$25,000.00', '$20,000.00');
    expect(toggleModal).not.toHaveBeenCalled();
  });

  test('the Change button in the Plaid review step goes back to verification method selection', () => {
    customRender(
      <RequestIncreaseModal
        companyId="123"
        currentCreditLimit={20000}
        hasConnectedPlaidAccount={false}
        isModalActive
        toggleModal={jest.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText('What is the additional amount you are requesting?'), {
      target: { value: '5000' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    fireEvent.click(screen.getByRole('button', { name: 'Complete Plaid verification' }));
    fireEvent.click(screen.getByRole('button', { name: 'Change' }));

    expect(
      screen.getByRole('heading', { name: 'Bank Statement Verification' }),
    ).toBeInTheDocument();
  });

  test('continues into the manual bank statement upload screen when manual verification is selected', () => {
    customRender(
      <RequestIncreaseModal
        companyId="123"
        currentCreditLimit={20000}
        hasConnectedPlaidAccount={false}
        isModalActive
        toggleModal={jest.fn()}
      />,
    );

    openManualBankStatementUploadStep();

    expect(screen.getByRole('heading', { name: 'Financial Information' })).toBeInTheDocument();
    expect(screen.queryByText('Manual bank verification screen')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Bank statement 1')).toHaveAttribute(
      'accept',
      '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png',
    );
    expect(screen.getByLabelText('Bank statement 2')).toBeInTheDocument();
    expect(screen.getByLabelText('Bank statement 3')).toBeInTheDocument();
    expect(
      screen.getByLabelText(
        "I acknowledge that the business bank statements I am submitting are a match to the payment method on my Credit Key account. If they don't match, I understand this will delay my request for a credit line increase until I provide the correct statements.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();
  });

  test('the "Connect bank instantly instead" link switches from manual to Plaid verification', () => {
    customRender(
      <RequestIncreaseModal
        companyId="123"
        currentCreditLimit={20000}
        hasConnectedPlaidAccount={false}
        isModalActive
        toggleModal={jest.fn()}
      />,
    );

    openManualBankStatementUploadStep();

    expect(screen.getByRole('heading', { name: 'Financial Information' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Connect bank instantly instead/i }));

    expect(screen.getByText('Plaid verification screen')).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Financial Information' }),
    ).not.toBeInTheDocument();
  });

  test('rejects manual bank statement uploads with unsupported extensions', () => {
    customRender(
      <RequestIncreaseModal
        companyId="123"
        currentCreditLimit={20000}
        hasConnectedPlaidAccount={false}
        isModalActive
        toggleModal={jest.fn()}
      />,
    );

    openManualBankStatementUploadStep();

    fireEvent.change(screen.getByLabelText('Bank statement 1'), {
      target: {
        files: [new File(['statement'], 'statement.csv', { type: 'application/pdf' })],
      },
    });

    expect(
      screen.getByText(
        'Invalid file type. Please upload a PDF, Word doc, Excel sheet, JPG, or PNG.',
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText('statement.csv')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();
  });

  test('rejects manual bank statement uploads larger than 10MB', () => {
    customRender(
      <RequestIncreaseModal
        companyId="123"
        currentCreditLimit={20000}
        hasConnectedPlaidAccount={false}
        isModalActive
        toggleModal={jest.fn()}
      />,
    );

    openManualBankStatementUploadStep();

    fireEvent.change(screen.getByLabelText('Bank statement 1'), {
      target: {
        files: [
          new File([new Uint8Array(10 * 1024 * 1024 + 1)], 'statement.pdf', {
            type: 'application/pdf',
          }),
        ],
      },
    });

    expect(
      screen.getByText('File is too large. Please upload a file smaller than 10MB.'),
    ).toBeInTheDocument();
    expect(screen.queryByText('statement.pdf')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();
  });

  test('navigates to the review step after uploading three bank statements and accepting the disclaimer', () => {
    customRender(
      <RequestIncreaseModal
        companyId="123"
        currentCreditLimit={20000}
        hasConnectedPlaidAccount={false}
        isModalActive
        toggleModal={jest.fn()}
      />,
    );

    openManualBankStatementUploadStep();
    const statementFiles = uploadThreeStatements();

    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();

    fireEvent.click(
      screen.getByLabelText(
        "I acknowledge that the business bank statements I am submitting are a match to the payment method on my Credit Key account. If they don't match, I understand this will delay my request for a credit line increase until I provide the correct statements.",
      ),
    );

    expect(screen.getByRole('button', { name: 'Continue' })).toBeEnabled();

    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    expect(screen.getByRole('heading', { name: 'Review Increase Request' })).toBeInTheDocument();
    expect(screen.getByText('Current credit limit')).toBeInTheDocument();
    expect(screen.getByText('$20,000.00')).toBeInTheDocument();
    expect(screen.getByText('New credit limit')).toBeInTheDocument();
    expect(screen.getByText('$45,000.00')).toBeInTheDocument();
    expect(screen.getByText('Bank statements')).toBeInTheDocument();
    expect(screen.getByText(statementFiles[0].name)).toBeInTheDocument();
    expect(screen.getByText(statementFiles[1].name)).toBeInTheDocument();
    expect(screen.getByText(statementFiles[2].name)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/I authorize Credit Key to perform a soft credit pull/),
    ).not.toBeChecked();
    expect(screen.getByRole('button', { name: 'Submit request' })).toBeDisabled();
  });

  test('allows duplicate manual statement filenames in the review summary without key collisions', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    customRender(
      <RequestIncreaseModal
        companyId="123"
        currentCreditLimit={20000}
        hasConnectedPlaidAccount={false}
        isModalActive
        toggleModal={jest.fn()}
      />,
    );

    openManualBankStatementUploadStep();

    fireEvent.change(screen.getByLabelText('Bank statement 1'), {
      target: {
        files: [
          new File(['statement-one'], 'duplicate-statement.pdf', { type: 'application/pdf' }),
        ],
      },
    });
    fireEvent.change(screen.getByLabelText('Bank statement 2'), {
      target: {
        files: [
          new File(['statement-two'], 'duplicate-statement.pdf', { type: 'application/pdf' }),
        ],
      },
    });
    fireEvent.change(screen.getByLabelText('Bank statement 3'), {
      target: {
        files: [new File(['statement-three'], 'statement-three.pdf', { type: 'application/pdf' })],
      },
    });

    fireEvent.click(
      screen.getByLabelText(
        "I acknowledge that the business bank statements I am submitting are a match to the payment method on my Credit Key account. If they don't match, I understand this will delay my request for a credit line increase until I provide the correct statements.",
      ),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    expect(screen.getAllByText('duplicate-statement.pdf')).toHaveLength(2);
    expect(screen.getByText('statement-three.pdf')).toBeInTheDocument();
    expect(
      consoleErrorSpy.mock.calls.some((call) =>
        call.some(
          (argument) =>
            typeof argument === 'string' &&
            argument.includes('Encountered two children with the same key'),
        ),
      ),
    ).toBe(false);

    consoleErrorSpy.mockRestore();
  });

  test('shows the under-review confirmation after submitting manual bank statements', async () => {
    const toggleModal = jest.fn();

    customRender(
      <RequestIncreaseModal
        companyId="123"
        currentCreditLimit={20000}
        hasConnectedPlaidAccount={false}
        isModalActive
        toggleModal={toggleModal}
      />,
    );

    fireEvent.change(screen.getByLabelText('What is the additional amount you are requesting?'), {
      target: { value: '25000' },
    });
    fireEvent.change(screen.getByLabelText(/comments/i), {
      target: { value: 'Need additional purchasing flexibility' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    fireEvent.click(screen.getByText('Upload bank statements'));
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    const statementFiles = uploadThreeStatements();

    fireEvent.click(
      screen.getByLabelText(
        "I acknowledge that the business bank statements I am submitting are a match to the payment method on my Credit Key account. If they don't match, I understand this will delay my request for a credit line increase until I provide the correct statements.",
      ),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    // Now on review step — submit button should be disabled until soft credit pull accepted
    const submitButton = screen.getByRole('button', { name: 'Submit request' });
    expect(submitButton).toBeDisabled();

    fireEvent.click(screen.getByLabelText(/I authorize Credit Key to perform a soft credit pull/));
    expect(submitButton).toBeEnabled();

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUploadCompanyDocument).toHaveBeenCalledTimes(3);
    });
    expect(mockUploadCompanyDocument).toHaveBeenNthCalledWith(
      1,
      expect.any(Object),
      '123',
      statementFiles[0],
      'bank_statements',
      'Credit limit increase bank statement 1',
    );
    expect(mockUploadCompanyDocument).toHaveBeenNthCalledWith(
      2,
      expect.any(Object),
      '123',
      statementFiles[1],
      'bank_statements',
      'Credit limit increase bank statement 2',
    );
    expect(mockUploadCompanyDocument).toHaveBeenNthCalledWith(
      3,
      expect.any(Object),
      '123',
      statementFiles[2],
      'bank_statements',
      'Credit limit increase bank statement 3',
    );
    await waitFor(() => {
      expect(mockCreateLimitIncreaseRequest).toHaveBeenCalledWith(
        expect.any(Object),
        '123',
        25000,
        'Need additional purchasing flexibility',
      );
    });
    expect(mockUploadCompanyDocument.mock.invocationCallOrder[2]).toBeLessThan(
      mockCreateLimitIncreaseRequest.mock.invocationCallOrder[0],
    );
    expect(toggleModal).not.toHaveBeenCalled();
    expect(mockMakeToast).not.toHaveBeenCalled();

    await expectSubmissionConfirmation('$25,000.00', '$20,000.00');

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(toggleModal).toHaveBeenCalledTimes(1);
  });

  test('short-circuits manual submission when review-state invariants are stale before submit', async () => {
    const fewerThanThreeSelectedStatementFiles = createManualReviewStatementFiles();
    fewerThanThreeSelectedStatementFiles[2] = null;

    const invalidReviewStates = [
      {
        companyId: undefined,
        requestedAmount: '25000',
        manualStatementFiles: createManualReviewStatementFiles(),
      },
      {
        companyId: '123',
        requestedAmount: 'Infinity',
        manualStatementFiles: createManualReviewStatementFiles(),
      },
      {
        companyId: '123',
        requestedAmount: '25000',
        manualStatementFiles: fewerThanThreeSelectedStatementFiles,
      },
      {
        companyId: '123',
        requestedAmount: '25000',
        manualStatementFiles: createManualReviewStatementFiles(),
        manualDisclaimerAccepted: false,
      },
    ];

    for (const invalidReviewState of invalidReviewStates) {
      const { setIsSubmitting, unmount } = renderSeededManualReviewStep(invalidReviewState);

      fireEvent.click(screen.getByRole('button', { name: 'Submit request' }));

      await act(async () => {
        await Promise.resolve();
      });

      expect(setIsSubmitting).not.toHaveBeenCalled();
      expect(mockUploadCompanyDocument).not.toHaveBeenCalled();
      expect(mockCreateLimitIncreaseRequest).not.toHaveBeenCalled();
      expect(mockMakeToast).not.toHaveBeenCalled();

      unmount();
      mockUploadCompanyDocument.mockClear();
      mockCreateLimitIncreaseRequest.mockClear();
      mockMakeToast.mockClear();
    }
  });

  test('keeps manual submission locked until all in-flight uploads settle after a failure', async () => {
    const uploadControls: Array<{
      resolve: (value: boolean) => void;
      reject: (reason?: unknown) => void;
    }> = [];
    mockUploadCompanyDocument.mockImplementation(
      () =>
        new Promise((resolve, reject) => {
          uploadControls.push({ resolve, reject });
        }),
    );

    customRender(
      <RequestIncreaseModal
        companyId="123"
        currentCreditLimit={20000}
        hasConnectedPlaidAccount={false}
        isModalActive
        toggleModal={jest.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText('What is the additional amount you are requesting?'), {
      target: { value: '25000' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    fireEvent.click(screen.getByText('Upload bank statements'));
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    uploadThreeStatements();
    fireEvent.click(
      screen.getByLabelText(
        "I acknowledge that the business bank statements I am submitting are a match to the payment method on my Credit Key account. If they don't match, I understand this will delay my request for a credit line increase until I provide the correct statements.",
      ),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    // On review step: accept soft credit pull and submit
    fireEvent.click(screen.getByLabelText(/I authorize Credit Key to perform a soft credit pull/));
    const submitButton = screen.getByRole('button', { name: 'Submit request' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUploadCompanyDocument).toHaveBeenCalledTimes(3);
    });
    expect(screen.getByRole('button', { name: 'Close modal' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Submitting...' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Change' })).toBeDisabled();

    await act(async () => {
      uploadControls[0].reject(new Error('upload failed'));
      await Promise.resolve();
    });

    expect(screen.getByRole('button', { name: 'Close modal' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Submitting...' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Change' })).toBeDisabled();
    expect(mockCreateLimitIncreaseRequest).not.toHaveBeenCalled();
    expect(mockMakeToast).not.toHaveBeenCalled();

    await act(async () => {
      uploadControls[1].resolve(true);
      uploadControls[2].resolve(true);
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(mockMakeToast).toHaveBeenCalledWith(
        'Unable to upload one or more bank statements.',
        'error',
      );
    });
    expect(screen.getByRole('button', { name: 'Close modal' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Submit request' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Change' })).toBeEnabled();
    expect(mockCreateLimitIncreaseRequest).not.toHaveBeenCalled();
  });

  test('the Change button in the manual review step goes back to verification method selection', () => {
    customRender(
      <RequestIncreaseModal
        companyId="123"
        currentCreditLimit={20000}
        hasConnectedPlaidAccount={false}
        isModalActive
        toggleModal={jest.fn()}
      />,
    );

    openManualBankStatementUploadStep();
    uploadThreeStatements();
    fireEvent.click(
      screen.getByLabelText(
        "I acknowledge that the business bank statements I am submitting are a match to the payment method on my Credit Key account. If they don't match, I understand this will delay my request for a credit line increase until I provide the correct statements.",
      ),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    fireEvent.click(screen.getByRole('button', { name: 'Change' }));

    expect(
      screen.getByRole('heading', { name: 'Bank Statement Verification' }),
    ).toBeInTheDocument();
  });

  test('renders duplicate-filename bank statements in review summary without key collisions', () => {
    customRender(
      <RequestIncreaseModal
        companyId="123"
        currentCreditLimit={20000}
        hasConnectedPlaidAccount={false}
        isModalActive
        toggleModal={jest.fn()}
      />,
    );

    openManualBankStatementUploadStep();

    const duplicateFile = new File(['data'], 'statement.pdf', { type: 'application/pdf' });
    fireEvent.change(screen.getByLabelText('Bank statement 1'), {
      target: { files: [duplicateFile] },
    });
    fireEvent.change(screen.getByLabelText('Bank statement 2'), {
      target: { files: [duplicateFile] },
    });
    fireEvent.change(screen.getByLabelText('Bank statement 3'), {
      target: { files: [duplicateFile] },
    });

    fireEvent.click(
      screen.getByLabelText(
        "I acknowledge that the business bank statements I am submitting are a match to the payment method on my Credit Key account. If they don't match, I understand this will delay my request for a credit line increase until I provide the correct statements.",
      ),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    fireEvent.click(screen.getByLabelText(/I authorize Credit Key to perform a soft credit pull/));

    const statementItems = screen.getAllByText('statement.pdf');
    expect(statementItems).toHaveLength(3);
  });

  test('can close the modal from the manual bank statement upload step', () => {
    function RequestIncreaseModalHarness() {
      const [isModalActive, setIsModalActive] = useState(true);

      return (
        <RequestIncreaseModal
          companyId="123"
          currentCreditLimit={20000}
          hasConnectedPlaidAccount={false}
          isModalActive={isModalActive}
          toggleModal={() => setIsModalActive(false)}
        />
      );
    }

    customRender(<RequestIncreaseModalHarness />);

    fireEvent.change(screen.getByLabelText('What is the additional amount you are requesting?'), {
      target: { value: '25000' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    fireEvent.click(screen.getByText('Upload bank statements'));
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    fireEvent.click(screen.getByRole('button', { name: 'Close modal' }));

    expect(
      screen.queryByRole('heading', { name: 'Financial Information' }),
    ).not.toBeInTheDocument();
  });

  test('shows the connected-bank interim step first when a Plaid account is already connected and can switch to method selection', () => {
    customRender(
      <RequestIncreaseModal
        companyId="123"
        currentCreditLimit={20000}
        hasConnectedPlaidAccount
        isModalActive
        toggleModal={jest.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText('What is the additional amount you are requesting?'), {
      target: { value: '25000' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    expect(screen.getByRole('heading', { name: 'Review Increase Request' })).toBeInTheDocument();
    expect(screen.getByText(/you already have a bank account connected/i)).toBeInTheDocument();
    expect(screen.getByText('Increase request preview')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Change connected bank' }));

    expect(
      screen.getByRole('heading', { name: 'Bank Statement Verification' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Instant Bank Verification')).toBeInTheDocument();
  });

  test('shows the under-review confirmation after submitting with the existing connected bank', async () => {
    const toggleModal = jest.fn();

    customRender(
      <RequestIncreaseModal
        companyId="123"
        currentCreditLimit={20000}
        hasConnectedPlaidAccount
        isModalActive
        toggleModal={toggleModal}
      />,
    );

    fireEvent.change(screen.getByLabelText('What is the additional amount you are requesting?'), {
      target: { value: '25000' },
    });
    fireEvent.change(screen.getByLabelText(/comments/i), {
      target: { value: 'Need additional purchasing flexibility' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    fireEvent.click(screen.getByRole('button', { name: 'Continue with connected bank' }));

    await waitFor(() => {
      expect(mockCreateLimitIncreaseRequest).toHaveBeenCalledWith(
        expect.any(Object),
        '123',
        25000,
        'Need additional purchasing flexibility',
      );
    });
    expect(toggleModal).not.toHaveBeenCalled();
    expect(mockMakeToast).not.toHaveBeenCalled();

    await expectSubmissionConfirmation('$25,000.00', '$20,000.00');

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(toggleModal).toHaveBeenCalledTimes(1);
  });

  test('resets back to the first step when the modal is closed and reopened', () => {
    function RequestIncreaseModalHarness() {
      const [isModalActive, setIsModalActive] = useState(true);

      return (
        <div>
          <button type="button" onClick={() => setIsModalActive(true)}>
            Open modal
          </button>
          <RequestIncreaseModal
            companyId="123"
            currentCreditLimit={20000}
            hasConnectedPlaidAccount={false}
            isModalActive={isModalActive}
            toggleModal={() => setIsModalActive(false)}
          />
        </div>
      );
    }

    customRender(<RequestIncreaseModalHarness />);

    fireEvent.change(screen.getByLabelText('What is the additional amount you are requesting?'), {
      target: { value: '25000' },
    });
    fireEvent.change(screen.getByLabelText(/comments/i), {
      target: { value: 'Need additional purchasing flexibility' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    expect(
      screen.getByRole('heading', { name: 'Bank Statement Verification' }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Close modal' }));
    fireEvent.click(screen.getByRole('button', { name: 'Open modal' }));

    expect(
      screen.getByRole('heading', { name: 'Request Credit Line Increase' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('What is the additional amount you are requesting?')).toHaveValue(
      '',
    );
    expect(screen.getByLabelText(/comments/i)).toHaveValue('');
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();
  });
});
