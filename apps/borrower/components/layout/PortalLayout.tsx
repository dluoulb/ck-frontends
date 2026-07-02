import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import useAuthorizedRoute from '@apps/borrower/hooks/useAuthorizedRoute';
import NotFound from '@components/NotFound';
import Scripts from '@components/Scripts';
import { usePromo } from '@contexts/PromoContext';
import { useUser } from '@contexts/UserContext';
import { useCustomerIO } from '@hooks/useCustomerio';
import { usePosthogIdentify } from '@hooks/usePosthogIdentify';
import { usePosthogPageView } from '@hooks/usePosthogPageView';
import { setPosthogSessionOptOut } from '@lib/posthog';
import PossessUser from './PossessUser';

declare const window: any;

export default function PortalLayout({ children }) {
  const searchParams = useSearchParams();
  const { isAuthorized } = useAuthorizedRoute();

  const { setPromoId } = usePromo();
  const { isAdminUser, isImpersonating } = useUser();

  useEffect(() => {
    setPosthogSessionOptOut(isAdminUser || isImpersonating);
  }, [isAdminUser, isImpersonating]);

  useCustomerIO();
  usePosthogIdentify();
  usePosthogPageView();

  const promo_id = searchParams.get('promo_id');

  window.zESettings = {
    webWidget: {
      chat: {
        notifications: {
          mobile: {
            disable: true,
          },
        },
      },
    },
  };

  useEffect(() => {
    if (promo_id) {
      setPromoId(promo_id);
    }
  }, []);

  return (
    <div className="flex" role={PortalLayout.role}>
      <Scripts />
      <div className="flex-grow w-full xl:w-portal">
        {(isAdminUser || isImpersonating) && <PossessUser />}
        {isAuthorized ? children : <NotFound />}
      </div>
    </div>
  );
}

PortalLayout.role = 'page-layout-component';
