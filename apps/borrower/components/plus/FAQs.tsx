import React from 'react';

const faqs = [
  {
    question: 'When do I get my cash back?',
    answer:
      'Cash back is applied to your account after your loan is fully paid.',
  },
  {
    question: 'How much can I really earn?',
    answer:
      "If you spend $4,000/month with Credit Key, that's $120 in cash back monthly - or S1,440/year. Your Plus membership pays for itself 4x over!",
  },
  {
    question: 'How do I use my cash back rewards?',
    answer:
      'Your cash back is automatically applied to your account once loans are paid. Use it to reduce future purchase amounts, pay down balances, or redeem for cash back. No complicated system - just real money back in your account.',
  },
  {
    question: 'What counts as an eligible purchase?',
    answer:
      'In-network Credit Key purchases earn 3% back. Virtual card and physical card purchases earn 1% back. Finance fees, subscription payments, and late payments are not eligible for cash back.',
  },
  {
    question: 'Are there Cash Back caps?',
    answer: 'You can earn rewards on $50,000 of eligible spend per year.',
  },
];

export default function FAQs() {
  return (
    <div className="mt-4 flex flex-col gap-4">
      <h3 className="text-lg font-bold">FAQs</h3>
      {faqs.map((faq, index) => (
        <div key={index} className="">
          <div className="font-bold text-sm">{faq.question}</div>
          <div className="text-sm">{faq.answer}</div>
        </div>
      ))}
    </div>
  );
}
