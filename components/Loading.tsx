import React, { FC } from "react";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinnerThird } from "@fortawesome/pro-solid-svg-icons";

interface LoadingProps {
  className?: string;
  containerClass?: string;
}

const Loading: FC<LoadingProps> = ({ className, containerClass }) => {
  return (
    <div className={`flex justify-center ${containerClass}`} role="loading">
      <FontAwesomeIcon
        icon={faSpinnerThird}
        className={classNames(
          "text-4xl text-primary-blue animate-spin",
          className
        )}
      />
    </div>
  );
};

export default Loading;
