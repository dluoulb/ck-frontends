import React from 'react';

import DashboardPCSection from '@apps/borrower/components/home/widgets/DashboardPCSection';
import { customRender, fireEvent, screen, waitFor } from '@lib/testing/test-utils';

jest.mock('@apps/borrower/components/wallet/ActivationBenefits', () => {
  const MockActivationBenefits = () => <div>ActivationBenefits</div>;
  MockActivationBenefits.displayName = 'MockActivationBenefits';
  return MockActivationBenefits;
});
jest.mock('@apps/borrower/components/wallet/physical_card/HowToUseModal', () => () => null);
jest.mock('@apps/borrower/components/wallet/physical_card/InactivePhysicalCard', () => {
  const MockInactivePhysicalCard = () => <div>InactivePhysicalCard</div>;
  MockInactivePhysicalCard.displayName = 'MockInactivePhysicalCard';
  return MockInactivePhysicalCard;
});

const mockGetCookie = jest.fn();
const mockSetCookie = jest.fn();

jest.mock('@lib/utils/cookies', () => ({
  getCookie: (...args) => mockGetCookie(...args),
  setCookie: (...args) => mockSetCookie(...args),
}));

describe('DashboardPCSection', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the upsell when the dismiss cookie is absent', async () => {
    mockGetCookie.mockReturnValue(null);

    customRender(<DashboardPCSection />);

    await waitFor(() => {
      expect(screen.getByText('Credit Key Physical Card')).toBeInTheDocument();
    });
  });

  test('hides the upsell when the dismiss cookie is present', () => {
    mockGetCookie.mockReturnValue('true');

    customRender(<DashboardPCSection />);

    expect(screen.queryByText('Credit Key Physical Card')).not.toBeInTheDocument();
  });

  test('hides the upsell and sets cookie when the dismiss button is clicked', async () => {
    mockGetCookie.mockReturnValue(null);

    customRender(<DashboardPCSection />);

    await waitFor(() => {
      expect(screen.getByText('Credit Key Physical Card')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Dismiss physical card upsell' }));

    expect(screen.queryByText('Credit Key Physical Card')).not.toBeInTheDocument();
    expect(mockSetCookie).toHaveBeenCalledWith('hide_physical_card_upsell', 'true', 30);
  });
});
