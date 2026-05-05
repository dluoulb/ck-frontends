import React from 'react';
import { DateTime } from 'luxon';

import ActivationModal from '@apps/borrower/components/plus/ActivationModal';
import { useEntity } from '@contexts/EntityContext';
import { useSubscriptionPlans } from '@hooks/useSubscription';
import SubscriptionPlanRecord from '@lib/records/subscription_plan';
import { customRender, screen } from '@lib/testing/test-utils';

jest.mock('@contexts/EntityContext');

jest.mock('@hooks/useSubscription', () => ({
  useSubscriptionPlans: jest.fn(),
}));

jest.mock('@lib/utils/fullstory', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      init: jest.fn(),
      initialized: jest.fn().mockReturnValue(true),
      trackEvent: jest.fn(),
      identifyUser: jest.fn(),
      viewedPlusSubscriptionModalEvent: jest.fn(),
    })),
  };
});

jest.mock('@hooks/useModal', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    isModalActive: false,
    toggleModal: jest.fn(),
  })),
}));

jest.mock('@hooks/usePaymentMethods', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    activePaymentMethods: [{ id: '1', label: 'Card ending in 1234' }],
    refetchPaymentMethods: jest.fn(),
  })),
}));

// Mock luxon DateTime to return a fixed date for consistent testing
const MOCK_NOW = DateTime.fromISO('2026-01-29T00:00:00.000Z');

const mockUseSubscriptionPlans = useSubscriptionPlans as jest.MockedFunction<
  typeof useSubscriptionPlans
>;

const mockUseEntity = useEntity as jest.MockedFunction<typeof useEntity>;

const buildEntityContextMock = (ctaBanners: { name: string; enabled: boolean }[]) => ({
  entity: { id: '123', cta_banners: ctaBanners },
  setEntity: jest.fn(),
  fetchEntity: jest.fn(),
  entityError: null,
  entityLoading: false,
});

describe('ActivationModal with Free Trial', () => {
  const mockToggleModal = jest.fn();
  const mockOnActivate = jest.fn();

  const subscriptionPlansWithFreeTrial: SubscriptionPlanRecord[] = [
    new SubscriptionPlanRecord({
      id: '1',
      name: 'Monthly Plan',
      price: 39.0,
      description: 'Monthly subscription',
      currency: 'USD',
      duration: 30,
      is_active: true,
      created_at: '2024-01-01',
      days_until_first_payment: 30,
    }),
    new SubscriptionPlanRecord({
      id: '2',
      name: 'Annual Plan',
      price: 390.0,
      description: 'Annual subscription',
      currency: 'USD',
      duration: 365,
      is_active: true,
      created_at: '2024-01-01',
      days_until_first_payment: 30,
    }),
  ];

  const subscriptionPlansWithoutFreeTrial: SubscriptionPlanRecord[] = [
    new SubscriptionPlanRecord({
      id: '1',
      name: 'Monthly Plan',
      price: 39.0,
      description: 'Monthly subscription',
      currency: 'USD',
      duration: 30,
      is_active: true,
      created_at: '2024-01-01',
      days_until_first_payment: 0,
    }),
    new SubscriptionPlanRecord({
      id: '2',
      name: 'Annual Plan',
      price: 390.0,
      description: 'Annual subscription',
      currency: 'USD',
      duration: 365,
      is_active: true,
      created_at: '2024-01-01',
      days_until_first_payment: 0,
    }),
  ];

  const subscriptionPlansWithUndefinedTrial: SubscriptionPlanRecord[] = [
    new SubscriptionPlanRecord({
      id: '1',
      name: 'Monthly Plan',
      price: 39.0,
      description: 'Monthly subscription',
      currency: 'USD',
      duration: 30,
      is_active: true,
      created_at: '2024-01-01',
      // days_until_first_payment is intentionally omitted to test backward compatibility
    }),
    new SubscriptionPlanRecord({
      id: '2',
      name: 'Annual Plan',
      price: 390.0,
      description: 'Annual subscription',
      currency: 'USD',
      duration: 365,
      is_active: true,
      created_at: '2024-01-01',
      // days_until_first_payment is intentionally omitted to test backward compatibility
    }),
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Re-establish the DateTime.now() mock for each test
    jest.spyOn(DateTime, 'now').mockReturnValue(MOCK_NOW);
    // Default entity has no ckp_trial_eligible banner
    mockUseEntity.mockReturnValue(
      buildEntityContextMock([{ name: 'virtual_card', enabled: true }]),
    );
  });

  describe('when ckp_trial_eligible banner is enabled and days_until_first_payment > 0', () => {
    beforeEach(() => {
      mockUseEntity.mockReturnValue(
        buildEntityContextMock([{ name: 'ckp_trial_eligible', enabled: true }]),
      );
      mockUseSubscriptionPlans.mockReturnValue({
        subscriptionPlans: subscriptionPlansWithFreeTrial,
        subscriptionPlansError: null,
        subscriptionPlansLoading: false,
        refetchSubscriptionPlans: jest.fn(),
      });
    });

    test('renders free trial badge', () => {
      customRender(
        <ActivationModal
          isModalActive={true}
          createSubscriptionLoading={false}
          toggleModal={mockToggleModal}
          onActivate={mockOnActivate}
        />,
        { withBorrowerProviders: true },
      );

      expect(screen.getByText(/Start with a 30-day free trial/i)).toBeInTheDocument();
      expect(screen.getByText(/No charge until trial ends/i)).toBeInTheDocument();
    });

    test('renders updated authorization text with free trial mention', () => {
      customRender(
        <ActivationModal
          isModalActive={true}
          createSubscriptionLoading={false}
          toggleModal={mockToggleModal}
          onActivate={mockOnActivate}
        />,
        { withBorrowerProviders: true },
      );

      expect(screen.getByText(/after my 30-day free trial/i, { exact: false })).toBeInTheDocument();
    });

    test('renders trial end date text', () => {
      customRender(
        <ActivationModal
          isModalActive={true}
          createSubscriptionLoading={false}
          toggleModal={mockToggleModal}
          onActivate={mockOnActivate}
        />,
        { withBorrowerProviders: true },
      );

      // Expected date is Feb 28, 2026 (30 days after Jan 29, 2026)
      const expectedDate = 'Feb 28, 2026';
      expect(
        screen.getByText(new RegExp(`You won't be charged until your trial ends on`, 'i')),
      ).toBeInTheDocument();
      expect(screen.getByText(new RegExp(expectedDate, 'i'))).toBeInTheDocument();
    });

    test('renders "Start Free Trial" button text', () => {
      customRender(
        <ActivationModal
          isModalActive={true}
          createSubscriptionLoading={false}
          toggleModal={mockToggleModal}
          onActivate={mockOnActivate}
        />,
        { withBorrowerProviders: true },
      );

      expect(screen.getByText('Start Free Trial')).toBeInTheDocument();
    });
  });

  describe('when days_until_first_payment > 0 but ckp_trial_eligible banner is disabled', () => {
    beforeEach(() => {
      mockUseEntity.mockReturnValue(
        buildEntityContextMock([{ name: 'ckp_trial_eligible', enabled: false }]),
      );
      mockUseSubscriptionPlans.mockReturnValue({
        subscriptionPlans: subscriptionPlansWithFreeTrial,
        subscriptionPlansError: null,
        subscriptionPlansLoading: false,
        refetchSubscriptionPlans: jest.fn(),
      });
    });

    test('does not render free trial badge', () => {
      customRender(
        <ActivationModal
          isModalActive={true}
          createSubscriptionLoading={false}
          toggleModal={mockToggleModal}
          onActivate={mockOnActivate}
        />,
        { withBorrowerProviders: true },
      );

      expect(screen.queryByText(/Start with a.*free trial/i)).not.toBeInTheDocument();
    });

    test('renders "Activate Credit Key Plus" button text', () => {
      customRender(
        <ActivationModal
          isModalActive={true}
          createSubscriptionLoading={false}
          toggleModal={mockToggleModal}
          onActivate={mockOnActivate}
        />,
        { withBorrowerProviders: true },
      );

      const elements = screen.getAllByText('Activate Credit Key Plus');
      expect(elements.length).toBeGreaterThanOrEqual(2);
      expect(elements.some((el) => el.tagName === 'SPAN')).toBe(true);
    });

    test('does not render free trial mention in authorization text', () => {
      customRender(
        <ActivationModal
          isModalActive={true}
          createSubscriptionLoading={false}
          toggleModal={mockToggleModal}
          onActivate={mockOnActivate}
        />,
        { withBorrowerProviders: true },
      );

      expect(screen.queryByText(/after my.*free trial/i)).not.toBeInTheDocument();
    });
  });

  describe('when days_until_first_payment > 0 but ckp_trial_eligible banner is missing', () => {
    beforeEach(() => {
      mockUseEntity.mockReturnValue(
        buildEntityContextMock([{ name: 'virtual_card', enabled: true }]),
      );
      mockUseSubscriptionPlans.mockReturnValue({
        subscriptionPlans: subscriptionPlansWithFreeTrial,
        subscriptionPlansError: null,
        subscriptionPlansLoading: false,
        refetchSubscriptionPlans: jest.fn(),
      });
    });

    test('does not render free trial badge', () => {
      customRender(
        <ActivationModal
          isModalActive={true}
          createSubscriptionLoading={false}
          toggleModal={mockToggleModal}
          onActivate={mockOnActivate}
        />,
        { withBorrowerProviders: true },
      );

      expect(screen.queryByText(/Start with a.*free trial/i)).not.toBeInTheDocument();
    });

    test('renders "Activate Credit Key Plus" button text', () => {
      customRender(
        <ActivationModal
          isModalActive={true}
          createSubscriptionLoading={false}
          toggleModal={mockToggleModal}
          onActivate={mockOnActivate}
        />,
        { withBorrowerProviders: true },
      );

      const elements = screen.getAllByText('Activate Credit Key Plus');
      expect(elements.length).toBeGreaterThanOrEqual(2);
      expect(elements.some((el) => el.tagName === 'SPAN')).toBe(true);
    });

    test('does not render free trial mention in authorization text', () => {
      customRender(
        <ActivationModal
          isModalActive={true}
          createSubscriptionLoading={false}
          toggleModal={mockToggleModal}
          onActivate={mockOnActivate}
        />,
        { withBorrowerProviders: true },
      );

      expect(screen.queryByText(/after my.*free trial/i)).not.toBeInTheDocument();
    });
  });

  describe('when days_until_first_payment === 0', () => {
    beforeEach(() => {
      mockUseSubscriptionPlans.mockReturnValue({
        subscriptionPlans: subscriptionPlansWithoutFreeTrial,
        subscriptionPlansError: null,
        subscriptionPlansLoading: false,
        refetchSubscriptionPlans: jest.fn(),
      });
    });

    test('does not render free trial badge', () => {
      customRender(
        <ActivationModal
          isModalActive={true}
          createSubscriptionLoading={false}
          toggleModal={mockToggleModal}
          onActivate={mockOnActivate}
        />,
        { withBorrowerProviders: true },
      );

      expect(screen.queryByText(/Start with a 30-day free trial/i)).not.toBeInTheDocument();
    });

    test('does not render trial end date text', () => {
      customRender(
        <ActivationModal
          isModalActive={true}
          createSubscriptionLoading={false}
          toggleModal={mockToggleModal}
          onActivate={mockOnActivate}
        />,
        { withBorrowerProviders: true },
      );

      expect(
        screen.queryByText(/You won't be charged until your trial ends/i),
      ).not.toBeInTheDocument();
    });

    test('renders "Activate Credit Key Plus" button text', () => {
      customRender(
        <ActivationModal
          isModalActive={true}
          createSubscriptionLoading={false}
          toggleModal={mockToggleModal}
          onActivate={mockOnActivate}
        />,
        { withBorrowerProviders: true },
      );

      const elements = screen.getAllByText('Activate Credit Key Plus');
      // Should find both the title and the button text
      expect(elements.length).toBeGreaterThanOrEqual(2);
      // Verify button text exists (wrapped in span)
      expect(elements.some((el) => el.tagName === 'SPAN')).toBe(true);
    });

    test('does not render free trial mention in authorization text', () => {
      customRender(
        <ActivationModal
          isModalActive={true}
          createSubscriptionLoading={false}
          toggleModal={mockToggleModal}
          onActivate={mockOnActivate}
        />,
        { withBorrowerProviders: true },
      );

      expect(screen.queryByText(/after my.*free trial/i)).not.toBeInTheDocument();
    });
  });

  describe('when days_until_first_payment is undefined', () => {
    beforeEach(() => {
      mockUseSubscriptionPlans.mockReturnValue({
        subscriptionPlans: subscriptionPlansWithUndefinedTrial,
        subscriptionPlansError: null,
        subscriptionPlansLoading: false,
        refetchSubscriptionPlans: jest.fn(),
      });
    });

    test('does not render free trial badge', () => {
      customRender(
        <ActivationModal
          isModalActive={true}
          createSubscriptionLoading={false}
          toggleModal={mockToggleModal}
          onActivate={mockOnActivate}
        />,
        { withBorrowerProviders: true },
      );

      expect(screen.queryByText(/Start with a.*free trial/i)).not.toBeInTheDocument();
    });

    test('renders "Activate Credit Key Plus" button text', () => {
      customRender(
        <ActivationModal
          isModalActive={true}
          createSubscriptionLoading={false}
          toggleModal={mockToggleModal}
          onActivate={mockOnActivate}
        />,
        { withBorrowerProviders: true },
      );

      const elements = screen.getAllByText('Activate Credit Key Plus');
      // Should find both the title and the button text
      expect(elements.length).toBeGreaterThanOrEqual(2);
      // Verify button text exists (wrapped in span)
      expect(elements.some((el) => el.tagName === 'SPAN')).toBe(true);
    });

    test('does not render trial end date text', () => {
      customRender(
        <ActivationModal
          isModalActive={true}
          createSubscriptionLoading={false}
          toggleModal={mockToggleModal}
          onActivate={mockOnActivate}
        />,
        { withBorrowerProviders: true },
      );

      expect(
        screen.queryByText(/You won't be charged until your trial ends/i),
      ).not.toBeInTheDocument();
    });
  });
});
