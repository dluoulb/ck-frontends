import { useContext, useEffect } from 'react';

import AccountDetails from '@apps/borrower/components/home/AccountDetails';
import CompanyOverview from '@apps/borrower/components/home/CompanyOverview';
import DefaultSettings from '@apps/borrower/components/home/DefaultSettings';
import EntityOverview from '@apps/borrower/components/home/EntityOverview';
import Stats from '@apps/borrower/components/home/Stats';
import SupportWidget from '@apps/borrower/components/home/widgets/SupportWidget';
import PortalLayout from '@apps/borrower/components/PortalLayout';
import useBorrowerDependencies from '@apps/borrower/hooks/useBorrowerDependencies';
import { BaseGrid, BaseGridItem } from '@apps/reports/components/BaseGrid';
import NoDataError from '@apps/reports/components/NoDataError';
import Loading from '@components/Loading';
import Scripts from '@components/Scripts';
import { UserContext } from '@contexts';

export default function Borrower() {
  const { user } = useContext(UserContext);
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ENV !== 'development') {
      window.ckLoadZendeskWidget();
    }
  }, []);

  const {
    userProps: { type, entity, errors, stats, paymentMethods, isLoading },
  } = useBorrowerDependencies(user);

  const getPrimaryWidget = () => {
    return type === 'company' ? (
      <CompanyOverview company={entity} />
    ) : (
      <AccountDetails account={entity} />
    );
  };

  if (isLoading) return <Loading className="w-14 h-14 my-36" />;

  if (errors.entityError) return <NoDataError tag={type} />;

  return (
    <>
      <Scripts />
      <PortalLayout>
        <div data-testid="container" className="my-4 md:my-6 mx-auto h-full">
          <div className="mx-2 md:max-w-[90%] md:mx-auto">
            <p className="text-2xl md:text-4xl font-bold text-primary capitalize">
              Borrower Dashboard
            </p>
            <div className="relative rounded-t-md border-t border-x border-border-gray shadow-sm mt-4 md:mt-8 sm:pb-16">
              <EntityOverview entity={entity} type={type} />
              <div className="relative my-6 sm:pb-16">
                <BaseGrid>
                  <BaseGridItem gridConfig="col-span-4 row-span-1 !border-gray-200 !border-x-0 !rounded-none">
                    <Stats entity={entity} stats={stats} errors={errors} />
                  </BaseGridItem>

                  <BaseGridItem gridConfig="col-span-2 !bg-primary-blue/10 ml-3 mr-1.5">
                    {/* {getPrimaryWidget()} */}
                    <DefaultSettings
                      entity={entity}
                      paymentMethods={paymentMethods}
                    />
                  </BaseGridItem>

                  <BaseGridItem gridConfig="col-span-2 !bg-tertiary-gray/20 mr-3 ml-1.5">
                    <SupportWidget />
                  </BaseGridItem>
                  <BaseGridItem gridConfig="md:col-span-5">
                    {/* <Applications props={props} /> */}
                    widgets
                  </BaseGridItem>

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
      </PortalLayout>
    </>
  );
}
