import Widgets from '@apps/borrower/components/home/widgets';
import { companyAmazonExclusive } from '@lib/testing/records';
import { customRender, screen } from '@lib/testing/test-utils';

describe('Widgets Index', () => {
  test('renders all widgets', async () => {
    customRender(<Widgets />, { withBorrowerProviders: true });

    const widgets = screen.getAllByRole('base-grid-item-component');
    expect(widgets).toHaveLength(5);
  });

  describe('AmazonExclusive test group', () => {
    beforeEach(() => {
      global.mockedUseEntity.mockImplementation(() => ({
        entity: companyAmazonExclusive,
        setEntity: jest.fn(),
        fetchEntity: jest.fn(),
        entityError: null,
        entityLoading: false,
      }));
    });

    test('hides Browse Merchants (MarketplaceLink) widget', () => {
      customRender(<Widgets />, { withBorrowerProviders: true });

      expect(screen.queryByText('Browse Merchants')).not.toBeInTheDocument();
    });

    test('hides Upload Invoice (CkaLink) widget', () => {
      customRender(<Widgets />, { withBorrowerProviders: true });

      expect(screen.queryByText('Upload Invoice')).not.toBeInTheDocument();
    });

    test('renders fewer widgets without marketplace and CKA links', () => {
      customRender(<Widgets />, { withBorrowerProviders: true });

      const widgets = screen.getAllByRole('base-grid-item-component');
      expect(widgets).toHaveLength(3);
    });
  });
});
