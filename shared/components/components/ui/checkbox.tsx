'use client';

import * as React from 'react';
import { faCheck } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={`size-6 peer border-gray-300 text-primary-blue focus:ring-primary-blue data-[state=checked]:bg-primary-blue data-[state=checked]:border-primary-blue data-[state=checked]:text-white focus-visible:ring-primary-blue focus-visible:ring-2 shrink-0 rounded-md border transition-colors outline-none disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none"
      >
        <FontAwesomeIcon icon={faCheck} className="text-xs" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
