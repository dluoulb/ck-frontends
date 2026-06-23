import Stats from '@apps/borrower/components/home/Stats';
import { companyApproved, consumerAccount } from '@lib/testing/records';
import { act, customRender, fireEvent, screen, waitFor } from '@lib/testing/test-utils';

const requestIncreaseModalEnvVar = 'NEXT_PUBLIC_BORROWER_REQUEST_INCREASE_MODAL_ENABLED';
const originalRequestIncreaseModalEnv = process.env[requestIncreaseModalEnvVar];

jest.mock('@components/modals/ModalWrapper', () => ({
  __esModule: true,
  default: ({ children, header, isModalActive }) =>
    isModalActive ? (
      <div>
        <div>{header}</div>
        {children}
      </div>
    ) : null,
}));

describe('Stats Component', () => {
  beforeEach(() => {
    process.env[requestIncreaseModalEnvVar] = 'true';
    const companyApprovedWithoutBankConnection = Object.assign(
      Object.create(Object.getPrototypeOf(companyApproved)),
      companyApproved,
      {
        is_bank_connected: false,
        is_bank_connection_pending: false,
      },
    );

    global.mockedUseEntity.mockImplementation(() => ({
      entity: companyApprovedWithoutBankConnection,
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    }));
    global.mockedUseStats.mockImplementation(() => ({
      stats: {
        active: 163,
        closed: 0,
        credit_utilized: 13920,
      },
      statsError: null,
      statsLoading: false,
    }));
  });

  afterAll(() => {
    if (originalRequestIncreaseModalEnv === undefined) {
      delete process.env[requestIncreaseModalEnvVar];
    } else {
      process.env[requestIncreaseModalEnvVar] = originalRequestIncreaseModalEnv;
    }
  });

  test('renders', async () => {
    customRender(<Stats />, { withBorrowerProviders: true });

    await waitFor(() => {
      const remainingLabel = screen.getByText(/Remaining Credit/i);
      const remainingValue = remainingLabel.parentElement.querySelector('dd');
      expect(remainingValue).toHaveTextContent('$6,080.00');
    });
  });
  test('displays error notification if stats not fetched', async () => {
    global.mockedUseStats.mockImplementationOnce(() => ({
      stats: [],
      statsError: new Error('Stats not Found'),
      statsLoading: false,
    }));
    customRender(<Stats />, { withBorrowerProviders: true });

    expect(screen.getByText(/Unable to collect available company credit/));
  });

  test('uses the legacy external Request Increase link while the modal feature flag is disabled', async () => {
    delete process.env[requestIncreaseModalEnvVar];
    customRender(<Stats />, { withBorrowerProviders: true });

    const requestIncreaseLink = screen.getByRole('link', { name: /request increase/i });

    expect(requestIncreaseLink).toHaveAttribute(
      'href',
      'https://www.creditkey.com/credit-key-increase-request',
    );
    expect(screen.queryByRole('button', { name: /request increase/i })).not.toBeInTheDocument();
    expect(screen.queryByText('Request Credit Line Increase')).not.toBeInTheDocument();
  });

  test('opens the request increase modal from the maximum credit tile and shows the first-step copy', async () => {
    customRender(<Stats />, { withBorrowerProviders: true });

    fireEvent.click(screen.getByRole('button', { name: /request increase/i }));

    await waitFor(() => {
      expect(screen.getByText('Request Credit Line Increase')).toBeInTheDocument();
    });
    expect(
      screen.getByText('See if you qualify for a larger credit line in just a few minutes.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Current Credit Limit')).toBeInTheDocument();
    expect(screen.getAllByText('$20,000.00')).toHaveLength(2);
    expect(
      screen.getByLabelText('What is the additional amount you are requesting?'),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/comments/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();
  });

  test('keeps Continue disabled for invalid, zero, and non-positive requested amounts', async () => {
    customRender(<Stats />, { withBorrowerProviders: true });

    fireEvent.click(screen.getByRole('button', { name: /request increase/i }));
    await waitFor(() => {
      expect(
        screen.getByLabelText('What is the additional amount you are requesting?'),
      ).toBeInTheDocument();
    });

    const continueButton = screen.getByRole('button', { name: 'Continue' });
    const requestedAmountInput = screen.getByLabelText(
      'What is the additional amount you are requesting?',
    );

    fireEvent.change(requestedAmountInput, {
      target: { value: 'abc' },
    });
    expect(continueButton).toBeDisabled();

    fireEvent.change(requestedAmountInput, {
      target: { value: '0' },
    });
    expect(continueButton).toBeDisabled();

    fireEvent.change(requestedAmountInput, {
      target: { value: '-2500' },
    });
    expect(continueButton).toBeDisabled();
  });

  test('enables Continue when the requested amount is a valid positive number', async () => {
    customRender(<Stats />, { withBorrowerProviders: true });

    fireEvent.click(screen.getByRole('button', { name: /request increase/i }));
    await waitFor(() => {
      expect(
        screen.getByLabelText('What is the additional amount you are requesting?'),
      ).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('What is the additional amount you are requesting?'), {
      target: { value: '25000' },
    });

    expect(screen.getByRole('button', { name: 'Continue' })).not.toBeDisabled();
  });

  test('does not show Request Increase when the approved entity is missing a company id', async () => {
    global.mockedUseEntity.mockImplementation(() => ({
      entity: { ...companyApproved, id: null } as any,
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    }));

    customRender(<Stats />, { withBorrowerProviders: true });

    expect(screen.queryByRole('button', { name: /request increase/i })).not.toBeInTheDocument();
  });

  test('does not show Request Increase for approved non-company entities', async () => {
    global.mockedUseEntity.mockImplementation(() => ({
      entity: consumerAccount as any,
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    }));

    customRender(<Stats />, { withBorrowerProviders: true });

    expect(screen.queryByRole('button', { name: /request increase/i })).not.toBeInTheDocument();
  });

  test('routes approved companies without a connected Plaid account to the verification-method selection step', async () => {
    customRender(<Stats />, { withBorrowerProviders: true });

    fireEvent.click(screen.getByRole('button', { name: /request increase/i }));
    await waitFor(() => {
      expect(
        screen.getByLabelText('What is the additional amount you are requesting?'),
      ).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('What is the additional amount you are requesting?'), {
      target: { value: '25000' },
    });
    fireEvent.change(screen.getByLabelText(/comments/i), {
      target: { value: 'Need additional purchasing flexibility' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Bank Statement Verification' }),
      ).toBeInTheDocument();
    });
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
    expect(screen.getByRole('button', { name: 'Continue' })).toBeEnabled();

    const plaidRadio = screen.getByRole('radio', { name: /Instant Bank Verification/i });
    const manualRadio = screen.getByRole('radio', { name: /Upload bank statements/i });
    const plaidCard = plaidRadio.nextElementSibling as HTMLElement;
    const manualCard = manualRadio.nextElementSibling as HTMLElement;

    expect(plaidRadio).toBeChecked();
    expect(manualRadio).not.toBeChecked();
    expect(plaidCard).toHaveClass('border-[#C4DBFC]', 'bg-[#F0F6FE]');
    expect(manualCard).toHaveClass('border-[#D9D9D9]', 'bg-white');

    act(() => {
      manualRadio.focus();
    });
    expect(manualRadio).toHaveFocus();
    expect(plaidCard).not.toHaveClass('ring-2');
    expect(manualCard).toHaveClass('ring-2', 'ring-primary-blue', 'ring-offset-2');

    fireEvent.click(manualRadio);
    expect(manualRadio).toBeChecked();
    expect(plaidCard).toHaveClass('border-[#D9D9D9]', 'bg-white');
    expect(manualCard).toHaveClass('border-[#C4DBFC]', 'bg-[#F0F6FE]');
    expect(plaidRadio).not.toBeChecked();
  });

  test('does not treat a Plaid access token as an existing bank connection', async () => {
    const companyApprovedWithOnlyPlaidAccessToken = Object.assign(
      Object.create(Object.getPrototypeOf(companyApproved)),
      companyApproved,
      {
        is_bank_connected: false,
        is_bank_connection_pending: false,
        underwriting: {
          plaid_access_token: 'access-sandbox-secret',
        },
      },
    );

    global.mockedUseEntity.mockImplementation(() => ({
      entity: companyApprovedWithOnlyPlaidAccessToken,
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    }));

    customRender(<Stats />, { withBorrowerProviders: true });

    fireEvent.click(screen.getByRole('button', { name: /request increase/i }));
    await waitFor(() => {
      expect(
        screen.getByLabelText('What is the additional amount you are requesting?'),
      ).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('What is the additional amount you are requesting?'), {
      target: { value: '25000' },
    });
    fireEvent.change(screen.getByLabelText(/comments/i), {
      target: { value: 'Need additional purchasing flexibility' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Bank Statement Verification' }),
      ).toBeInTheDocument();
    });
    expect(screen.getByRole('group', { name: 'Verification method' })).toBeInTheDocument();
    expect(
      screen.queryByRole('radiogroup', { name: 'Verification method' }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Instant Bank Verification/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Upload bank statements/i })).toBeInTheDocument();
  });

  test('routes approved companies with an existing Plaid connection to the connected-bank review step first', async () => {
    const companyApprovedWithPlaid = Object.assign(
      Object.create(Object.getPrototypeOf(companyApproved)),
      companyApproved,
    );

    global.mockedUseEntity.mockImplementation(() => ({
      entity: companyApprovedWithPlaid,
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    }));

    customRender(<Stats />, { withBorrowerProviders: true });

    fireEvent.click(screen.getByRole('button', { name: /request increase/i }));
    await waitFor(() => {
      expect(
        screen.getByLabelText('What is the additional amount you are requesting?'),
      ).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('What is the additional amount you are requesting?'), {
      target: { value: '25000' },
    });
    fireEvent.change(screen.getByLabelText(/comments/i), {
      target: { value: 'Need additional purchasing flexibility' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Review Increase Request' })).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: 'Change connected bank' })).toBeInTheDocument();
  });

  test('does not treat a plaid item id alone as an existing connected bank', async () => {
    const companyApprovedWithItemIdOnly = Object.assign(
      Object.create(Object.getPrototypeOf(companyApproved)),
      companyApproved,
      {
        is_bank_connected: false,
        is_bank_connection_pending: false,
        underwriting: {
          plaid_item_id: 'item_123',
        },
      },
    ) as any;

    global.mockedUseEntity.mockImplementation(() => ({
      entity: companyApprovedWithItemIdOnly,
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    }));

    customRender(<Stats />, { withBorrowerProviders: true });

    fireEvent.click(screen.getByRole('button', { name: /request increase/i }));
    await waitFor(() => {
      expect(
        screen.getByLabelText('What is the additional amount you are requesting?'),
      ).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('What is the additional amount you are requesting?'), {
      target: { value: '25000' },
    });
    fireEvent.change(screen.getByLabelText(/comments/i), {
      target: { value: 'Need additional purchasing flexibility' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Bank Statement Verification' }),
      ).toBeInTheDocument();
    });
    expect(
      screen.queryByRole('heading', { name: 'Review Increase Request' }),
    ).not.toBeInTheDocument();
  });

  test('does not treat a string false is_bank_connected payload as an existing connected bank', async () => {
    const companyApprovedWithStringBankFlag = new (companyApproved.constructor as any)({
      ...companyApproved,
      is_bank_connected: 'false',
      is_bank_connection_pending: 'false',
    });

    global.mockedUseEntity.mockImplementation(() => ({
      entity: companyApprovedWithStringBankFlag,
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    }));

    customRender(<Stats />, { withBorrowerProviders: true });

    fireEvent.click(screen.getByRole('button', { name: /request increase/i }));
    await waitFor(() => {
      expect(
        screen.getByLabelText('What is the additional amount you are requesting?'),
      ).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('What is the additional amount you are requesting?'), {
      target: { value: '25000' },
    });
    fireEvent.change(screen.getByLabelText(/comments/i), {
      target: { value: 'Need additional purchasing flexibility' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Bank Statement Verification' }),
      ).toBeInTheDocument();
    });
    expect(
      screen.queryByRole('heading', { name: 'Review Increase Request' }),
    ).not.toBeInTheDocument();
  });
});
