import React from 'react';

import ActivePhysicalCard from '@apps/borrower/components/wallet/physical_card/ActivePhysicalCard';
import { useEntity } from '@contexts/EntityContext';
import CompanyVirtualCardRecord from '@lib/records/company_virtual_card';
import { companyApproved } from '@lib/testing/records';
import { customRender, screen } from '@lib/testing/test-utils';

jest.mock('@contexts/EntityContext');
jest.mock('next/image', () => {
  const MockImage = (props) => <img {...props} />;
  MockImage.displayName = 'MockImage';
  return MockImage;
});
jest.mock('next/script', () => () => null);
jest.mock('@apps/borrower/hooks/useQoloWidget', () => {
  const actual = { iframeReady: false };
  return {
    __esModule: true,
    default: jest.fn(() => ({ ...actual, onWidgetSuccess: jest.fn() })),
    _setIframeReady: (val: boolean) => {
      actual.iframeReady = val;
    },
  };
});

const mockUseEntity = useEntity as jest.MockedFunction<typeof useEntity>;

const mockCard = new CompanyVirtualCardRecord({
  id: 'pc-1',
  type: 'PHYSICAL',
  status: 'ACTIVE',
  is_default: false,
  last_four: '1234',
});

const defaultProps = {
  card: mockCard,
  showWidget: false,
  onShowWidget: jest.fn(),
  onHideWidget: jest.fn(),
};

const mockEntityReturn = (entity) => ({
  entity,
  setEntity: jest.fn(),
  fetchEntity: jest.fn(),
  entityError: null,
  entityLoading: false,
});

describe('ActivePhysicalCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseEntity.mockReturnValue(mockEntityReturn(companyApproved));

    const { _setIframeReady } = require('@apps/borrower/hooks/useQoloWidget');
    _setIframeReady(false);
  });

  test('renders masked card with last four digits when showWidget is false', () => {
    customRender(<ActivePhysicalCard {...defaultProps} showWidget={false} />);

    expect(screen.getByText('Card Number')).toBeInTheDocument();
    expect(screen.getByText('View Card Info')).toBeInTheDocument();
  });

  test('shows Loading... while showWidget is true but iframe is not ready', () => {
    customRender(<ActivePhysicalCard {...defaultProps} showWidget={true} />);

    expect(screen.getByText('Card Number')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('hides View Card Info when iframe is ready', () => {
    const { _setIframeReady } = require('@apps/borrower/hooks/useQoloWidget');
    _setIframeReady(true);

    customRender(<ActivePhysicalCard {...defaultProps} showWidget={true} />);

    expect(screen.queryByText('View Card Info')).not.toBeInTheDocument();
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });
});
