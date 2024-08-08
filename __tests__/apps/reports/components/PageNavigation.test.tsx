import { render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';

import PageNavigation from '@apps/reports/components/PageNavigation';
import { companyApproved, orderA } from '@lib/testing/records';

(usePathname as jest.Mock).mockReturnValue('/reports/orders/CK-123456');

describe('Page Navigation Component', () => {
  test('renders', () => {
    render(
      <PageNavigation order={orderA} type="company" entity={companyApproved} />
    );

    const links = screen.getAllByRole('link', { hidden: true });
    expect(links).toHaveLength(3);

    expect(screen.getByText('CK-123456'));
  });
});
