import axios from 'axios';

import BorrowerDashboard from '@apps/borrower/components/home/BorrowerDashboard';
import { companyApproved } from '@lib/testing/records';
import { customRender, screen, waitFor } from '@lib/testing/test-utils';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Main Dashbboard Home Page', () => {
  mockedAxios.get.mockRejectedValue('error retrieving borrower-portal-notice');

  beforeEach(() => {
    global.mockedUseOrders.mockImplementation(() => ({
      orders: [],
      ordersLoading: false,
      isFetching: false,
      ordersError: null,
      pageCount: 1,
    }));
  });

  test('renders all dashboard widgets', async () => {
    customRender(<BorrowerDashboard />, { withBorrowerProviders: true });

    // check if borrower overview has loaded
    await waitFor(() => expect(screen.getByText('Widget Maker Co.')));

    const widgets = screen.getAllByRole('base-grid-item-component');
    expect(widgets).toHaveLength(6);
  });

  test('displays error page when entity not fetched', async () => {
    global.mockedUseEntity.mockImplementation(() => ({
      entity: {},
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: new Error('Entity not found'),
      entityLoading: false,
    }));
    customRender(<BorrowerDashboard />, { withBorrowerProviders: true });

    expect(screen.getByText('No borrower found'));
  });

  describe('overdue loans banner', () => {
    test('does not show banner when entity has no overdue loans', async () => {
      global.mockedUseEntity.mockImplementation(() => ({
        entity: { ...companyApproved, is_past_due: false },
        setEntity: jest.fn(),
        fetchEntity: jest.fn(),
        entityError: null,
        entityLoading: false,
      }));
      global.mockedUseOrders.mockImplementation(() => ({
        orders: [],
        ordersLoading: false,
        isFetching: false,
        ordersError: null,
        pageCount: 1,
      }));

      customRender(<BorrowerDashboard />, { withBorrowerProviders: true });

      await waitFor(() => expect(screen.queryByText(/overdue/i)).not.toBeInTheDocument());
    });

    test('shows banner with linked order ID for 1 overdue loan', async () => {
      global.mockedUseEntity.mockImplementation(() => ({
        entity: { ...companyApproved, is_past_due: true },
        setEntity: jest.fn(),
        fetchEntity: jest.fn(),
        entityError: null,
        entityLoading: false,
      }));
      global.mockedUseOrders.mockImplementation(() => ({
        orders: [{ order_key: 'CK-111111', product: { isPastDue: true } }],
        ordersLoading: false,
        isFetching: false,
        ordersError: null,
        pageCount: 1,
      }));

      customRender(<BorrowerDashboard />, { withBorrowerProviders: true });

      await waitFor(() => {
        expect(screen.getByText(/Your loan/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'CK-111111' })).toHaveAttribute(
          'href',
          '/orders/CK-111111',
        );
        expect(screen.getByText(/is overdue\./)).toBeInTheDocument();
      });
    });

    test('shows banner with linked order IDs for multiple overdue loans (<10)', async () => {
      global.mockedUseEntity.mockImplementation(() => ({
        entity: { ...companyApproved, is_past_due: true },
        setEntity: jest.fn(),
        fetchEntity: jest.fn(),
        entityError: null,
        entityLoading: false,
      }));
      global.mockedUseOrders.mockImplementation(() => ({
        orders: [
          { order_key: 'CK-111111', product: { isPastDue: true } },
          { order_key: 'CK-222222', product: { isPastDue: true } },
          { order_key: 'CK-333333', product: { isPastDue: false } },
        ],
        ordersLoading: false,
        isFetching: false,
        ordersError: null,
        pageCount: 1,
      }));

      customRender(<BorrowerDashboard />, { withBorrowerProviders: true });

      await waitFor(() => {
        expect(screen.getByText(/Your loans/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'CK-111111' })).toHaveAttribute(
          'href',
          '/orders/CK-111111',
        );
        expect(screen.getByRole('link', { name: 'CK-222222' })).toHaveAttribute(
          'href',
          '/orders/CK-222222',
        );
        expect(screen.getByText(/are overdue\./)).toBeInTheDocument();
      });
    });

    test('shows count-only message for 10 or more overdue loans', async () => {
      global.mockedUseEntity.mockImplementation(() => ({
        entity: { ...companyApproved, is_past_due: true },
        setEntity: jest.fn(),
        fetchEntity: jest.fn(),
        entityError: null,
        entityLoading: false,
      }));
      const manyOrders = Array.from({ length: 10 }, (_, i) => ({
        order_key: `CK-${String(i + 1).padStart(6, '0')}`,
        product: { isPastDue: true },
      }));
      global.mockedUseOrders.mockImplementation(() => ({
        orders: manyOrders,
        ordersLoading: false,
        isFetching: false,
        ordersError: null,
        pageCount: 1,
      }));

      customRender(<BorrowerDashboard />, { withBorrowerProviders: true });

      await waitFor(() => {
        expect(screen.getByText('You have 10+ overdue loans.')).toBeInTheDocument();
      });
    });
  });
});
