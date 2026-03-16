import React from 'react';
import { faWarning } from '@fortawesome/pro-regular-svg-icons';
import Link from 'next/link';

import Notification from '@components/Notification';

interface OverdueLoansBannerProps {
  overdueOrders: any[];
  hasOverdueLoans?: boolean;
}

export default function OverdueLoansBanner({
  overdueOrders,
  hasOverdueLoans,
}: OverdueLoansBannerProps) {
  if (!hasOverdueLoans && overdueOrders.length === 0) {
    return null;
  }

  const viewDetailsLink = '/orders';

  const ctaButton = (
    <Link href={viewDetailsLink} className="flex gap-1 items-center font-medium">
      View details
    </Link>
  );

  const notificationProps = {
    icon: faWarning,
    iconBorderColor: 'border-warning',
    textColor: 'text-warning',
    bgColor: 'bg-background-warning',
    ctaButton,
    buttonClass: 'hover:text-warning-dark hover:border-warning-dark',
  };

  // Show a fallback banner if entity.is_past_due is true but no overdue orders were found in the first page
  if (hasOverdueLoans && overdueOrders.length === 0) {
    return (
      <Notification
        {...notificationProps}
        message="You have overdue loans. Please review your account."
      />
    );
  }

  const isMany = overdueOrders.length >= 10;

  let message: React.ReactNode;

  if (!isMany) {
    const isSingle = overdueOrders.length === 1;
    message = (
      <>
        {isSingle ? 'Your loan ' : 'Your loans '}
        {overdueOrders.map((order, i) => (
          <React.Fragment key={order.order_key}>
            <Link href={`/orders/${order.order_key}`} className="underline font-semibold">
              {order.order_key}
            </Link>
            {i < overdueOrders.length - 1 ? ', ' : ''}
          </React.Fragment>
        ))}
        {isSingle ? ' is overdue.' : ' are overdue.'}
      </>
    );
  } else {
    message = `You have ${overdueOrders.length}+ overdue loans.`;
  }

  return <Notification {...notificationProps} message={message} />;
}
