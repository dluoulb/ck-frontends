import { usePathname } from 'next/navigation';

import { act, customRender, screen } from '@lib/testing/test-utils';
import BorrowerIndex from '@pages/borrower/index';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('Borrower Portal Home Page', () => {
  (usePathname as jest.Mock).mockReturnValue('/borrower');
  
  test('displays main dashboard', async () => {
    customRender(<BorrowerIndex />, { withBorrowerProviders: true });

    act(() => {
      expect(screen.getByText('Borrower Dashboard'));
    });
  });
});
