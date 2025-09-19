import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import Scripts from '@components/Scripts';
import { useEntity } from '@contexts/EntityContext';
import { usePromo } from '@contexts/PromoContext';
import { useUser } from '@contexts/UserContext';
import { useCustomerIO } from '@hooks/useCustomerio';
import useOrders from '@hooks/useOrders';
import { platform } from '@lib/constants/SiteVariables';
import { fromISO } from '@lib/utils/datetime_formatters';
import PossessUser from './PossessUser';

declare const window: any;

export default function PortalLayout({ children }) {
  const searchParams = useSearchParams();

  const { setPromoId } = usePromo();
  const { isAdminUser, isImpersonating } = useUser();
  const { entity } = useEntity();
  const { totalOrderCount } = useOrders(entity);
  useCustomerIO();

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

  useEffect(() => {
    if (platform() !== 'production') return;
    if (
      entity &&
      totalOrderCount > 0 &&
      entity.type === 'company' &&
      entity.underwriting_status === 'approved' &&
      !isImpersonating
    ) {
      window.delighted.survey({
        email: entity.borrower.email,
        name: entity.borrower.full_name,
        createdAt: fromISO(entity.latest_approval_date)
          .toUTC()
          .toISO({ suppressMilliseconds: true }),
        properties: {
          ckID: entity.id,
          company: entity.name,
          transactions: totalOrderCount,
        },
      });
    }
  }, [entity, totalOrderCount]);

  return (
    <div className="flex" role={PortalLayout.role}>
      <Scripts />
      <div className="flex-grow w-full xl:w-portal">
        {(isAdminUser || isImpersonating) && <PossessUser />}
        {children}
      </div>
    </div>
  );
}

PortalLayout.role = 'page-layout-component';
