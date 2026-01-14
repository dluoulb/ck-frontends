import React, { FC } from 'react';
import { faSpinnerThird } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

interface OutlineButtonProps {
  ariaLabel?: string;
  buttonText: string;
  buttonColor: string;
  hoverClass: string;
  containerClass?: string;
  icon?: any;
  disabled?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
  isSmall?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const OutlineButton: FC<OutlineButtonProps> = ({
  ariaLabel,
  buttonText,
  buttonColor,
  hoverClass,
  containerClass,
  icon,
  disabled,
  isLoading,
  onClick,
  isSmall,
  type,
}) => {
  return (
    <div className={classNames('flex w-full', containerClass)}>
      <button
        aria-label={ariaLabel}
        className={classNames(
          'w-full font-semibold transition duration-150 ease-in-out cursor-pointer inline-block border mx-auto my-1 sm:my-2 tracking-wider rounded-lg justify-center items-center py-2 px-3',
          buttonColor,
          isSmall ? 'text-xs' : 'text-xs md:text-sm',
          {
            '!cursor-not-allowed !border-disabled !text-disabled': disabled,
          },
          !isLoading && !disabled && hoverClass,
        )}
        type={type || 'submit'}
        role={type || 'submit'}
        onClick={onClick}
        disabled={disabled}
      >
        <div className="flex justify-center items-center">
          <span className="hidden xs:inline">
            {icon && !isLoading && <FontAwesomeIcon icon={icon} className="mr-2" />}
            {isLoading && <FontAwesomeIcon className="mr-2" icon={faSpinnerThird} spin />}
          </span>
          <span>{buttonText}</span>
        </div>
      </button>
    </div>
  );
};

export default OutlineButton;
