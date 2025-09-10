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
  pill?: boolean;
  textSize?: string;
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
  pill,
  textSize,
}) => {
  return (
    <div className={classNames('flex', containerClass)}>
      <button
        aria-label={ariaLabel}
        className={classNames(
          'w-full font-semibold transition duration-150 ease-in-out cursor-pointer mx-auto my-1 sm:my-2 tracking-wider flex justify-center items-center text-white py-1 md:py-2 px-3',
          buttonColor,
          isSmall ? 'text-xs' : textSize ? textSize : 'text-xs md:text-sm',
          { '!cursor-not-allowed !bg-disabled': disabled },
          !isLoading && !disabled ? hoverClass : '',
          pill ? 'rounded-full' : 'rounded-lg',
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
