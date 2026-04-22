import BorrowerOverview from '@apps/borrower/components/home/BorrowerOverview';
import Stats from '@apps/borrower/components/home/Stats';
import { BaseGrid, BaseGridItem } from '@components/BaseGrid';
import NoDataError from '@components/NoDataError';
import { useEntity } from '@contexts/EntityContext';
import useOrders from '@hooks/useOrders';
import ExportPaymentHistory from './ExportPaymentHistory';
import OverdueLoansBanner from './OverdueLoansBanner';
import Promo from './Promo';
import ActiveOrdersTable from './table/ActiveOrdersTable';
import Widgets from './widgets';

export default function BorrowerDashboard() {
  const { entity, entityError } = useEntity();

  const hasOverdueLoans = entity?.is_past_due ?? false;
  const { orders } = useOrders(entity);
  const overdueOrders = orders?.filter((order) => order?.product?.isPastDue) || [];

  if (entityError) return <NoDataError tag="borrower" withButton={false} />;

  if (!entity) return;

  return (
    <div
      data-testid="container"
      className="my-4 md:my-6 mx-auto h-full"
      role={BorrowerDashboard.role}
    >
      <div className="mx-2 xl:max-w-[90%] xl:mx-auto h-full">
        <p className="text-2xl md:text-3xl font-bold text-primary capitalize pt-3">Dashboard</p>
        <Promo />
        <OverdueLoansBanner overdueOrders={overdueOrders} hasOverdueLoans={hasOverdueLoans} />
        <div className="relative rounded-md">
          <BorrowerOverview />
          <div className="relative my-4 md:my-6">
            <BaseGrid gridContainerClass="grid grid-cols-1 md:grid-cols-6 gap-y-1.5 md:gap-y-3">
              <BaseGridItem gridConfig="border border-border-gray rounded-md col-span-7 row-span-1 !px-2 md:!px-3">
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
