import MainDashboard from '@apps/reports/components/entity_detail/MainDashboard';
import { ReportsContextProvider } from '@contexts/ReportsContext';
import { getUser } from '@lib/actions/users';
import { companyApproved } from '@lib/testing/records';
import { customRender, screen } from '@lib/testing/test-utils';

jest.mock('@lib/actions/users', () => ({
  getUser: jest.fn(),
}));

describe('Main Dashboard Component', () => {
  beforeEach(() => {
    (getUser as jest.Mock).mockResolvedValue({
      address: '123 Test St',
    });
  });

  test('displays dashboard', async () => {
    customRender(
      <ReportsContextProvider entity={companyApproved} entityLoading={false} content="dashboard">
        <MainDashboard />
      </ReportsContextProvider>,
    );

    const element = await screen.findByRole('main-dashboard-component');
    expect(element).toBeInTheDocument();
  });
});
