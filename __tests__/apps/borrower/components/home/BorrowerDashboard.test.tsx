import BorrowerDashboard from '@apps/borrower/components/home/BorrowerDashboard';
import { companyApproved } from '@lib/testing/records';
import { customRender, screen, waitFor } from '@lib/testing/test-utils';

describe('Main Dashbboard Home Page', () => {
  test('renders all dashboard widgets', async () => {
    customRender(<BorrowerDashboard />, {
      withBorrowerProviders: true,
      user: companyApproved.borrower,
      fetchConfig: { payment_methods: true },
    });

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
    customRender(<BorrowerDashboard />, {
      withBorrowerProviders: true,
      user: companyApproved.borrower,
      fetchConfig: {},
    });

    expect(screen.getByText('No borrower found'));
  });
});
