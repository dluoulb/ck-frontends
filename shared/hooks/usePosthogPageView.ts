import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { useUser } from '@contexts/UserContext';
import { captureEvent } from '@lib/posthog';

export const usePosthogPageView = () => {
  const router = useRouter();
  const { isImpersonating, isAdminUser } = useUser();

  useEffect(() => {
    if (isAdminUser || isImpersonating) return;

    captureEvent('portal_page_viewed', { page_name: router.pathname });
  }, [router.pathname, isImpersonating, isAdminUser]);
};
