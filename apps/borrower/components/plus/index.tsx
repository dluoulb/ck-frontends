import React from 'react';
import Benefits from './Benefits';
import FAQs from './FAQs';


export default function Plus() {
  return (
    <div
      data-testid="plus-container"
      className="my-4 md:my-6 mx-auto h-full xl:max-w-[90%]"
      role={Plus.role}
    >
      <h1 className="text-2xl font-bold text-primary capitalize mb-8">
        Credit Key Plus+
      </h1>
      <Benefits />
      <FAQs />
    </div>
  );
}

Plus.role = 'plus-page';
