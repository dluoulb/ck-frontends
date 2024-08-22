import { useContext, useEffect } from 'react';

import AccountDetails from '@apps/borrower/components/home/AccountDetails';
import BorrowerOverview from '@apps/borrower/components/home/BorrowerOverview';
import CompanyOverview from '@apps/borrower/components/home/CompanyOverview';
import Stats from '@apps/borrower/components/home/Stats';
import useBorrowerDependencies from '@apps/borrower/hooks/useBorrowerDependencies';
import NoDataError from '@apps/reports/components/NoDataError';
import { BaseGrid, BaseGridItem } from '@components/BaseGrid';
import Loading from '@components/Loading';
import { UserContext } from '@contexts';
import Widgets from './widgets';

export default function BorrowerDashboard() {
  const { user } = useContext(UserContext);
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ENV !== 'development') {
      window.ckLoadZendeskWidget();
    }
  }, []);

  const {
    userProps: {
      type,
      entity,
      errors,
      stats,
      paymentMethods,
      defaultTerms,
      isLoading,
    },
  } = useBorrowerDependencies(user);

  const getPrimaryWidget = () => {
    return type === 'company' ? (
      <CompanyOverview company={entity} defaultTerms={defaultTerms} />
    ) : (
      <AccountDetails account={entity} />
    );
  };

  if (isLoading) return <Loading className="w-14 h-14 my-36" />;

  if (errors.entityError) return <NoDataError tag={type} />;

  return (
    <div
      data-testid="container"
      className="my-4 md:my-6 mx-auto h-full"
      role={BorrowerDashboard.role}
    >
      <div className="mx-2 md:max-w-[90%] md:mx-auto">
        <p className="text-2xl md:text-4xl font-bold text-primary capitalize">
          Borrower Dashboard
        </p>
        <div className="relative rounded-t-md border-t border-x border-border-gray shadow-sm mt-4 md:mt-8 sm:pb-16">
          <BorrowerOverview entity={entity} type={type} />
          <div className="relative my-6 sm:pb-16">
            <BaseGrid>
              <BaseGridItem gridConfig="col-span-4 row-span-1 !border-gray-200 !border-x-0 !rounded-none">
                <Stats entity={entity} stats={stats} errors={errors} />
              </BaseGridItem>

              <Widgets
                entity={entity}
                paymentMethods={paymentMethods}
                defaultTerms={defaultTerms}
              />

              <BaseGridItem gridConfig="md:col-span-5">
                {/* <Attachments props={props} /> */}
                export payment history
              </BaseGridItem>
              <BaseGridItem gridConfig="md:col-span-5 md:row-span-4">
                {/* <Applications props={props} /> */}
                active orders
              </BaseGridItem>
            </BaseGrid>
          </div>
        </div>
      </div>
    </div>
  );
}

BorrowerDashboard.role = 'borrower-portal-main-dashboard';
