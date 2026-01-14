import axios from 'axios';

import BorrowerDashboard from '@apps/borrower/components/home/BorrowerDashboard';
import { customRender, screen, waitFor } from '@lib/testing/test-utils';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Main Dashbboard Home Page', () => {
  mockedAxios.get.mockRejectedValue('error retrieving borrower-portal-notice');

  test('renders all dashboard widgets', async () => {
    customRender(<BorrowerDashboard />, { withBorrowerProviders: true });

    // check if borrower overview has loaded
    await waitFor(() => expect(screen.getByText('Widget Maker Co.')));

    const widgets = screen.getAllByRole('base-grid-item-component');
    expect(widgets).toHaveLength(5);
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
});
