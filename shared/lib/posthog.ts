import posthog from 'posthog-js';

import CompanyRecord from '@lib/records/company';
import UserRecord from '@lib/records/user';

const isEnabled = !!process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;

export const identifyUser = (
  user: UserRecord | null,
  company: CompanyRecord | null,
  totalOrders?: number,
) => {
  if (!isEnabled || !user?.id) return;

  try {
    posthog.identify(user.id, {
      name: user.full_name,
      companyName: company?.name,
      companyId: company?.id,
      totalOrders,
      tier: company?.tier,
    });
  } catch (error) {
    console.error('Error identifying user with PostHog:', error);
  }
};

export const resetPostHog = () => {
  if (!isEnabled) return;

  try {
    posthog.reset();
  } catch (error) {
    console.error('Error resetting PostHog:', error);
  }
};
