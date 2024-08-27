import React, { FC } from 'react';
import { faSpinnerThird } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

interface PrimaryButtonProps {
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
}

const PrimaryButton: FC<PrimaryButtonProps> = ({
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
}) => {
  return (
    <div className={classNames('flex w-full', containerClass)}>
      <button
        aria-label={ariaLabel}
        className={classNames(
          'w-full font-semibold transition duration-150 ease-in-out cursor-pointer inline-block mx-auto my-1 sm:my-2 tracking-wider rounded-lg flex justify-center items-center border-[1.5px] text-white',
          buttonColor,
          isSmall
            ? 'py-2 px-3 text-xs'
            : 'py-2 sm:py-3 px-4 text-xs md:text-sm',
          { '!cursor-not-allowed !bg-disabled': disabled },
          !isLoading && !disabled ? hoverClass : ''
        )}
        type="submit"
        role="submit"
        onClick={onClick}
        disabled={disabled}
      >
        <div className="flex justify-center items-center">
          <span>
            {icon && !isLoading && (
              <FontAwesomeIcon icon={icon} className="mr-2 hidden sm:inline" />
            )}
            {isLoading && (
              <FontAwesomeIcon className="mr-2" icon={faSpinnerThird} spin />
            )}
          </span>
          <span>{buttonText}</span>
        </div>
      </button>
    </div>
  );
};

export default PrimaryButton;
