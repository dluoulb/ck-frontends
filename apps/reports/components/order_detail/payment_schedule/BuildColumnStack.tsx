import { reformatDate } from '@lib/utils/datetime_formatters';
import { formatCurrency } from '@lib/utils/formatters';

export const BuildStack = ({ original }) => {
  const completedStates = ['paid', 'partial'];
  const errorStates = [
    'returned',
    'canceled',
    'error',
    'declined',
    'late',
    'pending/late',
    'partial/late',
    'partial/pending/late',
  ];

  const pendingStates = ['created', 'pending', 'authorized', 'scheduled', 'pending'];

  const getStatusColor = () => {
    if (errorStates.includes(original?.status)) {
      return 'text-error';
    } else if (pendingStates.includes(original?.status)) {
      return 'text-warning';
    } else if (completedStates.includes(original?.status)) {
      return 'text-primary-blue';
    }

    return 'text-secondary-gray';
  };

  return (
    <>
      <p className="font-semibold md:font-normal flex gap-1">
        <span className="md:hidden font-normal">Due date:</span>
        {reformatDate(original.due_date)}
      </p>
      <p className="block sm:hidden font-semibold flex gap-1">
        <span className="font-normal">Payment Total:</span>
        <span className="text-primary-blue-hover">{formatCurrency(original?.total_expected)}</span>
      </p>
      <p className="block md:hidden font-semibold flex gap-1">
        <span className="font-normal">Total Fees:</span>
        {formatCurrency(original?.fees_paid)}
      </p>
      <p className="block sm:hidden font-semibold text-success flex gap-1">
        <span className="font-normal">Principal Paid:</span>
        {formatCurrency(original.principal_paid)}
      </p>
      <p className="flex xs:hidden font-semibold flex gap-1 capitalize">
        <span className="font-normal">Status:</span>
        <span className={getStatusColor()}>{original?.status}</span>
      </p>
    </>
  );
};
