import React from 'react';
import {
  faCheckCircle,
  faFileInvoiceDollar,
  faHourglassClock,
  faShoppingCart,
  faTrashCanXmark,
} from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { startCase } from 'lodash';

import GlobalFilter from '@components/orders_table/GlobalFilter';

const statusTabs = [
  {
    name: 'all',
    icon: faShoppingCart,
    filter_value: '',
  },
  {
    name: 'active',
    icon: faFileInvoiceDollar,
    filter_value: ['funded', 'active'],
  },
  {
    name: 'pending',
    icon: faHourglassClock,
    filter_value: ['created', 'pending'],
  },
  {
    name: 'paid',
    icon: faCheckCircle,
    filter_value: 'paid',
  },
  {
    name: 'canceled',
    icon: faTrashCanXmark,
    filter_value: ['canceled', 'void'],
  },
];

export default function TableHeader({ tableInstance, active, setActive }) {
  const {
    state: { globalFilter },
    setGlobalFilter,
    setFilter,
  } = tableInstance;

  return (
    <div className="mx-4">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <ul className="flex flex-col md:flex-row justify-between md:items-center -mb-px text-sm font-avenir-book text-center text-navy-blue">
          <div className="flex justify-between md:justify-start overflow-x-scroll py-2">
            {statusTabs.map((s, idx) => {
              return (
                <li
                  className="mr-2 cursor-pointer"
                  key={idx}
                  onClick={() => {
                    setActive(s.name);
                    setFilter('product.status', s.filter_value);
                  }}
                >
                  <div
                    className={classNames(
                      'flex items-center gap-1 p-4 rounded-t-lg border-b-2 border-transparent',
                      active === s.name
                        ? 'text-primary-blue border-primary-blue font-medium'
                        : 'hover:text-primary-blue-hover hover:border-primary-blue-hover'
                    )}
                  >
                    <FontAwesomeIcon
                      className="text-base"
                      icon={s.icon}
                    />
                    <span>{startCase(s.name)}</span>
                  </div>
                </li>
              );
            })}
          </div>
          <div className="mt-4 md:mt-0">
            <GlobalFilter
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              defaultPlaceholder="Search Orders"
            />
          </div>
        </ul>
      </div>
    </div>
  );
}
