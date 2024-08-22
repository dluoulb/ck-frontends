import VirtualCard from '@apps/borrower/components/home/widgets/virtual_cards/VirtualCard';
import useOrders from '@hooks/useOrders';
import { companyApproved, orderA, orderB, orderC } from '@lib/testing/records';
import { customRender, screen } from '@lib/testing/test-utils';

jest.mock('@hooks/useOrders');

describe('Virtual Card Widget Component', () => {
  test('displays loading', async () => {
    (useOrders as jest.Mock).mockReturnValue({
      orders: [orderA, orderB, orderC],
      ordersLoading: true,
      ordersError: null,
      pageCount: 1,
      fetchData: jest.fn(),
    });

    customRender(<VirtualCard entity={companyApproved} />);

    expect(screen.getByRole('loading'));
  });

  test('displays VCs if entity has VC orders', async () => {
    (useOrders as jest.Mock).mockReturnValue({
      orders: [orderA, orderB, orderC],
      ordersLoading: false,
      ordersError: null,
      pageCount: 1,
      fetchData: jest.fn(),
    });

    customRender(<VirtualCard entity={companyApproved} />);

    expect(screen.getByText('x1234'));
    expect(screen.getByText('View More Details'));
  });

  test('displays VC info widget if entity DOES NOT have VC orders', async () => {
    (useOrders as jest.Mock).mockReturnValue({
      orders: [],
      ordersLoading: false,
      ordersError: null,
      pageCount: 1,
      fetchData: jest.fn(),
    });

    customRender(<VirtualCard entity={companyApproved} />);

    expect(screen.getByText(/Request a virtual card/));
    expect(screen.getByText('Learn More'));
  });
});
