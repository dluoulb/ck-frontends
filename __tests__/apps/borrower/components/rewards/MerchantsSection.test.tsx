import MerchantsSection, {
  selectRandomMerchants,
} from '@apps/borrower/components/rewards/MerchantsSection';
import { getTopCashbackMerchants } from '@lib/actions/merchants';
import { customRender, screen, waitFor } from '@lib/testing/test-utils';

jest.mock('@lib/actions/merchants', () => ({
  ...jest.requireActual('@lib/actions/merchants'),
  getTopCashbackMerchants: jest.fn(),
}));

const mockGetTopCashbackMerchants = getTopCashbackMerchants as jest.MockedFunction<
  typeof getTopCashbackMerchants
>;

afterEach(() => {
  jest.restoreAllMocks();
});

describe('MerchantsSection', () => {
  test('shows loading state while request is in-flight', () => {
    mockGetTopCashbackMerchants.mockReturnValue(new Promise(() => undefined));

    customRender(<MerchantsSection />);

    expect(screen.getByText('Loading merchant offers...')).toBeInTheDocument();
  });

  test('renders nothing when merchant list is empty', async () => {
    mockGetTopCashbackMerchants.mockResolvedValue([]);

    const { container } = customRender(<MerchantsSection />);

    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });

  test('renders merchant cards after load', async () => {
    mockGetTopCashbackMerchants.mockResolvedValue([
      {
        id: '1',
        name: 'Merchant 1',
        description: 'Description 1',
        logoUrl: 'https://cdn.test/merchant-1.png',
        cashbackLabel: '3% cash back',
      },
      {
        id: '2',
        name: 'Merchant 2',
        description: 'Description 2',
        logoUrl: 'https://cdn.test/merchant-2.png',
        cashbackLabel: '4% cash back',
      },
      {
        id: '3',
        name: 'Merchant 3',
        description: 'Description 3',
        logoUrl: 'https://cdn.test/merchant-3.png',
        cashbackLabel: '5% cash back',
      },
      {
        id: '4',
        name: 'Merchant 4',
        description: 'Description 4',
        logoUrl: 'https://cdn.test/merchant-4.png',
        cashbackLabel: '6% cash back',
      },
    ]);

    customRender(<MerchantsSection />);

    await waitFor(() => {
      expect(screen.getByText('Merchant 1')).toBeInTheDocument();
      expect(screen.getByText('Merchant 4')).toBeInTheDocument();
    });

    expect(screen.queryByText('Merchant Offers')).not.toBeInTheDocument();
    expect(screen.getAllByTestId('reward-merchant-card')).toHaveLength(4);
  });

  test('shows error state when merchants cannot be loaded', async () => {
    mockGetTopCashbackMerchants.mockRejectedValue(new Error('API error'));

    customRender(<MerchantsSection />);

    await waitFor(() => {
      expect(screen.getByText('Unable to load merchant offers right now.')).toBeInTheDocument();
    });
  });
});

describe('selectRandomMerchants', () => {
  test('returns exactly 4 merchants from a larger list', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.1);
    const merchants = Array.from({ length: 8 }, (_value, index) => ({
      id: String(index),
      name: `Merchant ${index}`,
      description: `Description ${index}`,
      logoUrl: `https://cdn.test/${index}.png`,
      cashbackLabel: `${index}% cash back`,
    }));

    const selected = selectRandomMerchants(merchants, 4);
    expect(selected).toHaveLength(4);
  });
});
