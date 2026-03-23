import HowToUseModal from '@apps/borrower/components/wallet/virtual_card/HowToUseModal';
import { companyAmazonExclusive } from '@lib/testing/records';
import { customRender, screen } from '@lib/testing/test-utils';

describe('HowToUseModal', () => {
  const defaultProps = {
    isModalActive: true,
    toggleModal: jest.fn(),
  };

  test('shows Discover Merchants section for non-Amazon users', () => {
    customRender(<HowToUseModal {...defaultProps} />);

    expect(screen.getByText('3. Discover Merchants')).toBeInTheDocument();
    expect(screen.getByText('Discover Merchants →')).toBeInTheDocument();
  });

  test('hides Discover Merchants section for Amazon Exclusive users', () => {
    global.mockedUseEntity.mockImplementation(() => ({
      entity: companyAmazonExclusive,
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    }));

    customRender(<HowToUseModal {...defaultProps} />);

    expect(screen.queryByText('3. Discover Merchants')).not.toBeInTheDocument();
    expect(screen.queryByText('Discover Merchants →')).not.toBeInTheDocument();
  });

  test('still shows other steps for Amazon Exclusive users', () => {
    global.mockedUseEntity.mockImplementation(() => ({
      entity: companyAmazonExclusive,
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    }));

    customRender(<HowToUseModal {...defaultProps} />);

    expect(screen.getByText('1. Download the iOS or Android App')).toBeInTheDocument();
    expect(
      screen.getByText("2. Add Card to your phone's digital wallet manually"),
    ).toBeInTheDocument();
  });
});
