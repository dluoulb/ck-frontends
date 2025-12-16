import React from 'react';
import { faWarning } from '@fortawesome/pro-regular-svg-icons';
import Link from 'next/link';

import Notification from '@components/Notification';

interface OverdueLoansBannerProps {
  overdueOrders: any[];
}

export default function OverdueLoansBanner({ overdueOrders }: OverdueLoansBannerProps) {
  if (!overdueOrders || overdueOrders.length === 0) {
    return null;
  }

  const hasMultipleOverdueLoans = overdueOrders.length > 1;
  const overdueCount = overdueOrders.length;

  const orderIds = overdueOrders.map(order => order.order_key).filter(Boolean);
  
  // For single loan, show the id. For 2-5 loans, show all ids. For more than 5, show count to avoid ui clutter.
  let message: string;
  if (overdueCount === 1) {
    message = `Your loan ${orderIds[0]} is overdue.`;
  } else if (overdueCount <= 5) {
    const idsText = orderIds.join(', ');
    message = `Your loans ${idsText} are overdue.`;
  } else {
    message = `You have ${overdueCount} loans that are overdue.`;
  }

  const link = hasMultipleOverdueLoans
    ? '/borrower/orders'
    : `/borrower/orders/${overdueOrders[0].order_key}`;

  const ctaButton = (
    <Link
      href={link}
      className="flex gap-1 items-center font-medium"
    >
      View details
    </Link>
  );

  return (
    <Notification
      icon={faWarning}
      iconBorderColor="border-warning"
      textColor="text-warning"
      bgColor="bg-background-warning"
      message={message}
      ctaButton={ctaButton}
      buttonClass="hover:text-warning-dark hover:border-warning-dark"
    />
  );
}
