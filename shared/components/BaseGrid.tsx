import classNames from 'classnames';

function BaseGridItem({ children, gridConfig, ...config }) {
  return (
    <div
      className={classNames(
        'rounded-lg border border-gray-300 bg-white p-3',
        gridConfig
      )}
      role={BaseGridItem.role}
    >
      {children}
    </div>
  );
}

function BaseGrid({ children, gridContainerClass = '' }) {
  return (
    <div
      className={classNames(
        'grid grid-cols-1 md:grid-cols-4 gap-y-1.5 md:gap-y-3',
        gridContainerClass
      )}
      role={BaseGrid.role}
    >
      {children}
    </div>
  );
}

export { BaseGrid, BaseGridItem };

BaseGrid.role = 'base-grid-component';
BaseGridItem.role = 'base-grid-item-component';
