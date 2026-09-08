import type { ComponentProps } from 'react';

import type RequestIncreaseModal from '@apps/borrower/components/home/RequestIncreaseModal';
import Stats from '@apps/borrower/components/home/Stats';
import useToast from '@hooks/useToast';
import { companyApproved, consumerAccount } from '@lib/testing/records';
import { act, customRender, screen, waitFor } from '@lib/testing/test-utils';

type RequestIncreaseModalProps = ComponentProps<typeof RequestIncreaseModal>;

const mockRequestIncreaseModal = jest.fn((_props: RequestIncreaseModalProps) => null);
const mockMakeToast = jest.fn();

const buildCompany = (overrides = {}) =>
  Object.assign(Object.create(Object.getPrototypeOf(companyApproved)), companyApproved, overrides);

jest.mock('@apps/borrower/components/home/RequestIncreaseModal', () => ({
  __esModule: true,
  default: (props: RequestIncreaseModalProps) => mockRequestIncreaseModal(props),
}));

jest.mock('@hooks/useToast');

const mockUseToast = useToast as jest.MockedFunction<typeof useToast>;

const getLatestRequestIncreaseModalProps = () => {
  const latestCall = mockRequestIncreaseModal.mock.calls.at(-1);

  if (!latestCall) {
    throw new Error('Expected RequestIncreaseModal to be called');
  }

  return latestCall[0];
};

describe('Stats request increase modal mount', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseToast.mockReturnValue({ makeToast: mockMakeToast });
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

    const latestProps = getLatestRequestIncreaseModalProps();

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
      const latestProps = getLatestRequestIncreaseModalProps();
      latestProps.toggleModal();
    });

    await waitFor(() => {
      expect(getLatestRequestIncreaseModalProps().isModalActive).toBe(false);
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

describe('Stats ineligible deep link toast', () => {
  const mockEntity = (entity) => {
    global.mockedUseEntity.mockImplementation(() => ({
      entity: entity as any,
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    }));
  };

  const buildIneligibleCompany = (reason?: string) =>
    buildCompany({
      eligible_for_line_increase_request: false,
      line_increase_request_availability: reason
        ? { eligible: false, reason }
        : { eligible: false },
    });

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseToast.mockReturnValue({ makeToast: mockMakeToast });
    window.history.replaceState({}, '', '/borrower?request_credit_increase=true');
  });

  test('toasts the cooldown notice and strips the param for a recent_credit_refresh deep link', async () => {
    mockEntity(buildIneligibleCompany('recent_credit_refresh'));

    customRender(<Stats />, { withBorrowerProviders: true });

    await waitFor(() => {
      expect(mockMakeToast).toHaveBeenCalledWith(
        'You are only able to request a credit line increase once every 6 months',
        'info',
      );
    });
    expect(mockMakeToast).toHaveBeenCalledTimes(1);
    expect(window.location.search).toBe('');
    expect(mockRequestIncreaseModal).not.toHaveBeenCalled();
  });

  test('toasts the pending request notice for a pending_request deep link', async () => {
    mockEntity(buildIneligibleCompany('pending_request'));

    customRender(<Stats />, { withBorrowerProviders: true });

    await waitFor(() => {
      expect(mockMakeToast).toHaveBeenCalledWith('Your credit increase is under review', 'info');
    });
    expect(window.location.search).toBe('');
  });

  test('toasts the company status notice for a company_status deep link', async () => {
    mockEntity(buildIneligibleCompany('company_status'));

    customRender(<Stats />, { withBorrowerProviders: true });

    await waitFor(() => {
      expect(mockMakeToast).toHaveBeenCalledWith(
        'Your company is currently not eligible for a credit request increase',
        'info',
      );
    });
    expect(window.location.search).toBe('');
  });

  test('toasts the generic notice when no availability reason is present', async () => {
    mockEntity(buildIneligibleCompany());

    customRender(<Stats />, { withBorrowerProviders: true });

    await waitFor(() => {
      expect(mockMakeToast).toHaveBeenCalledWith(
        'You are currently unable to request a credit line increase',
        'info',
      );
    });
    expect(window.location.search).toBe('');
  });

  test('does not toast for an eligible deep link', async () => {
    mockEntity(companyApproved);

    customRender(<Stats />, { withBorrowerProviders: true });

    await waitFor(() => {
      expect(
        mockRequestIncreaseModal.mock.calls.some(([props]) => props.isModalActive === true),
      ).toBe(true);
    });
    expect(mockMakeToast).not.toHaveBeenCalled();
  });

  test('does not toast for an ineligible company without a deep link', () => {
    window.history.replaceState({}, '', '/borrower');
    mockEntity(buildIneligibleCompany('recent_credit_refresh'));

    customRender(<Stats />, { withBorrowerProviders: true });

    expect(mockMakeToast).not.toHaveBeenCalled();
    expect(window.location.search).toBe('');
  });
});
