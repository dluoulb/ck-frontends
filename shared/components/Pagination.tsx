import React, { useState } from 'react';
import {
  faArrowLeftLong,
  faArrowRightLong,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import { pagination } from '@lib/utils/pagination_helpers';

export default function Pagination({
  page,
  rows,
  pageCount,
  previousPage,
  canPreviousPage,
  nextPage,
  canNextPage,
  pageIndex,
  gotoPage,
  pageSize,
  totalRows,
}) {
  const [currentPage, setCurrentPage] = useState(pageIndex + 1);

  const endIndex =
    page && page?.length === pageSize ? currentPage * pageSize : rows.length;
  const startIndex = endIndex - page?.length + 1;

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-2 sm:px-12">
      <div className="w-full sm:w-auto flex flex-col sm:flex-1 sm:flex-row gap-2 sm:gap-0 items-center justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing{' '}
            <span className="font-semibold">
              {!rows.length ? 0 : startIndex}
            </span>{' '}
            to <span className="font-semibold">{endIndex}</span> of{' '}
            <span className="font-semibold">
              {totalRows ? totalRows : rows.length}
            </span>{' '}
            results
          </p>
        </div>
        <nav
          className="isolate inline-flex -space-x-px rounded-md shadow-sm cursor-pointer"
          aria-label="Pagination"
        >
          <button
            onClick={() => {
              previousPage();
              canPreviousPage && setCurrentPage(currentPage - 1);
            }}
            disabled={!canPreviousPage}
            className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white p-1.5 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:opacity-75 disabled:cursor-not-allowed"
          >
            <span className="sr-only">Previous</span>
            <FontAwesomeIcon icon={faArrowLeftLong} className="px-2" />
          </button>
          {pagination(pageIndex, pageCount)?.map((i, idx) => {
            return (
              <a
                key={idx}
                onClick={() => {
                  gotoPage(i - 1);
                  setCurrentPage(i);
                }}
                aria-current="page"
                className={classNames(
                  'relative inline-flex items-center text-sm font-medium border px-4 py-1.5 focus:z-20',
                  currentPage === i
                    ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50"'
                )}
              >
                {i}
              </a>
            );
          })}
          <button
            onClick={() => {
              nextPage();
              canNextPage && setCurrentPage(currentPage + 1);
            }}
            disabled={!canNextPage}
            className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:opacity-75 disabled:cursor-not-allowed"
          >
            <span className="sr-only">Next</span>
            <FontAwesomeIcon icon={faArrowRightLong} className="px-1.5" />
          </button>
        </nav>
      </div>
    </div>
  );
}
