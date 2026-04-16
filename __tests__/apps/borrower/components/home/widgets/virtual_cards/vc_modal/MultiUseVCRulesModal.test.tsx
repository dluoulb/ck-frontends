import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import MultiUseVCRulesModal from '@apps/borrower/components/home/widgets/virtual_cards/vc_modal/MultiUseVCRulesModal';
import { useEntity } from '@contexts/EntityContext';
import { useUser } from '@contexts/UserContext';
import useToast from '@hooks/useToast';
import { createVirtualCard } from '@lib/actions/companies';

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
}));
jest.mock('@lib/utils/fullstory', () =>
  jest.fn().mockImplementation(() => ({
    agreeVcRulesEvent: jest.fn(),
  })),
);

const mockUseEntity = useEntity as jest.MockedFunction<typeof useEntity>;
const mockUseUser = useUser as jest.MockedFunction<typeof useUser>;
const mockUseToast = useToast as jest.MockedFunction<typeof useToast>;
const mockCreateVirtualCard = createVirtualCard as jest.MockedFunction<typeof createVirtualCard>;

describe('MultiUseVCRulesModal', () => {
  const next = jest.fn();
  const toggleModal = jest.fn();
  const setModalState = jest.fn();
  const syncVirtualCardAfterCreate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseEntity.mockReturnValue({
      entity: {
        id: 'entity-1',
        is_bank_connected: true,
      } as any,
    } as any);
    mockUseUser.mockReturnValue({ user: { id: 'user-1' } } as any);
    mockUseToast.mockImplementation(() => ({ makeToast: jest.fn() }) as any);
    mockCreateVirtualCard.mockResolvedValue({ id: 'vc-1' } as any);
    syncVirtualCardAfterCreate.mockResolvedValue({
      id: 'vc-1',
      status: 'ACTIVE',
      is_default: true,
      type: 'VIRTUAL',
    });
  });

  test('does not create a virtual card when skipCardCreate is enabled for the physical card flow', async () => {
    render(
      <MultiUseVCRulesModal
        next={next}
        toggleModal={toggleModal}
        hasDefaultTerm={true}
        setModalState={setModalState}
        skipCardCreate={true}
        syncVirtualCardAfterCreate={syncVirtualCardAfterCreate}
      />,
    );

    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByLabelText('agree-to-virtual-card-terms-button'));

    await waitFor(() => {
      expect(next).toHaveBeenCalledTimes(1);
    });

    expect(mockCreateVirtualCard).not.toHaveBeenCalled();
    expect(setModalState).not.toHaveBeenCalled();
  });

  test('creates the virtual card immediately when the normal virtual-card flow can skip later steps', async () => {
    render(
      <MultiUseVCRulesModal
        next={next}
        toggleModal={toggleModal}
        hasDefaultTerm={true}
        setModalState={setModalState}
        syncVirtualCardAfterCreate={syncVirtualCardAfterCreate}
      />,
    );

    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByLabelText('agree-to-virtual-card-terms-button'));

    await waitFor(() => {
      expect(mockCreateVirtualCard).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledTimes(1);
    });
  });

  test('stores the synced virtual card returned from the shared refetch before advancing', async () => {
    render(
      <MultiUseVCRulesModal
        next={next}
        toggleModal={toggleModal}
        hasDefaultTerm={true}
        setModalState={setModalState}
        syncVirtualCardAfterCreate={syncVirtualCardAfterCreate}
      />,
    );

    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByLabelText('agree-to-virtual-card-terms-button'));

    await waitFor(() => {
      expect(syncVirtualCardAfterCreate).toHaveBeenCalledWith({ id: 'vc-1' });
      expect(setModalState).toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
    });

    const stateUpdater = setModalState.mock.calls[0][0];
    expect(stateUpdater({})).toEqual({
      shouldRefreshEntity: true,
      virtual_card: {
        id: 'vc-1',
        status: 'ACTIVE',
        is_default: true,
        type: 'VIRTUAL',
      },
    });
  });
});
