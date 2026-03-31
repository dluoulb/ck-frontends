import React from 'react';

import ActiveVirtualCard from '@apps/borrower/components/wallet/virtual_card/ActiveVirtualCard';
import { useEntity } from '@contexts/EntityContext';
import { getVirtualCardToken } from '@lib/actions/companies';
import CompanyVirtualCardRecord from '@lib/records/company_virtual_card';
import { companyAmazonExclusive, companyApproved } from '@lib/testing/records';
import { act, customRender, fireEvent, screen, waitFor } from '@lib/testing/test-utils';

jest.mock('@contexts/EntityContext');
jest.mock('@lib/actions/companies', () => ({
  ...jest.requireActual('@lib/actions/companies'),
  getVirtualCardToken: jest.fn(),
}));
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
const mockGetVirtualCardToken = getVirtualCardToken as jest.MockedFunction<
  typeof getVirtualCardToken
>;

const mockCard = new CompanyVirtualCardRecord({
  id: 'vc-1',
  type: 'VIRTUAL',
  status: 'ACTIVE',
  is_default: true,
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

describe('ActiveVirtualCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetVirtualCardToken.mockResolvedValue('mock-token');
    mockUseEntity.mockReturnValue(mockEntityReturn(companyApproved));
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: jest.fn().mockResolvedValue(undefined) },
      configurable: true,
    });

    // Reset mock hook state
    const { _setIframeReady } = require('@apps/borrower/hooks/useQoloWidget');
    _setIframeReady(false);
  });

  describe('masked card display', () => {
    test('renders masked card with last four digits when showWidget is false', () => {
      customRender(<ActiveVirtualCard {...defaultProps} showWidget={false} />);

      expect(screen.getByText('Card Number')).toBeInTheDocument();
      expect(screen.getByText('View Card Info')).toBeInTheDocument();
    });

    test('shows Loading... when showWidget is true but iframe is not ready', () => {
      customRender(<ActiveVirtualCard {...defaultProps} showWidget={true} />);

      expect(screen.getByText('Card Number')).toBeInTheDocument();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    test('hides View Card Info when iframe is ready', () => {
      const { _setIframeReady } = require('@apps/borrower/hooks/useQoloWidget');
      _setIframeReady(true);

      customRender(<ActiveVirtualCard {...defaultProps} showWidget={true} />);

      expect(screen.queryByText('View Card Info')).not.toBeInTheDocument();
    });
  });

  describe('loading state', () => {
    test('shows Loading... on button when View Card Info is clicked', async () => {
      mockUseEntity.mockReturnValue(mockEntityReturn(companyApproved));

      customRender(<ActiveVirtualCard {...defaultProps} showWidget={false} />);

      fireEvent.click(screen.getByText('View Card Info'));

      await waitFor(() => {
        expect(screen.getByText('Loading...')).toBeInTheDocument();
      });
    });
  });

  describe('owner name field', () => {
    test('shows owner name for Amazon exclusive borrowers when widget is visible', () => {
      mockUseEntity.mockReturnValue(mockEntityReturn(companyAmazonExclusive));
      const { _setIframeReady } = require('@apps/borrower/hooks/useQoloWidget');
      _setIframeReady(true);

      customRender(<ActiveVirtualCard {...defaultProps} showWidget={true} />);

      expect(screen.getByTestId('owner-name-field')).toBeInTheDocument();
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    test('does not show owner name for non-Amazon borrowers', () => {
      mockUseEntity.mockReturnValue(mockEntityReturn(companyApproved));
      const { _setIframeReady } = require('@apps/borrower/hooks/useQoloWidget');
      _setIframeReady(true);

      customRender(<ActiveVirtualCard {...defaultProps} showWidget={true} />);

      expect(screen.queryByTestId('owner-name-field')).not.toBeInTheDocument();
    });

    test('does not show owner name when widget is hidden', () => {
      mockUseEntity.mockReturnValue(mockEntityReturn(companyAmazonExclusive));

      customRender(<ActiveVirtualCard {...defaultProps} showWidget={false} />);

      expect(screen.queryByTestId('owner-name-field')).not.toBeInTheDocument();
    });

    test('does not show owner name when entity has no borrower', () => {
      const entityNoBorrower = { ...companyAmazonExclusive, borrower: null };
      mockUseEntity.mockReturnValue(mockEntityReturn(entityNoBorrower));
      const { _setIframeReady } = require('@apps/borrower/hooks/useQoloWidget');
      _setIframeReady(true);

      customRender(<ActiveVirtualCard {...defaultProps} showWidget={true} />);

      expect(screen.queryByTestId('owner-name-field')).not.toBeInTheDocument();
    });

    test('shows copy button next to owner name', () => {
      mockUseEntity.mockReturnValue(mockEntityReturn(companyAmazonExclusive));
      const { _setIframeReady } = require('@apps/borrower/hooks/useQoloWidget');
      _setIframeReady(true);

      customRender(<ActiveVirtualCard {...defaultProps} showWidget={true} />);

      expect(screen.getByRole('button', { name: 'Copy cardholder name' })).toBeInTheDocument();
    });
  });

  describe('copy-to-clipboard', () => {
    test('copies owner name to clipboard when copy button is clicked', () => {
      mockUseEntity.mockReturnValue(mockEntityReturn(companyAmazonExclusive));
      const { _setIframeReady } = require('@apps/borrower/hooks/useQoloWidget');
      _setIframeReady(true);

      customRender(<ActiveVirtualCard {...defaultProps} showWidget={true} />);

      fireEvent.click(screen.getByRole('button', { name: 'Copy cardholder name' }));

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Test User');
    });

    test('dims copy button after clicking', async () => {
      mockUseEntity.mockReturnValue(mockEntityReturn(companyAmazonExclusive));
      const { _setIframeReady } = require('@apps/borrower/hooks/useQoloWidget');
      _setIframeReady(true);

      customRender(<ActiveVirtualCard {...defaultProps} showWidget={true} />);

      const copyButton = screen.getByRole('button', { name: 'Copy cardholder name' });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(copyButton.className).toContain('opacity-[0.65]');
      });
    });

    test('restores copy button after 5 seconds', async () => {
      jest.useFakeTimers();

      try {
        mockUseEntity.mockReturnValue(mockEntityReturn(companyAmazonExclusive));
        const { _setIframeReady } = require('@apps/borrower/hooks/useQoloWidget');
        _setIframeReady(true);

        customRender(<ActiveVirtualCard {...defaultProps} showWidget={true} />);

        const copyButton = screen.getByRole('button', { name: 'Copy cardholder name' });
        fireEvent.click(copyButton);

        await waitFor(() => {
          expect(copyButton.className).toContain('opacity-[0.65]');
        });

        await act(async () => {
          jest.advanceTimersByTime(5000);
        });

        expect(copyButton.className).not.toContain('opacity-[0.65]');
      } finally {
        jest.useRealTimers();
      }
    });
  });
});
