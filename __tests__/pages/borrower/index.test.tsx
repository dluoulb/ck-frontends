import SideNav from '@components/layout/SideNav';
import { companyApproved } from '@lib/testing/records';
import { act, customRender, screen } from '@lib/testing/test-utils';
import BorrowerIndex from '@pages/borrower/index';

describe('Borrower Portal Home Page', () => {
  test('displays portal layout', async () => {
    const primaryRoutes = [
      { name: 'Home', url: '/borrower' },
      { name: 'Orders', url: '/borrower/orders' },
      { name: 'Help Center', url: '/support' },
    ];

    customRender(<SideNav primaryRoutes={primaryRoutes} />, {
      withBorrowerProviders: true,
      user: companyApproved.borrower,
      fetchConfig: {},
    });

    act(() => {
      // check if Sidenav has loaded
      expect(screen.getByText('Help Center'));
    });
  });

  test('displays main dashboard', async () => {
    customRender(<BorrowerIndex />, {
      withBorrowerProviders: true,
      user: companyApproved.borrower,
      fetchConfig: {},
    });

    act(() => {
      // check if dashboard has loaded
      expect(screen.getByText('Borrower Dashboard'));
    });
  });
});
