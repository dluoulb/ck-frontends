import React from 'react';
import classNames from 'classnames';

import Loading from '@components/Loading';
import { useReportsDeps } from '@contexts/ReportsContext';
import EntityOverview from './EntityOverview';
import MainDashboard from './MainDashboard';
import OrderDashboard from './OrderDashboard';
import PageNavigation from '../PageNavigation';

export default function EntityDetail({ content, setContent }) {
  const { entity, entityLoading, statsLoading } = useReportsDeps();

  if (entityLoading || statsLoading) {
    return <Loading className="w-14 h-14 my-16" />;
  }

  return (
    <div>
      <PageNavigation entity={entity} order={null} />
      <p className="text-2xl md:text-4xl font-bold text-primary capitalize">
        {entity?.type} Details
      </p>
      <div className="relative rounded-md border-t border-x border-border-gray shadow-sm mt-4 md:mt-8 sm:pb-16 min-h-full">
        <div className="px-6 pt-6">
          <EntityOverview />
        </div>
        <div className="border-b border-primary-gray-border mt-6 md:mt-0">
          <nav className="-mb-px flex space-x-8 cursor-pointer max-w-max mx-6" aria-label="Tabs">
            <div
              onClick={() => setContent('dashboard')}
              className={classNames(
                !content || content === 'dashboard'
                  ? 'border-primary-blue text-primary-blue'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                'whitespace-nowrap border-b-2 pb-4 px-1 text-sm',
              )}
            >
              Dashboard
            </div>
            <div
              onClick={() => setContent('orders')}
              className={classNames(
                content === 'orders'
                  ? 'border-primary-blue text-primary-blue'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                'whitespace-nowrap border-b-2 pb-4 px-1 text-sm',
              )}
            >
              Orders
            </div>
          </nav>
        </div>
        {!content || content === 'dashboard' ? <MainDashboard /> : <OrderDashboard />}
      </div>
    </div>
  );
}
