import { render, screen, waitFor } from '@testing-library/react';
import { usePathname } from 'next/navigation';

import EntityOverview from '@apps/reports/components/entity_detail/EntityOverview';
import { companyApproved, stats } from '@lib/testing/records';

(usePathname as jest.Mock).mockReturnValue('/reports/orders/CK-123456');

describe('EntityOverview Component', () => {
  test('renders overview display data', async () => {
    let props = {
      type: 'company',
      entity: companyApproved,
      stats: stats,
      errors: {},
    };
    render(<EntityOverview props={props} />);

    await waitFor(() => screen.getByText('Widget Maker Co.'));

    expect(screen.getByText('Active Orders:'));
    expect(screen.getByRole('status')).toHaveClass(
      'bg-background-success text-success'
    );
  });
});
