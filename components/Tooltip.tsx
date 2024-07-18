import React from 'react';
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
    <>
      <span
        ref={setTriggerRef}
        className={trigger_class}
        style={{ textDecoration: 'underline', textDecorationStyle: 'dotted' }}
      >
        {children}
      </span>
      {visible && (
        <div
          ref={setTooltipRef}
          {...getTooltipProps({
            className: `border border-opaque-navy-border shadow-md p-2 rounded-md z-10 block ${container_class}`,
          })}
        >
          {tooltip_text}
        </div>
      )}
    </>
  );
}
