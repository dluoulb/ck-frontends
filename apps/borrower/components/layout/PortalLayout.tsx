import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import SideNav from '@components/layout/SideNav';
import Scripts from '@components/Scripts';
import { usePromo } from '@contexts/PromoContext';
import { useUser } from '@contexts/UserContext';
import { supportLink } from '@lib/constants/SiteVariables';
import PossessUser from './PossessUser';
import usePrimaryRoutes from '@apps/borrower/hooks/usePrimaryRoutes';

export default function PortalLayout({ children }) {
  const searchParams = useSearchParams();
  const { primaryRoutes } = usePrimaryRoutes();

  const { setPromoId } = usePromo();
  const { isAdminUser, isImpersonating } = useUser();

  const promo_id = searchParams.get('promo_id');

  useEffect(() => {
    if (promo_id) {
      setPromoId(promo_id);
    }
  }, []);

  return (
    <div className="flex" role={PortalLayout.role}>
      <Scripts />
      <SideNav primaryRoutes={primaryRoutes} />
      <div className="flex-grow w-full xl:w-portal ml-0 lg:ml-24 xl:ml-20">
        {(isAdminUser || isImpersonating) && <PossessUser />}
        {children}
      </div>
    </div>
  );
}

PortalLayout.role = 'page-layout-component';
