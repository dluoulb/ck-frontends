import Stats from '@apps/borrower/components/home/Stats';
import { companyApproved, consumerAccount } from '@lib/testing/records';
import { act, customRender, screen, waitFor } from '@lib/testing/test-utils';

const mockRequestIncreaseModal = jest.fn(() => null);

const buildCompany = (overrides = {}) =>
  Object.assign(Object.create(Object.getPrototypeOf(companyApproved)), companyApproved, overrides);

jest.mock('@apps/borrower/components/home/RequestIncreaseModal', () => ({
  __esModule: true,
  default: (...args) => mockRequestIncreaseModal(...args),
}));

describe('Stats request increase modal mount', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.history.replaceState({}, '', '/borrower');
    global.mockedUseEntity.mockImplementation(() => ({
      entity: consumerAccount as any,
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    }));
  });

  test('does not mount the request increase modal for ineligible entities', () => {
    customRender(<Stats />, { withBorrowerProviders: true });

    expect(screen.queryByRole('button', { name: /request increase/i })).not.toBeInTheDocument();
    expect(mockRequestIncreaseModal).not.toHaveBeenCalled();
  });

  test('shows the disabled request increase control without mounting the modal for ineligible deep links', () => {
    window.history.replaceState({}, '', '/borrower?request_credit_increase=true');
    const ineligibleApprovedCompany = buildCompany({
      eligible_for_line_increase_request: false,
      line_increase_request_availability: {
        eligible: false,
        reason: 'recent_credit_refresh',
      },
    });

    global.mockedUseEntity.mockImplementation(() => ({
      entity: ineligibleApprovedCompany as any,
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    }));

    customRender(<Stats />, { withBorrowerProviders: true });

    expect(screen.getByRole('button', { name: /request increase/i })).toBeDisabled();
    expect(mockRequestIncreaseModal).not.toHaveBeenCalled();
  });

  test('passes an auto-opened modal state to the request increase modal for eligible deep links', async () => {
    window.history.replaceState({}, '', '/borrower?request_credit_increase=true');
    global.mockedUseEntity.mockImplementation(() => ({
      entity: companyApproved as any,
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    }));

    customRender(<Stats />, { withBorrowerProviders: true });

    await waitFor(() => {
      expect(
        mockRequestIncreaseModal.mock.calls.some(
          ([props]) => props.companyId === companyApproved.id && props.isModalActive === true,
        ),
      ).toBe(true);
    });
  });

  test('passes a company entity refresh callback to the request increase modal', async () => {
    const fetchEntity = jest.fn();

    global.mockedUseEntity.mockImplementation(() => ({
      entity: companyApproved as any,
      setEntity: jest.fn(),
      fetchEntity,
      entityError: null,
      entityLoading: false,
    }));

    customRender(<Stats />, { withBorrowerProviders: true });

    await waitFor(() => {
      expect(mockRequestIncreaseModal).toHaveBeenCalled();
    });

    const latestProps = mockRequestIncreaseModal.mock.calls.at(-1)?.[0];

    expect(latestProps).toBeDefined();

    act(() => {
      latestProps.refreshRequestIncreaseAvailability();
    });

    expect(fetchEntity).toHaveBeenCalledWith(companyApproved.id, 'company');
  });

  test('does not auto-open again after remounting on the sanitized URL from a consumed deep link', async () => {
    window.history.replaceState({}, '', '/borrower?request_credit_increase=true');
    global.mockedUseEntity.mockImplementation(() => ({
      entity: companyApproved as any,
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    }));

    const { unmount } = customRender(<Stats />, { withBorrowerProviders: true });

    await waitFor(() => {
      expect(
        mockRequestIncreaseModal.mock.calls.filter(([props]) => props.isModalActive === true)
          .length,
      ).toBe(1);
    });
    expect(window.location.search).toBe('');

    unmount();
    mockRequestIncreaseModal.mockClear();

    customRender(<Stats />, { withBorrowerProviders: true });

    await waitFor(() => {
      expect(mockRequestIncreaseModal).toHaveBeenCalled();
    });
    expect(
      mockRequestIncreaseModal.mock.calls.some(([props]) => props.isModalActive === true),
    ).toBe(false);
    expect(window.location.search).toBe('');
  });

  test('auto-opens again after navigating back to the same deep link while Stats stays mounted', async () => {
    window.history.replaceState({}, '', '/borrower?request_credit_increase=true');
    global.mockedUseEntity.mockImplementation(() => ({
      entity: companyApproved as any,
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    }));

    const { rerender } = customRender(<Stats />, { withBorrowerProviders: true });

    await waitFor(() => {
      expect(
        mockRequestIncreaseModal.mock.calls.filter(([props]) => props.isModalActive === true)
          .length,
      ).toBe(1);
    });
    expect(window.location.search).toBe('');

    act(() => {
      const latestProps = mockRequestIncreaseModal.mock.calls.at(-1)?.[0];
      latestProps.toggleModal();
    });

    await waitFor(() => {
      expect(mockRequestIncreaseModal.mock.calls.at(-1)?.[0].isModalActive).toBe(false);
    });

    window.history.replaceState({}, '', '/borrower?request_credit_increase=true');
    rerender(<Stats />);

    await waitFor(() => {
      expect(
        mockRequestIncreaseModal.mock.calls.filter(([props]) => props.isModalActive === true)
          .length,
      ).toBe(2);
    });
    expect(window.location.search).toBe('');
  });
});
