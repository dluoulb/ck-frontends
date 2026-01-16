import { screen, waitFor } from '@testing-library/react';
import { usePathname } from 'next/navigation';

import EntityOverview from '@apps/reports/components/entity_detail/EntityOverview';
import { ReportsContextProvider } from '@contexts/ReportsContext';
import { companyApproved } from '@lib/testing/records';
import { customRender } from '@lib/testing/test-utils';

(usePathname as jest.Mock).mockReturnValue('/reports/orders/CK-123456');

describe('EntityOverview Component', () => {
  test('renders overview display data', async () => {
    customRender(
      <ReportsContextProvider entity={companyApproved} entityLoading={false} content="dashboard">
        <EntityOverview />
      </ReportsContextProvider>,
    );

    await waitFor(() => screen.getByText('Widget Maker Co.'));

    expect(screen.getByText('Active Orders:'));
    expect(screen.getByRole('status')).toHaveClass('bg-background-success text-success');
  });
});
