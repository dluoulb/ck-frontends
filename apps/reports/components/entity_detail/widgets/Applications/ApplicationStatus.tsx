import React from 'react';
import Tooltip from '@components/Tooltip';

export default function ApplicationStatus({ app }) {
  if (app.status === 'new')
    return (
      <div>
        <span className="mr-1 font-normal">Application Status:</span>
        <Tooltip
          tooltip_text="Borrowers receive this status if they never completed the application flow, they had a pending application that was never resolved or they were declined over 6 months ago. If the borrower were to apply again, their application would be treated as a new, first-time application."
          trigger_class="cursor-pointer ml-1.5 capitalize"
          container_class="text-center p-4 px-6 text-sm bg-secondary-blue max-w-sm"
        >
          {app.status}
        </Tooltip>
      </div>
    );

  if (app.tier === 'NETX') {
    let tooltip = (
      <div>
        <p>
          <span className="mr-1 font-normal">Original Status:</span>
          {app.status}
        </p>
        <p>NetX applicants are auto-declined</p>
      </div>
    );

    return (
      <div>
        <span className="mr-1 font-normal">Application Status:</span>
        <Tooltip
          tooltip_text={tooltip}
          trigger_class="cursor-pointer ml-1.5 capitalize"
          container_class="text-center p-4 px-6 text-sm bg-secondary-blue max-w-sm"
        >
          Auto-Declined
        </Tooltip>
      </div>
    );
  }

  return (
    <div role={ApplicationStatus.role}>
      <span className="mr-1 font-normal">Application Status:</span>
      {app.status}
    </div>
  );
}

ApplicationStatus.role = 'application-status-component';
