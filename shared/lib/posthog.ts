import posthog, { type BeforeSendFn } from 'posthog-js';

import CompanyRecord from '@lib/records/company';
import UserRecord from '@lib/records/user';

const isEnabled = !!process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;

const SESSION_START_KEY = 'ck_ph_session_start';
const loginSeenKey = (userId: string) => `ck_ph_login_seen_${userId}`;

let sessionSuppressed = false;

export type PosthogEvent =
  | 'portal_login'
  | 'portal_page_viewed'
  | 'portal_session_ended'
  | 'virtual_card_viewed'
  | 'virtual_card_provisioned'
  | 'physical_card_viewed'
  | 'physical_card_requested'
  | 'rewards_redeemed'
  | 'ck_plus_subscription'
  | 'payment_initiated'
  | 'payment_completed'
  | 'cli_increase_requested'
  | 'agreed_to_card_rules'
  | 'accepted_cardholder_agreement';

export const identifyUser = (
  user: UserRecord | null,
  company: CompanyRecord | null,
  totalOrders?: number,
) => {
  if (!isEnabled || !user?.id) return;

  try {
    posthog.identify(user.id, {
      name: user.full_name,
      email: user.email,
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
  } finally {
    setPosthogSessionOptOut(true);
  }
};

export const captureEvent = (event: PosthogEvent, properties?: Record<string, unknown>) => {
  if (!isEnabled) return;

  try {
    posthog.capture(event, properties);
  } catch (error) {
    console.error('Error capturing PostHog event:', error);
  }
};

// `parentUserId` is set in sessionStorage by usePossessedUser during impersonation,
// so we can suppress before the first autocapture/pageview fires at SDK init.
export const initSessionSuppression = (): boolean => {
  if (typeof window === 'undefined') return false;

  try {
    sessionSuppressed = !!sessionStorage.getItem('parentUserId');
  } catch {
    sessionSuppressed = false;
  }
  return sessionSuppressed;
};

export const posthogBeforeSend: BeforeSendFn = (event) => (sessionSuppressed ? null : event);

export const setPosthogSessionOptOut = (shouldSuppress: boolean) => {
  if (!isEnabled) return;

  sessionSuppressed = shouldSuppress;
  try {
    if (shouldSuppress) {
      posthog.stopSessionRecording();
    } else {
      posthog.startSessionRecording();
    }
  } catch {}
};

export const amountBand = (amount?: number): string => {
  if (amount == null || Number.isNaN(amount)) return 'unknown';
  if (amount < 100) return '0-99';
  if (amount < 500) return '100-499';
  if (amount < 1000) return '500-999';
  if (amount < 5000) return '1000-4999';
  if (amount < 10000) return '5000-9999';
  return '10000+';
};

export const capturePortalLogin = (userId?: string, companyId?: string) => {
  if (!isEnabled || typeof window === 'undefined') return;

  let returning = false;
  try {
    if (userId) {
      returning = localStorage.getItem(loginSeenKey(userId)) === 'true';
      localStorage.setItem(loginSeenKey(userId), 'true');
    }
  } catch {}

  try {
    sessionStorage.setItem(SESSION_START_KEY, Date.now().toString());
  } catch {}

  captureEvent('portal_login', { company_id: companyId, returning });
};

export const capturePortalSessionEnded = () => {
  if (!isEnabled || typeof window === 'undefined') return;

  let sessionDuration: number | undefined;
  try {
    const start = sessionStorage.getItem(SESSION_START_KEY);
    if (start) {
      sessionDuration = Math.round((Date.now() - Number(start)) / 1000);
      sessionStorage.removeItem(SESSION_START_KEY);
    }
  } catch {}

  captureEvent('portal_session_ended', { session_duration: sessionDuration });
};
