import React from 'react';

import Tooltip from '@components/Tooltip';

export default function PendReasons({ app }) {
  const reasonDisplay = () => {
    let reasonString = '';
    if (app.reasons.length > 1) {
      app.reasons.forEach((r) => {
        reasonString += `${r.replaceAll('_', ' ')}, `;
      });
      return reasonString;
    } else {
      return app.reasons;
    }
  };

  if (app?.tier === 'NETX')
    return (
      <div>
        <span className="mr-1 font-normal">Pending/Decline Reasons:</span>
        <Tooltip
          tooltip_text={`Original Reasons: ${reasonDisplay()}`}
          trigger_class="cursor-pointer ml-1.5 font-avenir-book"
          container_class="text-center p-4 px-6 text-sm max-w-sm capitalize font-avenir-book"
        >
          N/A - NetX Applicant
        </Tooltip>
      </div>
    );

  return (
    <div>
      <span className="mr-1 font-normal">Pending/Decline Reasons:</span>
      {!app.reasons.length ? 'None' : reasonDisplay()}
    </div>
  );
}
