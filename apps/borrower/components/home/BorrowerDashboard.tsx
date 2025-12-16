import { useEffect, useState } from 'react';
import { faMegaphone } from '@fortawesome/pro-regular-svg-icons';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import axios from 'axios';

import BorrowerOverview from '@apps/borrower/components/home/BorrowerOverview';
import Stats from '@apps/borrower/components/home/Stats';
import { BaseGrid, BaseGridItem } from '@components/BaseGrid';
import NoDataError from '@components/NoDataError';
import Notification from '@components/Notification';
import { useBorrowerDeps } from '@contexts/BorrowerContext';
import { useEntity } from '@contexts/EntityContext';
import ExportPaymentHistory from './ExportPaymentHistory';
import OverdueLoansBanner from './OverdueLoansBanner';
import Promo from './Promo';
import ActiveOrdersTable from './table/ActiveOrdersTable';
import Widgets from './widgets';

type NotificationData = {
  Active: boolean;
  Title: string;
  Message: any;
};

export default function BorrowerDashboard() {
  const { entity, entityError } = useEntity();
  const { orders } = useBorrowerDeps();
  const [notification, setNotification] = useState<NotificationData | null>(
    null
  );

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

    axios
      .get(
        `${process.env.NEXT_PUBLIC_CMS_BASE_URL}/api/borrower-portal-notice`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      .then((data) => {
        setNotification(data.data.data);
      })
      .catch((err) => [console.log(err)]);
  }, []);

  const overdueOrders = orders?.filter(order => order?.product?.isPastDue) || [];

  if (entityError) return <NoDataError tag="borrower" withButton={false} />;

  if (!entity) return;

  return (
    <div
      data-testid="container"
      className="my-4 md:my-6 mx-auto h-full"
      role={BorrowerDashboard.role}
    >
      <div className="mx-2 xl:max-w-[90%] xl:mx-auto h-full">
        <p className="text-2xl md:text-3xl font-bold text-primary capitalize pt-3">
          Dashboard
        </p>
        <Promo />
        <OverdueLoansBanner overdueOrders={overdueOrders} />
        {notification && notification?.Active && (
          <Notification
            icon={faMegaphone}
            headline={notification?.Title}
            message={
              <div className="space-y-1">
                <BlocksRenderer
                  content={notification?.Message}
                  blocks={{
                    paragraph: ({ children }) => <p>{children}</p>,
                    link: ({ children, url }) => (
                      <a
                        href={url}
                        className="no-underline text-primary-blue cursor-pointer"
                      >
                        {children}
                      </a>
                    ),
                  }}
                />
              </div>
            }
          />
        )}
        <div className="relative rounded-md">
          <BorrowerOverview />
          <div className="relative my-4 md:my-6">
            <BaseGrid gridContainerClass="grid grid-cols-1 md:grid-cols-6 gap-y-1.5 md:gap-y-3">
              <BaseGridItem gridConfig="border border-border-grey rounded-md col-span-7 row-span-1 !px-2 md:!px-3">
                <Stats />
              </BaseGridItem>
              <Widgets />

              <ActiveOrdersTable />

              <div className="col-span-7">
                <ExportPaymentHistory />
              </div>
            </BaseGrid>
          </div>
        </div>
      </div>
    </div>
  );
}

BorrowerDashboard.role = 'borrower-portal-main-dashboard';
