import { faCircleCheck, faCircleInfo, faCircleXmark } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import toast from 'react-hot-toast';

const toastStyles = {
  success: { icon: faCircleCheck, bgColor: 'bg-background-success', textColor: 'text-success' },
  info: { icon: faCircleInfo, bgColor: 'bg-secondary-blue', textColor: 'text-primary-blue-hover' },
  error: { icon: faCircleXmark, bgColor: 'bg-background-error', textColor: 'text-error' },
};

export default function useToast() {
  const makeToast = (msg, type) => {
    const { icon, bgColor, textColor } = toastStyles[type] ?? toastStyles.error;

    return toast(
      <div
        id="static-example"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        data-mdb-autohide="false"
      >
        <div
          className={classNames(
            'flex justify-between items-center p-3 rounded-md shadow-xl',
            bgColor,
          )}
        >
          <div className="flex items-start gap-2">
            <FontAwesomeIcon icon={icon} className={classNames('mt-0.5', textColor)} />
            <p className={classNames('text-sm', textColor)}>{msg}</p>
          </div>
        </div>
      </div>,
    );
  };

  return {
    makeToast,
  };
}
