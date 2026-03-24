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
    mockGetVirtualCardToken.mockResolvedValue('mock-token');
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: jest.fn().mockResolvedValue(undefined) },
      configurable: true,
    });
  });

  describe('owner name field', () => {
    test('shows owner name for Amazon exclusive borrowers when widget is visible', () => {
      mockUseEntity.mockReturnValue(mockEntityReturn(companyAmazonExclusive));

      customRender(<ActiveVirtualCard {...defaultProps} showWidget={true} />);

      expect(screen.getByTestId('owner-name-field')).toBeInTheDocument();
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    test('does not show owner name for non-Amazon borrowers', () => {
      mockUseEntity.mockReturnValue(mockEntityReturn(companyApproved));

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

      customRender(<ActiveVirtualCard {...defaultProps} showWidget={true} />);

      expect(screen.queryByTestId('owner-name-field')).not.toBeInTheDocument();
    });

    test('shows copy button next to owner name', () => {
      mockUseEntity.mockReturnValue(mockEntityReturn(companyAmazonExclusive));

      customRender(<ActiveVirtualCard {...defaultProps} showWidget={true} />);

      expect(screen.getByRole('button', { name: 'Copy cardholder name' })).toBeInTheDocument();
    });
  });

  describe('copy-to-clipboard', () => {
    test('copies owner name to clipboard when copy button is clicked', () => {
      mockUseEntity.mockReturnValue(mockEntityReturn(companyAmazonExclusive));

      customRender(<ActiveVirtualCard {...defaultProps} showWidget={true} />);

      fireEvent.click(screen.getByRole('button', { name: 'Copy cardholder name' }));

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Test User');
    });

    test('dims copy button after clicking', async () => {
      mockUseEntity.mockReturnValue(mockEntityReturn(companyAmazonExclusive));

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
