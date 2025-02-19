import VCList from '@apps/borrower/components/home/widgets/virtual_cards/VCList';
import { orderC } from '@lib/testing/records';
import { customRender, screen } from '@lib/testing/test-utils';

describe('VC List Component', () => {
  test('renders virtual card data', async () => {
    customRender(<VCList vc_orders={[orderC]} />);

    expect(screen.getAllByText('•••• •••• •••• 1234'));
    expect(screen.getByText('Test Merchant'));
  });
});
