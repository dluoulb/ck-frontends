import React from 'react';
import {
  faArrowLeftLong,
  faArrowRightLong,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import { renderPageNumbers } from '@lib/utils/pagination_helpers';

export default function Pagination({ totalCount, table }) {
  const { pageIndex, pageSize: tablePageSize } = table.getState().pagination;

  return (
    <div
      className="normal-case flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
      role={Pagination.role}
    >
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Previous
        </button>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing{' '}
            <span className="font-medium">{pageIndex * tablePageSize + 1}</span>{' '}
            to{' '}
            <span className="font-medium">
              {Math.min((pageIndex + 1) * tablePageSize, totalCount)}
            </span>{' '}
            of <span className="font-medium">{totalCount}</span> results
          </p>
        </div>
        <div>
          <nav
            aria-label="Pagination"
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
          >
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className={classNames(
                'relative inline-flex items-center rounded-l-md px-2 py-2 focus:z-20 focus:outline-offset-0',
                !table.getCanPreviousPage()
                  ? 'cursor-not-allowed text-gray-200 ring-1 ring-inset ring-gray-100'
                  : 'text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-secondary-blue'
              )}
            >
              <span className="sr-only">Previous</span>
              <FontAwesomeIcon icon={faArrowLeftLong} className="px-2" />
            </button>

            {renderPageNumbers(table, pageIndex)}

            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className={classNames(
                'relative inline-flex items-center rounded-r-md px-2 py-2 focus:z-20 focus:outline-offset-0',
                !table.getCanNextPage()
                  ? 'cursor-not-allowed text-gray-200 ring-1 ring-inset ring-gray-100'
                  : 'text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-secondary-blue'
              )}
            >
              <span className="sr-only">Next</span>
              <FontAwesomeIcon icon={faArrowRightLong} className="px-1.5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}

Pagination.role = 'pagination-component';
