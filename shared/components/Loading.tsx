import React, { FC } from 'react';
import { faSpinnerThird } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

interface LoadingProps {
  className?: string;
  containerClass?: string;
}

const Loading: FC<LoadingProps> = ({ className, containerClass }) => {
  return (
    <div className={`flex justify-center ${containerClass}`} role="loading">
      <FontAwesomeIcon
        icon={faSpinnerThird}
        className={classNames('text-4xl text-primary-blue animate-spin', className)}
      />
    </div>
  );
};

export default Loading;
