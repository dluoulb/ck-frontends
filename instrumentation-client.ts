import posthog from 'posthog-js';

import { initSessionSuppression, posthogBeforeSend } from '@lib/posthog';

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const isInitialized = (posthog as { __loaded?: boolean }).__loaded;

if (token && !isInitialized) {
  const suppressed = initSessionSuppression();

  posthog.init(token, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
    defaults: '2026-05-30',
    person_profiles: 'identified_only',
    autocapture: true,
    before_send: posthogBeforeSend,
    disable_session_recording: suppressed,
    session_recording: {
      maskAllInputs: false,
    },
    debug: process.env.NEXT_PUBLIC_APP_ENV !== 'production',
  });
}
