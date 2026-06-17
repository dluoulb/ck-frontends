import Stats from '@apps/borrower/components/home/Stats';
import { companyApproved, consumerAccount } from '@lib/testing/records';
import { customRender, fireEvent, screen, waitFor } from '@lib/testing/test-utils';

const mockCreateLimitIncreaseRequest = jest.fn();
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

jest.mock('@hooks/useApi', () => ({
  __esModule: true,
  default: jest.fn(() => ({})),
}));

jest.mock('@lib/actions/companies', () => ({
  ...jest.requireActual('@lib/actions/companies'),
  createLimitIncreaseRequest: (...args) => mockCreateLimitIncreaseRequest(...args),
}));

describe('Stats Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env[requestIncreaseModalEnvVar] = 'true';
    global.mockedUseEntity.mockImplementation(() => ({
      entity: companyApproved,
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

  test('submits the request on Continue and shows success feedback', async () => {
    mockCreateLimitIncreaseRequest.mockResolvedValue({} as any);

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
      expect(mockCreateLimitIncreaseRequest).toHaveBeenCalledWith(
        expect.anything(),
        '123',
        25000,
        'Need additional purchasing flexibility',
      );
    });

    await waitFor(() => {
      expect(screen.getByText(/request submitted/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/we will review your request and follow up soon/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
  });

  test('shows a retryable error state when the Continue submit fails', async () => {
    mockCreateLimitIncreaseRequest.mockRejectedValue(new Error('Request failed'));

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
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    await waitFor(() => {
      expect(
        screen.getByText(/we couldn't submit your request\. please try again\./i),
      ).toBeInTheDocument();
    });

    expect(mockCreateLimitIncreaseRequest).toHaveBeenCalledWith(
      expect.anything(),
      '123',
      25000,
      '',
    );
    expect(screen.getByRole('button', { name: 'Continue' })).not.toBeDisabled();
  });
});
