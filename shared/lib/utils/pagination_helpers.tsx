import classNames from 'classnames';

export const renderPageNumbers = (table, pageIndex) => {
  const totalPageCount = table.getPageCount();
  const pages = [];

  const startPage = Math.floor(pageIndex / 6) * 6;
  const endPage = Math.min(startPage + 6, totalPageCount);

  for (let i = startPage; i < endPage; i++) {
    pages.push(
      <button
        key={i}
        onClick={() => table.setPageIndex(i)}
        className={classNames(
          'relative inline-flex items-center px-4 py-2 text-sm font-semibold',
          {
            'bg-primary-blue-hover text-white': i === pageIndex,
            'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50':
              i !== pageIndex,
          }
        )}
      >
        {i + 1}
      </button>
    );
  }

  return pages;
};
