import { useEffect, useState } from 'react';
import { faMegaphone } from '@fortawesome/pro-regular-svg-icons';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import axios from 'axios';

import BorrowerOverview from '@apps/borrower/components/home/BorrowerOverview';
import Stats from '@apps/borrower/components/home/Stats';
import { BaseGrid, BaseGridItem } from '@components/BaseGrid';
import NoDataError from '@components/NoDataError';
import Notification from '@components/Notification';
import { useEntity } from '@contexts/EntityContext';
import ExportPaymentHistory from './ExportPaymentHistory';
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

  if (entityError) return <NoDataError tag="borrower" withButton={false} />;

  if (!entity) return;

  return (
    <div
      data-testid="container"
      className="my-4 md:my-6 mx-auto h-full"
      role={BorrowerDashboard.role}
    >
      <div className="mx-2 xl:max-w-[90%] xl:mx-auto h-full">
        <p className="text-2xl md:text-4xl font-bold text-primary capitalize">
          Borrower Dashboard
        </p>
        <Promo />
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
        <div className="relative rounded-md border-t border-x border-border-gray shadow-sm mt-4 md:mt-8">
          <BorrowerOverview />
          <div className="relative my-4 md:my-6">
            <BaseGrid>
              <BaseGridItem gridConfig="!py-2 md:!py-3 col-span-4 row-span-1 !border-gray-200 !border-x-0 !rounded-none !px-2 md:!px-3">
                <Stats />
              </BaseGridItem>

              <Widgets />

              <ActiveOrdersTable />

              <BaseGridItem gridConfig="col-span-5 mx-2 md:mx-3 !py-1 !px-2 mb-2 md:mb-3">
                <ExportPaymentHistory />
              </BaseGridItem>
            </BaseGrid>
          </div>
        </div>
      </div>
    </div>
  );
}

BorrowerDashboard.role = 'borrower-portal-main-dashboard';
