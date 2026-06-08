import React from 'react';

import Banner from '@apps/borrower/components/plus/Banner';
import { useEntity } from '@contexts/EntityContext';
import { useTrialEligibility } from '@hooks/useSubscription';
import { customRender, screen } from '@lib/testing/test-utils';

jest.mock('@contexts/EntityContext');
jest.mock('@hooks/useSubscription', () => ({
  useTrialEligibility: jest.fn(),
}));

const mockUseEntity = useEntity as jest.MockedFunction<typeof useEntity>;
const mockUseTrialEligibility = useTrialEligibility as jest.MockedFunction<
  typeof useTrialEligibility
>;

const buildEntityMock = (id = '123') => ({
  entity: { id } as any,
  setEntity: jest.fn(),
  fetchEntity: jest.fn(),
  entityError: null,
  entityLoading: false,
});

describe('Banner', () => {
  const mockOnJoinClick = jest.fn();

  beforeEach(() => {
    mockUseEntity.mockReturnValue(buildEntityMock());
  });

  test('renders "Join Credit Key Plus" when user is not eligible for free trial', () => {
    mockUseTrialEligibility.mockReturnValue({
      isTrialEligible: false,
      trialEligibilityLoading: false,
    });

    customRender(<Banner onJoinClick={mockOnJoinClick} />);

    expect(screen.getByText('Join Credit Key Plus')).toBeInTheDocument();
    expect(screen.queryByText('Start 30-Day Free Trial')).not.toBeInTheDocument();
  });

  test('renders "Start 30-Day Free Trial" when user is eligible for free trial', () => {
    mockUseTrialEligibility.mockReturnValue({
      isTrialEligible: true,
      trialEligibilityLoading: false,
    });

    customRender(<Banner onJoinClick={mockOnJoinClick} />);

    expect(screen.getByText('Start 30-Day Free Trial')).toBeInTheDocument();
    expect(screen.queryByText('Join Credit Key Plus')).not.toBeInTheDocument();
  });

  test('shows loading spinner while eligibility is being checked', () => {
    mockUseTrialEligibility.mockReturnValue({
      isTrialEligible: false,
      trialEligibilityLoading: true,
    });

    customRender(<Banner onJoinClick={mockOnJoinClick} />);

    expect(document.querySelector('i.fa')).toBeInTheDocument();
  });

  test('calls onJoinClick when button is clicked', () => {
    mockUseTrialEligibility.mockReturnValue({
      isTrialEligible: false,
      trialEligibilityLoading: false,
    });

    customRender(<Banner onJoinClick={mockOnJoinClick} />);

    screen.getByRole('button').click();

    expect(mockOnJoinClick).toHaveBeenCalledTimes(1);
  });

  test('passes entity id to useTrialEligibility', () => {
    mockUseTrialEligibility.mockReturnValue({
      isTrialEligible: false,
      trialEligibilityLoading: false,
    });

    customRender(<Banner onJoinClick={mockOnJoinClick} />);

    expect(mockUseTrialEligibility).toHaveBeenCalledWith('123');
  });

  test('passes empty string to useTrialEligibility when entity is not loaded', () => {
    mockUseEntity.mockReturnValue({
      entity: null,
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: true,
    });
    mockUseTrialEligibility.mockReturnValue({
      isTrialEligible: false,
      trialEligibilityLoading: false,
    });

    customRender(<Banner onJoinClick={mockOnJoinClick} />);

    expect(mockUseTrialEligibility).toHaveBeenCalledWith('');
  });
});
