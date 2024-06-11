import React, { FC } from "react";

import spinner from "../lib/images/spinner.svg";

interface LoadingProps {
  className?: string;
  containerClass?: string;
}

const Loading: FC<LoadingProps> = ({ className, containerClass }) => {
  return (
    <div className={`flex justify-center ${containerClass}`} role="loading">
      <img src={spinner} className={`animate-spin ${className}`} />
    </div>
  );
};

export default Loading;
