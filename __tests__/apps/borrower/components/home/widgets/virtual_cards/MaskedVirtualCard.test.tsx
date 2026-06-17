/* eslint-disable @next/next/no-img-element */

import MaskedVirtualCard from '@apps/borrower/components/home/widgets/virtual_cards/MaskedVirtualCard';
import CompanyRecord from '@lib/records/company';
import { companyApproved } from '@lib/testing/records';
import { customRender, screen } from '@lib/testing/test-utils';

jest.mock('@apps/borrower/hooks/usePendingAuthorizations', () =>
  jest.fn().mockReturnValue({ pendingAuths: null, pendingAuthsLoading: false }),
);

jest.mock('next/image', () => {
  const MockImage = ({ alt = '', ...props }) => <img alt={alt} {...props} />;
  MockImage.displayName = 'MockImage';
  return MockImage;
});

jest.mock('@components/Tooltip', () => {
  const MockTooltip = ({ children, tooltip_text }) => (
    <span>
      {children}
      <span data-testid="tooltip-text">{tooltip_text}</span>
    </span>
  );
  MockTooltip.displayName = 'MockTooltip';
  return MockTooltip;
});

const virtualCard = {
  id: 'vc-1',
  type: 'VIRTUAL',
  status: 'ACTIVE',
  is_default: true,
  last_four: '1234',
};

const entityWithConsistentLimits = new CompanyRecord({
  ...companyApproved,
  credit_line: { amount: 50000.0, remaining_amount: 6080.0 },
  vc_sub_limits: { limit_amount: '10000', remaining_limit_amount: '5000' },
});

describe('MaskedVirtualCard', () => {
  test('renders the able to spend amount with sublimit', () => {
    global.mockedUseEntity.mockImplementationOnce(() => ({
      entity: entityWithConsistentLimits,
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    }));

    customRender(<MaskedVirtualCard virtualCard={virtualCard} onView={jest.fn()} />);

    expect(screen.getByText(/Able to spend:/i)).toBeInTheDocument();
    expect(screen.getByText(/\$5,000\.00 of \$10,000\.00/)).toBeInTheDocument();
  });

  test('renders the correct tooltip text with dynamic sublimit and credit line values', () => {
    global.mockedUseEntity.mockImplementationOnce(() => ({
      entity: entityWithConsistentLimits,
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    }));

    customRender(<MaskedVirtualCard virtualCard={virtualCard} onView={jest.fn()} />);

    expect(screen.getByTestId('tooltip-text')).toHaveTextContent(
      'Your Credit Key Card gives you access to $10,000.00 of your $50,000.00 credit line.',
    );
  });

  test('renders only the remaining amount when sublimit is missing', () => {
    const entityWithoutSublimit = new CompanyRecord({
      ...companyApproved,
      vc_sub_limits: { limit_amount: null, remaining_limit_amount: '12000' },
    });

    global.mockedUseEntity.mockImplementationOnce(() => ({
      entity: entityWithoutSublimit,
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    }));

    customRender(<MaskedVirtualCard virtualCard={virtualCard} onView={jest.fn()} />);

    expect(screen.getByText(/Able to spend:/i)).toBeInTheDocument();
    expect(screen.queryByText(/of \$/)).not.toBeInTheDocument();
  });

  test('renders fallback tooltip text when sublimit or credit line is missing', () => {
    const entityWithoutSublimit = new CompanyRecord({
      ...companyApproved,
      vc_sub_limits: { limit_amount: null, remaining_limit_amount: '12000' },
    });

    global.mockedUseEntity.mockImplementationOnce(() => ({
      entity: entityWithoutSublimit,
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    }));

    customRender(<MaskedVirtualCard virtualCard={virtualCard} onView={jest.fn()} />);

    expect(screen.getByTestId('tooltip-text')).toHaveTextContent(
      'The Credit Key Card is issued with its own credit limit, separate from your total trade credit limit.',
    );
  });
});
