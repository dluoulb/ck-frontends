import {
  faCircleCheck,
  faCircleXmark,
} from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import toast from 'react-hot-toast';

export default function useToast() {
  const makeToast = (msg, type) => {
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
            type === 'success' ? 'bg-background-success' : 'bg-background-error'
          )}
        >
          <div className="flex items-start gap-2">
            <FontAwesomeIcon
              icon={type === 'success' ? faCircleCheck : faCircleXmark}
              className={classNames(
                'mt-1',
                type === 'success' ? 'text-success' : 'text-error'
              )}
            />
            <p
              className={classNames(
                'text-sm',
                type === 'success' ? 'text-success' : 'text-error'
              )}
            >
              {msg}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return {
    makeToast,
  };
}
