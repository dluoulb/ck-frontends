import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import SetDefaultTermsModal from '@apps/borrower/components/home/widgets/virtual_cards/vc_modal/SetDefaultTermsModal';
import { useEntity } from '@contexts/EntityContext';
import { useUser } from '@contexts/UserContext';
import useToast from '@hooks/useToast';
import { createVirtualCard, updateRechargeTerm } from '@lib/actions/companies';
import { getApprovedTerms } from '@lib/actions/entities';
import { getMerchant } from '@lib/actions/merchants';

jest.mock('@contexts/EntityContext');
jest.mock('@contexts/UserContext');
jest.mock('@hooks/useApi', () => ({
  __esModule: true,
  default: jest.fn(() => ({})),
}));
jest.mock('@hooks/useToast', () => ({
  __esModule: true,
  default: jest.fn(() => ({ makeToast: jest.fn() })),
}));
jest.mock('@lib/actions/companies', () => ({
  createVirtualCard: jest.fn(),
  updateRechargeTerm: jest.fn(),
}));
jest.mock('@lib/actions/entities');
jest.mock('@lib/actions/merchants');
jest.mock('@lib/utils/fullstory', () =>
  jest.fn().mockImplementation(() => ({
    setDefaultTermsEvent: jest.fn(),
  })),
);

const mockUseEntity = useEntity as jest.MockedFunction<typeof useEntity>;
const mockUseUser = useUser as jest.MockedFunction<typeof useUser>;
const mockUseToast = useToast as jest.MockedFunction<typeof useToast>;
const mockCreateVirtualCard = createVirtualCard as jest.MockedFunction<typeof createVirtualCard>;
const mockUpdateRechargeTerm = updateRechargeTerm as jest.MockedFunction<typeof updateRechargeTerm>;
const mockGetApprovedTerms = getApprovedTerms as jest.MockedFunction<typeof getApprovedTerms>;
const mockGetMerchant = getMerchant as jest.MockedFunction<typeof getMerchant>;

describe('SetDefaultTermsModal', () => {
  const next = jest.fn();
  const setModalState = jest.fn();
  const syncVirtualCardAfterCreate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseEntity.mockReturnValue({
      entity: { id: 'entity-1' } as any,
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    });
    mockUseUser.mockReturnValue({ user: { id: 'user-1' } } as any);
    mockUseToast.mockImplementation(() => ({ makeToast: jest.fn() }) as any);
    mockGetMerchant.mockResolvedValue({ id: 'merchant-1', name: 'Virtual' } as any);
    mockGetApprovedTerms.mockResolvedValue({
      terms: [{ term: 12, term_period: 'monthly', rate: 1.74 }],
    } as any);
    mockUpdateRechargeTerm.mockResolvedValue({} as any);
    mockCreateVirtualCard.mockResolvedValue({ id: 'vc-1' } as any);
    syncVirtualCardAfterCreate.mockResolvedValue({
      id: 'vc-1',
      status: 'ACTIVE',
      is_default: true,
      type: 'VIRTUAL',
    });
  });

  test('does not render rate for Net 30 (days) terms but does render rate for monthly terms', async () => {
    mockGetApprovedTerms.mockResolvedValue({
      terms: [
        { term: 30, term_period: 'days', rate: 0 },
        { term: 12, term_period: 'monthly', rate: 1.74 },
      ],
    } as any);

    render(<SetDefaultTermsModal next={next} setModalState={setModalState} />);

    await waitFor(() => {
      expect(screen.getByText('Net 30')).toBeInTheDocument();
      expect(screen.getByText('12 months')).toBeInTheDocument();
    });

    expect(screen.getByText('1.74% monthly')).toBeInTheDocument();
    expect(screen.queryByText('0%')).not.toBeInTheDocument();
  });

  test('does not refetch merchant or terms on rerender when toast callback identity changes', async () => {
    const { rerender } = render(<SetDefaultTermsModal next={next} setModalState={setModalState} />);

    await waitFor(() => {
      expect(screen.getByText('Set default payment terms')).toBeInTheDocument();
    });

    rerender(<SetDefaultTermsModal next={next} setModalState={setModalState} />);

    await waitFor(() => {
      expect(mockGetMerchant).toHaveBeenCalledTimes(1);
      expect(mockGetApprovedTerms).toHaveBeenCalledTimes(1);
    });
  });

  test('stores the synced virtual card returned after creation before advancing', async () => {
    render(
      <SetDefaultTermsModal
        next={next}
        setModalState={setModalState}
        syncVirtualCardAfterCreate={syncVirtualCardAfterCreate}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText('Set default payment terms')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('radio'));
    fireEvent.click(screen.getByLabelText('save-default-terms-button'));

    await waitFor(() => {
      expect(mockUpdateRechargeTerm).toHaveBeenCalledTimes(1);
      expect(mockCreateVirtualCard).toHaveBeenCalledTimes(1);
      expect(syncVirtualCardAfterCreate).toHaveBeenCalledWith({ id: 'vc-1' });
      expect(next).toHaveBeenCalledTimes(1);
    });

    const defaultTermUpdater = setModalState.mock.calls[0][0];
    expect(defaultTermUpdater({})).toMatchObject({
      shouldRefreshEntity: true,
      default_term_setting: {
        merchant_id: 'merchant-1',
        default_term: {
          term: 12,
          term_period: 'monthly',
        },
      },
    });

    const virtualCardUpdater = setModalState.mock.calls[1][0];
    expect(virtualCardUpdater({})).toEqual({
      virtual_card: {
        id: 'vc-1',
        status: 'ACTIVE',
        is_default: true,
        type: 'VIRTUAL',
      },
    });
  });
});
