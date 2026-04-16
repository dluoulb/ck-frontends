import { render } from '@testing-library/react';

import ConfirmMailingAddressModal from '@apps/borrower/components/home/widgets/virtual_cards/vc_modal/ConfirmMailingAddressModal';
import useCompanyPhysicalCard from '@apps/borrower/hooks/useCompanyPhysicalCard';
import { useEntity } from '@contexts/EntityContext';
import { useUser } from '@contexts/UserContext';
import useToast from '@hooks/useToast';
import { createPhysicalCard } from '@lib/actions/companies';
import { fireEvent, screen, waitFor } from '@lib/testing/test-utils';

jest.mock('@apps/borrower/hooks/useCompanyPhysicalCard');
jest.mock('@contexts/EntityContext');
jest.mock('@contexts/UserContext');
jest.mock('@hooks/useApi', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('@hooks/useToast', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('@lib/actions/companies');
jest.mock('@lib/utils/fullstory', () => {
  return jest.fn().mockImplementation(() => ({
    confirmMailingAddressEvent: jest.fn(),
  }));
});

const mockUseCompanyPhysicalCard = useCompanyPhysicalCard as jest.MockedFunction<
  typeof useCompanyPhysicalCard
>;
const mockUseEntity = useEntity as jest.MockedFunction<typeof useEntity>;
const mockUseUser = useUser as jest.MockedFunction<typeof useUser>;
const mockUseToast = useToast as jest.MockedFunction<typeof useToast>;
const mockCreatePhysicalCard = createPhysicalCard as jest.MockedFunction<typeof createPhysicalCard>;

describe('ConfirmMailingAddressModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseEntity.mockReturnValue({
      entity: {
        id: 'company-1',
        address: {
          address1: '123 Main St',
          address2: '',
          city: 'Charlotte',
          state: 'NC',
          zip: '28202',
        },
      } as any,
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    });
    mockUseUser.mockReturnValue({
      user: {
        id: 'user-1',
        first_name: 'Test',
        last_name: 'User',
      } as any,
      setUser: jest.fn(),
      getCurrentUser: jest.fn(),
      isAdminUser: false,
      isImpersonating: false,
    } as any);
    mockUseCompanyPhysicalCard.mockReturnValue({
      physicalCard: null,
      physicalCardError: null,
      physicalCardLoading: false,
      physicalCardRefetching: false,
      refetchPhysicalCard: jest.fn(),
    });
    mockUseToast.mockReturnValue({
      makeToast: jest.fn(),
    } as any);
    mockCreatePhysicalCard.mockResolvedValue({} as any);
  });

  test('requests the physical card without forcing an entity reload', async () => {
    const next = jest.fn();
    const fetchEntity = jest.fn();
    const refetchPhysicalCard = jest.fn();
    const makeToast = jest.fn();
    mockUseEntity.mockReturnValue({
      entity: {
        id: 'company-1',
        address: {
          address1: '123 Main St',
          address2: '',
          city: 'Charlotte',
          state: 'NC',
          zip: '28202',
        },
      } as any,
      setEntity: jest.fn(),
      fetchEntity,
      entityError: null,
      entityLoading: false,
    });
    mockUseCompanyPhysicalCard.mockReturnValue({
      physicalCard: null,
      physicalCardError: null,
      physicalCardLoading: false,
      physicalCardRefetching: false,
      refetchPhysicalCard,
    });
    mockUseToast.mockReturnValue({
      makeToast,
    } as any);

    render(<ConfirmMailingAddressModal next={next} />);

    fireEvent.click(screen.getByRole('submit', { name: 'mail-credit-key-physical-card-button' }));

    await waitFor(() => {
      expect(mockCreatePhysicalCard).toHaveBeenCalledWith(expect.any(Object), 'company-1');
    });

    expect(refetchPhysicalCard).toHaveBeenCalled();
    expect(makeToast).toHaveBeenCalledWith('Credit Key Card Successfully Requested', 'success');
    expect(next).toHaveBeenCalled();
    expect(fetchEntity).not.toHaveBeenCalled();
  });
});
