import { usePathname } from 'next/navigation';

import BorrowerOverview from '@apps/borrower/components/home/BorrowerOverview';
import { customRender, screen } from '@lib/testing/test-utils';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('Borrower Overview Component', () => {
  (usePathname as jest.Mock).mockReturnValue('/borrower');
  
  test('renders', () => {
    customRender(<BorrowerOverview />, { withBorrowerProviders: true });

    expect(screen.getByRole('status'));
  });
});
