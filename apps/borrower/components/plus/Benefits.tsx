import React from 'react';
import Image from 'next/image';

import badgePercent from '@lib/images/badge-percent.svg';
import calendarClock from '@lib/images/calendar-clock.svg';
import headset from '@lib/images/headset.svg';
import shieldCheck from '@lib/images/shield-check.svg';

const benefits = [
  {
    title: 'Earn up to 3% Cash Back',
    description:
      'Earn 3% back when you select Credit Key at checkout. Get 1% back everywhere else using your Credit Key Card. Up to $50,000 in eligible spend per year.',
    icon: badgePercent,
  },
  {
    title: 'Pay-in-4 on any purchase',
    description:
      'Split any purchase into 4 interest-free payments, including those on your Credit Key Card.',
    icon: calendarClock,
  },
  {
    title: 'Build Business Credit Faster',
    description:
      'Credit Key will report repayments to major business credit bureaus to help build your business credit.',
    icon: shieldCheck,
  },
  {
    title: 'Premium Support',
    description:
      'Skip the line with priority support. Dedicated phone line and faster response times when you need help.',
    icon: headset,
  },
];

export default function Benefits() {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-bold text-primary">All Credit Key Plus benefits:</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {benefits.map((benefit, index) => (
          <div key={index} className="border border-gray-300 bg-white rounded-md p-6">
            <div className="flex flex-col items-start gap-2">
              <Image src={benefit.icon} alt={`${benefit.title} icon`} width={24} height={24} />
              <div>
                <h4 className="font-bold">{benefit.title}</h4>
                <p className="text-sm mt-2">{benefit.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
