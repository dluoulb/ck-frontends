import BorrowerOverview from '@apps/borrower/components/home/BorrowerOverview';
import { companyApproved } from '@lib/testing/records';
import { customRender, screen } from '@lib/testing/test-utils';

describe('Borrower Overview Component', () => {
  test('renders', () => {
    customRender(<BorrowerOverview />, { withBorrowerProviders: true });

    expect(screen.getByRole('status'));
  });

  describe('Base Rate display', () => {
    test('renders Base Rate when entity has a positive min_rate', async () => {
      global.mockedUseEntity.mockImplementation(() => ({
        entity: { ...companyApproved, min_rate: 1.5 },
        setEntity: jest.fn(),
        fetchEntity: jest.fn(),
        entityError: null,
        entityLoading: false,
      }));

      customRender(<BorrowerOverview />, { withBorrowerProviders: true });

      expect(screen.getByText(/Base Rate/i)).toBeInTheDocument();
    });

    test('hides Base Rate when min_rate is undefined', async () => {
      global.mockedUseEntity.mockImplementation(() => ({
        entity: { ...companyApproved, min_rate: undefined },
        setEntity: jest.fn(),
        fetchEntity: jest.fn(),
        entityError: null,
        entityLoading: false,
      }));

      customRender(<BorrowerOverview />, { withBorrowerProviders: true });

      expect(screen.queryByText(/Base Rate/i)).not.toBeInTheDocument();
    });

    test('renders Base Rate when entity has a 0 min_rate', () => {
      global.mockedUseEntity.mockImplementation(() => ({
        entity: { ...companyApproved, status: 'approved', min_rate: 0 },
        setEntity: jest.fn(),
        fetchEntity: jest.fn(),
        entityError: null,
        entityLoading: false,
      }));

      customRender(<BorrowerOverview />, { withBorrowerProviders: true });

      expect(screen.getByText(/Base Rate/i)).toBeInTheDocument();
      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    test.each([
      ['N/A', 'N/A'],
      ['Infinity', 'Infinity'],
      ['NaN', NaN],
      ['negative number', -1],
    ])('hides Base Rate when min_rate is %s', (_label, min_rate) => {
      global.mockedUseEntity.mockImplementation(() => ({
        entity: { ...companyApproved, min_rate },
        setEntity: jest.fn(),
        fetchEntity: jest.fn(),
        entityError: null,
        entityLoading: false,
      }));

      customRender(<BorrowerOverview />, { withBorrowerProviders: true });

      expect(screen.queryByText(/Base Rate/i)).not.toBeInTheDocument();
    });
  });
});
