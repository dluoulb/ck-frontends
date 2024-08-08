import { screen, waitFor } from '@testing-library/react';
import { usePathname } from 'next/navigation';

import 'regenerator-runtime/runtime';

import EntityDetail from '@apps/reports/components/entity_detail/EntityDetail';
import useOrders from '@hooks/useOrders';
import {
  application1,
  application2,
  companyApproved,
  documentA,
  documentB,
  orderA,
  orderB,
  stats,
} from '@lib/testing/records';
import { customRender } from '@lib/testing/test-utils';

jest.mock('@hooks/useOrders');

(usePathname as jest.Mock).mockReturnValue('/reports/orders/CK-123456');

afterEach(() => {
  jest.clearAllMocks();
});

describe('Entity Detail Page Component', () => {
  test('displays dashboard', async () => {
    let props = {
      type: 'company',
      entity: companyApproved,
      applications: [application1, application2],
      documents: [documentA, documentB],
      stats: stats,
      errors: {},
    };
    customRender(
      <EntityDetail props={props} content="dashboard" setContent={jest.fn()} />
    );

    await waitFor(() => screen.getByLabelText('Tabs'));
    expect(screen.getByText('Documents'));
  });

  test('displays orders table', async () => {
    let props = {
      type: 'company',
      entity: companyApproved,
      stats: stats,
      errors: {},
    };
    (useOrders as jest.Mock).mockReturnValue({
      orders: [orderA, orderB],
      ordersLoading: false,
      ordersError: null,
      pageCount: 1,
      fetchData: jest.fn(),
    });

    customRender(
      <EntityDetail props={props} content="orders" setContent={jest.fn()} />
    );

    await waitFor(() => screen.getByLabelText('Tabs'));

    const columnHeaders = screen.getAllByRole('columnheader');
    expect(columnHeaders).toHaveLength(4);

    expect(screen.getByRole('pagination-component'));
  });
});
