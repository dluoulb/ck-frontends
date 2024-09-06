import React from 'react';
import classNames from 'classnames';
import { usePopperTooltip } from 'react-popper-tooltip';

export default function Tooltip({
  children,
  tooltip_text,
  trigger_class,
  container_class,
}) {
  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip({ placement: 'auto' });

  return (
    <span role={Tooltip.role}>
      <span
        ref={setTriggerRef}
        className={classNames(
          'border-b border-dotted border-black',
          trigger_class
        )}
      >
        {children}
      </span>
      {visible && (
        <div
          ref={setTooltipRef}
          {...getTooltipProps({
            className: `shadow-md p-2 rounded-md z-10 block break-words whitespace-normal font-normal normal-case ${container_class}`,
          })}
        >
          {tooltip_text}
        </div>
      )}
    </span>
  );
}

Tooltip.role = 'tooltip-component';
