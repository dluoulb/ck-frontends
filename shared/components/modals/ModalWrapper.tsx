import { FC, Fragment } from 'react';
import { faXmark } from '@fortawesome/pro-regular-svg-icons';
import { faSquare } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import classNames from 'classnames';

interface ModalWrapperProps {
  children: React.ReactNode;
  isModalActive: boolean;
  toggleModal: () => void;
  modalHeight?: string;
  header?: any;
  headerIcon?: any;
}

const ModalWrapper: FC<ModalWrapperProps> = ({
  children,
  isModalActive,
  toggleModal,
  modalHeight,
  header,
  headerIcon,
}) => {
  return (
    <div className="hidden">
      <Transition show={isModalActive} as={Fragment}>
        <Dialog onClose={toggleModal} className="relative z-10 !font-manrope">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
          />
          <div className="flex items-end justify-center sm:min-h-screen text-center sm:block">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-400 bg-opacity-75 transition-opacity" />
            </TransitionChild>
            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="fixed inset-0 w-screen sm:w-full p-4 sm:p-0 overflow-y-scroll">
                <div className="flex min-h-full items-center justify-center text-center sm:items-center">
                  <DialogPanel
                    transition
                    className="relative transform overflow-hidden rounded-lg bg-white text-left sm:max-w-lg p-4 shadow-xl transition-all"
                  >
                    {header && (
                      <div className="flex items-center gap-2 border-b border-primary-gray-border pb-2">
                        <span className="fa-layers fa-fw text-4xl lg:text-5xl hidden sm:inline">
                          <FontAwesomeIcon
                            icon={faSquare}
                            className="text-secondary-blue"
                          />
                          <FontAwesomeIcon
                            icon={headerIcon}
                            className="text-primary-blue text-base lg:text-xl"
                          />
                        </span>

                        <div className="font-semibold tracking-wide text-primary-blue-hover md:text-lg lg:text-xl">
                          {header}
                        </div>
                      </div>
                    )}
                    <div className="absolute right-0 top-0 pr-4 sm:pr-5 pt-2 sm:pt-4">
                      <button
                        type="button"
                        onClick={toggleModal}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <span className="sr-only">Close</span>
                        <FontAwesomeIcon
                          icon={faXmark}
                          className="text-xs xs:text-base"
                        />
                      </button>
                    </div>
                    <div
                      className={classNames(
                        'px-4 sm:px-6 sm:py-3 overflow-y-scroll z-10',
                        modalHeight ? modalHeight : 'max-h-modal'
                      )}
                    >
                      {children}
                    </div>
                  </DialogPanel>
                </div>
              </div>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default ModalWrapper;
