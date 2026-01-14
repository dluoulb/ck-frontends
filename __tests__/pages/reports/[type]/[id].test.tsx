import { usePathname } from 'next/navigation';

import { useEntity } from '@contexts/EntityContext';
import { ReportsContextProvider } from '@contexts/ReportsContext';
import { companyApproved, consumerAccount } from '@lib/testing/records';
import { customRender, screen, waitFor } from '@lib/testing/test-utils';
import EntityIndex from '@pages/reports/[type]/[id]';

describe('Entity Detail Page', () => {
  test('displays error page when entity not fetched', async () => {
    (useEntity as jest.Mock).mockReturnValue({
      entity: undefined,
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    });

    customRender(
      <ReportsContextProvider entity={companyApproved} entityLoading={false} content="dashboard">
        <EntityIndex />
      </ReportsContextProvider>,
      {
        routerQuery: {
          id: 'invalid-id',
          type: 'companies',
          content: 'dashboard',
        },
      },
    );

    expect(screen.getByText('No Company found'));
  });

  test('fetches and displays account data', async () => {
    (usePathname as jest.Mock).mockReturnValue('/reports/accounts/456');

    (useEntity as jest.Mock).mockReturnValue({
      entity: consumerAccount,
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    });

    customRender(
      <ReportsContextProvider entity={companyApproved} entityLoading={false} content="dashboard">
        <EntityIndex />
      </ReportsContextProvider>,
      {
        routerQuery: {
          id: consumerAccount.id,
          type: 'accounts',
          content: 'dashboard',
        },
      },
    );

    await waitFor(() => screen.getByTestId('container'));

    const entityName = screen.getByTestId('entity_name');
    expect(entityName).toHaveTextContent('Test User');
  });

  test('fetches and displays company data', async () => {
    (usePathname as jest.Mock).mockReturnValue('/reports/companies/123');

    (useEntity as jest.Mock).mockReturnValue({
      entity: companyApproved,
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    });

    customRender(
      <ReportsContextProvider entity={companyApproved} entityLoading={false} content="dashboard">
        <EntityIndex />
      </ReportsContextProvider>,
      {
        routerQuery: {
          id: companyApproved.id,
          type: 'companies',
          content: 'dashboard',
        },
      },
    );

    await waitFor(() => screen.getByTestId('container'));

    const entityName = screen.getByTestId('entity_name');
    expect(entityName).toHaveTextContent('Widget Maker Co.');
  });
});
