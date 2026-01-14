import 'regenerator-runtime/runtime';

import OrderDashboard from '@apps/reports/components/entity_detail/OrderDashboard';
import { ReportsContextProvider } from '@contexts/ReportsContext';
import { companyApproved } from '@lib/testing/records';
import { customRender, screen } from '@lib/testing/test-utils';

jest.mock('@hooks/useOrders');

describe('Order Dashboard Component', () => {
  test('displays dashboard', async () => {
    customRender(
      <ReportsContextProvider entity={companyApproved} entityLoading={false} content="dashboard">
        <OrderDashboard />
      </ReportsContextProvider>,
    );

    const element = await screen.findByRole('order-dashboard-component');
    expect(element).toBeInTheDocument();
  });
});
