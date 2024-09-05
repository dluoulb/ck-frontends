import classNames from 'classnames';

import { formatPhoneNumber } from '@lib/utils/formatters';
import DeleteUserButton from './DeleteUserButton';

export const BuildStack = ({ original }) => {
  return (
    <div className="font-semibold">
      <p>
        <span className="block xs:hidden mr-1 font-medium text-tertiary-gray text-sm">
          Owner:
        </span>
        {original.first_name} {original.last_name}
      </p>
      <p className="block xs:hidden">
        <span className="mr-1 font-medium text-tertiary-gray text-sm">
          Email:
        </span>
        {original.email}
      </p>
      <p className="block sm:hidden">
        <span className="mr-1 font-medium text-tertiary-gray text-sm">
          Phone:
        </span>
        {formatPhoneNumber(original.phone)}
      </p>
      <p className="block lg:hidden">
        <span className="mr-1 font-medium text-tertiary-gray text-sm">
          Role:
        </span>
        {original.role === 'borrower' ? 'Primary Owner' : 'Purchaser'}
      </p>
      <div className="block lg:hidden text-error">
        {original.role === 'borrower' ? null : (
          <DeleteUserButton user={original} />
        )}
      </div>
    </div>
  );
};
