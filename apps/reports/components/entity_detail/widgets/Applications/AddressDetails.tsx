import React from 'react';
import Tooltip from '@components/Tooltip';

export default function AddressDetails({
  appAddress,
  type,
  tooltip = false,
  tooltip_text = '',
}) {
  if (!appAddress?.address1 && !tooltip)
    return (
      <div className="mt-2 font-normal">
        <span className="font-semibold capitalize mr-1">{type} Address:</span>
        Not Provided
      </div>
    );

  if (!appAddress?.address1 && tooltip)
    return (
      <div className="mt-2 font-normal">
        <span className="font-semibold capitalize mr-1">{type} Address:</span>
        <Tooltip
          tooltip_text={tooltip_text}
          trigger_class="cursor-pointer"
          container_class="text-center p-4 px-6 text-sm bg-secondary-blue"
        >
          N/A - NetX Applicant
        </Tooltip>
      </div>
    );

  return (
    <div className="mt-2 font-normal" role={AddressDetails.role}>
      <span className="font-semibold">{type} Address:</span>
      <p>{appAddress?.address1}</p>
      <p>{appAddress?.address2}</p>
      <p>
        {appAddress?.city}, {appAddress?.state}{' '}
        {appAddress?.zip.substring(0, 5)}
      </p>
    </div>
  );
}

AddressDetails.role = 'address-details-component';
