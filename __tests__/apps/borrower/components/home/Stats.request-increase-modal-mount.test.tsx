import Stats from '@apps/borrower/components/home/Stats';
import { consumerAccount } from '@lib/testing/records';
import { customRender, screen } from '@lib/testing/test-utils';

const requestIncreaseModalEnvVar = 'NEXT_PUBLIC_BORROWER_REQUEST_INCREASE_MODAL_ENABLED';
const originalRequestIncreaseModalEnv = process.env[requestIncreaseModalEnvVar];
const mockRequestIncreaseModal = jest.fn(() => null);

jest.mock('@apps/borrower/components/home/RequestIncreaseModal', () => ({
  __esModule: true,
  default: (...args) => mockRequestIncreaseModal(...args),
}));

describe('Stats request increase modal mount', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env[requestIncreaseModalEnvVar] = 'true';
    global.mockedUseEntity.mockImplementation(() => ({
      entity: consumerAccount as any,
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    }));
  });

  afterAll(() => {
    if (originalRequestIncreaseModalEnv === undefined) {
      delete process.env[requestIncreaseModalEnvVar];
    } else {
      process.env[requestIncreaseModalEnvVar] = originalRequestIncreaseModalEnv;
    }
  });

  test('does not mount the request increase modal for ineligible entities when the feature flag is enabled', () => {
    customRender(<Stats />, { withBorrowerProviders: true });

    expect(screen.queryByRole('button', { name: /request increase/i })).not.toBeInTheDocument();
    expect(mockRequestIncreaseModal).not.toHaveBeenCalled();
  });
});
