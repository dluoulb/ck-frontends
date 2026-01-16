import { screen, waitFor } from '@testing-library/react';
import { usePathname } from 'next/navigation';

import 'regenerator-runtime/runtime';

import EntityDetail from '@apps/reports/components/entity_detail/EntityDetail';
import { ReportsContextProvider } from '@contexts/ReportsContext';
import { getUser } from '@lib/actions/users';
import { companyApproved } from '@lib/testing/records';
import { customRender } from '@lib/testing/test-utils';

(usePathname as jest.Mock).mockReturnValue('/reports/orders/CK-123456');

afterEach(() => {
  jest.clearAllMocks();
});

jest.mock('@lib/actions/users', () => ({
  getUser: jest.fn(),
}));

describe('Entity Detail Page Component', () => {
  beforeEach(() => {
    (getUser as jest.Mock).mockReturnValue(companyApproved.borrower);
  });

  test('displays dashboard', async () => {
    customRender(
      <ReportsContextProvider entity={companyApproved} entityLoading={false} content="dashboard">
        <EntityDetail content="dashboard" setContent={jest.fn()} />
      </ReportsContextProvider>,
    );

    await waitFor(() => screen.getByLabelText('Tabs'));

    const documentsWidget = await screen.findByText('Documents');
    expect(documentsWidget).toBeInTheDocument();
  });

  test('displays orders table', async () => {
    customRender(
      <ReportsContextProvider entity={companyApproved} entityLoading={false} content="dashboard">
        <EntityDetail content="orders" setContent={jest.fn()} />
      </ReportsContextProvider>,
    );

    await waitFor(() => screen.getByLabelText('Tabs'));

    const columnHeaders = screen.getAllByRole('columnheader');
    expect(columnHeaders).toHaveLength(6);

    expect(screen.getByRole('pagination-component'));
  });
});
