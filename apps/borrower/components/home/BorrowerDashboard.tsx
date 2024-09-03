import { useEffect } from 'react';

import AccountDetails from '@apps/borrower/components/home/AccountDetails';
import BorrowerOverview from '@apps/borrower/components/home/BorrowerOverview';
import CompanyOverview from '@apps/borrower/components/home/CompanyOverview';
import Stats from '@apps/borrower/components/home/Stats';
import NoDataError from '@apps/reports/components/NoDataError';
import { BaseGrid, BaseGridItem } from '@components/BaseGrid';
import Loading from '@components/Loading';
import { useBorrowerDeps } from '@contexts';
import ExportPaymentHistory from './ExportPaymentHistory';
import ActiveOrdersTable from './table/ActiveOrdersTable';
import Widgets from './widgets';

export default function BorrowerDashboard() {
  const { type, errors, isLoading } = useBorrowerDeps();

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ENV !== 'development') {
      window.ckLoadZendeskWidget();
    }
  }, []);

  // TODO: TEST WITH A CONSUMER!
  // const getPrimaryWidget = () => {
  //   return type === 'company' ? (
  //     <CompanyOverview company={entity} defaultTerms={defaultTerms} />
  //   ) : (
  //     <AccountDetails account={entity} />
  //   );
  // };

  if (isLoading) return <Loading className="w-14 h-14 my-36" />;

  if (errors.entityError) return <NoDataError tag={type} />;

  return (
    <div
      data-testid="container"
      className="my-4 md:my-6 mx-auto h-full"
      role={BorrowerDashboard.role}
    >
      <div className="mx-2 md:max-w-[90%] md:mx-auto h-full">
        <p className="text-2xl md:text-4xl font-bold text-primary capitalize">
          Borrower Dashboard
        </p>
        <div className="relative rounded-md border-t border-x border-border-gray shadow-sm mt-4 md:mt-8">
          <BorrowerOverview />
          <div className="relative my-4 md:my-6">
            <BaseGrid>
              <BaseGridItem gridConfig="!py-2 md:!py-3 col-span-4 row-span-1 !border-gray-200 !border-x-0 !rounded-none !px-2 md:!px-3">
                <Stats />
              </BaseGridItem>

              <Widgets />

              <BaseGridItem gridConfig="col-span-5 mx-2 md:mx-3 !py-1 !px-2">
                <ExportPaymentHistory />
              </BaseGridItem>
              <ActiveOrdersTable />
            </BaseGrid>
          </div>
        </div>
      </div>
    </div>
  );
}

BorrowerDashboard.role = 'borrower-portal-main-dashboard';
