import VirtualCard from '@apps/borrower/components/home/widgets/virtual_cards/VirtualCard';
import { customRender, screen } from '@lib/testing/test-utils';

jest.mock('@apps/borrower/components/home/widgets/virtual_cards/MultiUseVirtualCard', () => ({
  __esModule: true,
  default: ({ onActivateVirtualCard }) => (
    <div data-testid="multi-use-virtual-card">
      {onActivateVirtualCard ? 'with-activate-handler' : 'without-activate-handler'}
    </div>
  ),
}));

jest.mock('@apps/borrower/components/home/widgets/virtual_cards/SingleUseVirtualCard', () => ({
  __esModule: true,
  default: () => <div data-testid="single-use-virtual-card" />,
}));

describe('VirtualCard', () => {
  test('renders the single-use virtual card widget for the single-use banner', () => {
    customRender(<VirtualCard bannerName="virtual_card" />, { withBorrowerProviders: true });

    expect(screen.getByTestId('single-use-virtual-card')).toBeInTheDocument();
    expect(screen.queryByTestId('multi-use-virtual-card')).not.toBeInTheDocument();
  });

  test('renders the multi-use virtual card widget for the multi-use banner', () => {
    customRender(<VirtualCard bannerName="multi_use_virtual_card" />, {
      withBorrowerProviders: true,
    });

    expect(screen.getByTestId('multi-use-virtual-card')).toBeInTheDocument();
    expect(screen.queryByTestId('single-use-virtual-card')).not.toBeInTheDocument();
  });

  test('passes through the dashboard activation handler when provided', () => {
    customRender(
      <VirtualCard bannerName="multi_use_virtual_card" onActivateVirtualCard={jest.fn()} />,
      {
        withBorrowerProviders: true,
      },
    );

    expect(screen.getByText('with-activate-handler')).toBeInTheDocument();
  });
});
