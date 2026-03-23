import CkaInfo from '@apps/borrower/components/home/widgets/virtual_cards/CkaInfo';
import { companyAmazonExclusive } from '@lib/testing/records';
import { customRender, screen } from '@lib/testing/test-utils';

describe('CkaInfo', () => {
  test('renders CKA link for non-Amazon users', () => {
    customRender(<CkaInfo />);

    expect(screen.getByText('Learn more')).toBeInTheDocument();
  });

  test('returns null for Amazon Exclusive users', () => {
    global.mockedUseEntity.mockImplementation(() => ({
      entity: companyAmazonExclusive,
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    }));

    const { container } = customRender(<CkaInfo />);

    expect(container.innerHTML).toBe('');
  });
});
