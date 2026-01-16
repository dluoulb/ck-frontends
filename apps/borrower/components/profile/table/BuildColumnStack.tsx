import { formatPhoneNumber, normalizePhone } from '@lib/utils/formatters';
import DeleteUserButton from './DeleteUserButton';

export const BuildStack = ({ original }) => {
  return (
    <div className="font-semibold">
      <p className="flex gap-1">
        <span className="block xs:hidden font-medium text-tertiary-gray text-sm">Owner:</span>
        <span className="text-primary-blue-hover lg:text-primary">
          {original.first_name} {original.last_name}
        </span>
      </p>
      <p className="block sm:hidden flex gap-1">
        <span className="font-medium text-tertiary-gray text-sm">Email:</span>
        {original.email}
      </p>
      <p className="block mid:hidden flex gap-1">
        <span className="font-medium text-tertiary-gray text-sm">Phone:</span>
        {formatPhoneNumber(normalizePhone(original.phone))}
      </p>
      <p className="block lg:hidden flex gap-1">
        <span className="font-medium text-tertiary-gray text-sm">Role:</span>
        {original.role === 'borrower' ? 'Primary Owner' : 'Purchaser'}
      </p>
      <div className="block xl:hidden text-error">
        {original.role === 'borrower' ? null : <DeleteUserButton user={original} />}
      </div>
    </div>
  );
};
