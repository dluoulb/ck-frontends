import React, { useState } from 'react';
import classNames from 'classnames';
import { useRouter } from 'next/router';

import EntityOverview from './EntityOverview';
import MainDashboard from './MainDashboard';
import OrderDashboard from './OrderDashboard';
import PageNavigation from '../PageNavigation';

export default function EntityDetail({ props }) {
  const { type, entity } = props;
  const { query } = useRouter();
  const [content, setContent] = useState(query?.content);

  return (
    <div>
      <PageNavigation order={null} type={type} entity={entity} />
      <p className="text-2xl md:text-4xl font-bold text-primary capitalize">
        {type} Details
      </p>
      <div className="relative rounded-t-md border-t border-x border-border-gray shadow-sm mt-4 md:mt-8 sm:pb-16">
        <div className="px-6 pt-6">
          <EntityOverview props={props} />
        </div>
        <div className="border-b border-primary-border-gray mt-6 md:mt-0">
          <nav
            className="-mb-px flex space-x-8 cursor-pointer max-w-max mx-6"
            aria-label="Tabs"
          >
            <div
              onClick={() => setContent('dashboard')}
              className={classNames(
                !content || content === 'dashboard'
                  ? 'border-primary-blue text-primary-blue'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                'whitespace-nowrap border-b-2 pb-4 px-1 text-sm'
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
                'whitespace-nowrap border-b-2 pb-4 px-1 text-sm'
              )}
            >
              Orders
            </div>
          </nav>
        </div>
        {!content || content === 'dashboard' ? (
          <MainDashboard props={props} />
        ) : (
          <OrderDashboard props={props} />
        )}
      </div>
    </div>
  );
}
