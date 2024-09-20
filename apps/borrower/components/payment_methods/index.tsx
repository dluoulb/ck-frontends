import React from 'react';
import {
  faBuildingColumns,
  faCircleInfo,
  faCreditCard,
  faPlus,
} from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import PrimaryButton from '@components/buttons/PrimaryButton';
import Loading from '@components/Loading';
import Notification from '@components/Notification';
import Tooltip from '@components/Tooltip';
import { useBorrowerDeps } from '@contexts/BorrowerContext';
import { useEntity } from '@contexts/EntityContext';
import useModal from '@hooks/useModal';
import useUser from '@hooks/useUser';
import PaymentMethodModalWrapper from './modals/PaymentMethodModalWrapper';
import PaymentMethodList from './PaymentMethodList';

export default function PaymentMethods() {
  const { user } = useUser();
  const { entity, entityLoading } = useEntity();
  const { isModalActive, toggleModal } = useModal();
  const { paymentMethods, paymentMethodsLoading, paymentMethodsRefetching } =
    useBorrowerDeps();

  const bank_accounts = paymentMethods?.filter(
    (pm) => pm.payment_type === 'bank_account'
  );

  const cards = paymentMethods?.filter((pm) => pm.payment_type === 'card');

  const checkIsDefault =
    paymentMethods?.find((pm) => pm.is_default) ===
    paymentMethods?.find((pm) => pm.payment_type === 'check');

  if (paymentMethodsLoading || paymentMethodsRefetching || entityLoading)
    return <Loading className="w-14 h-14 my-20" />;

  if (!entity) return;

  return (
    <div
      data-testid="container"
      className="my-4 md:my-6 mx-auto h-full"
      role={PaymentMethods.role}
    >
      <PaymentMethodModalWrapper
        isModalActive={isModalActive}
        toggleModal={toggleModal}
      />
      <div className="mx-2 md:max-w-[90%] md:mx-auto h-full">
        <div className="flex justify-between items-center w-full my-8">
          <p className="text-2xl md:text-4xl font-bold text-primary capitalize">
            Payment Methods
          </p>
          <PrimaryButton
            ariaLabel="add_payment_method_button"
            buttonText="Add new payment method"
            buttonColor="bg-primary-blue"
            hoverClass="hover:bg-primary-blue-hover"
            containerClass="max-w-max"
            onClick={toggleModal}
            icon={faPlus}
            isSmall={true}
          />
        </div>
        <div className="relative rounded-md border-t border-x border-border-gray shadow-sm">
          <div className="flex-1">
            <div className="mx-auto px-4 md:px-0">
              {entity?.type === 'company' && (
                <>
                  <div className="flex items-center gap-2.5 bg-secondary-blue border-b border-primary-gray-border pb-3 py-4 px-6">
                    <FontAwesomeIcon
                      icon={faBuildingColumns}
                      className="text-primary-blue text-base lg:text-xl"
                    />

                    <p className="text-lg md:text-xl font-bold">
                      Bank Accounts
                    </p>
                  </div>
                  <div className="divide-y">
                    <PaymentMethodList payment_methods={bank_accounts} />
                  </div>
                </>
              )}
              {checkIsDefault && (
                <div className="mt-8 md:mt-12 px-7">
                  <div className="my-2 flex items-center text-opaque-navy">
                    <span className="hidden xs:flex xs:mr-2">
                      <FontAwesomeIcon
                        icon={faCircleInfo}
                        className="hidden xs:inline h-4 w-4 xs:pb-0.5"
                      />
                    </span>
                    <div className="text-sm md:text-base tracking-wide">
                      <Tooltip
                        tooltip_text={
                          <>
                            <p>
                              To set a default payment method, click the 3 dots
                            </p>
                            <p>
                              to the right of your preferred payment method and
                              select
                              <span className="font-semibold ml-1">
                                Set as Default
                              </span>
                            </p>
                          </>
                        }
                        trigger_class="pb-2 cursor-pointer"
                        container_class="text-center p-4 px-6 text-sm bg-secondary-blue"
                      >
                        <span>
                          In order to make payments online, please set a default{' '}
                          {user?.hasAccount
                            ? 'bank account or credit card'
                            : 'bank account'}
                          .
                        </span>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* {user?.hasAccount && ( */}
        <div className="relative rounded-md border-t border-x border-border-gray shadow-sm mt-4 md:mt-8">
          <div className="flex-1">
            <div className="mx-auto px-4 md:px-0">
              <div className="flex items-center gap-2.5 bg-secondary-blue border-b border-primary-gray-border pb-3 py-4 px-6">
                <FontAwesomeIcon
                  icon={faCreditCard}
                  className="text-primary-blue text-base lg:text-xl"
                />

                <p className="text-lg md:text-xl font-bold">Credit Cards</p>
              </div>
              {user?.hasCompany &&
                user?.hasAccount &&
                entity?.type === 'company' &&
                cards.length > 0 && (
                  <div className="m-2">
                    <Notification
                      icon={faCircleInfo}
                      textColor="text-primary-blue-hover"
                      bgColor="bg-secondary-blue"
                      headline="Important Notice"
                      ctaButton={<div />}
                      message={
                        <span>
                          You’ve been upgraded to a Credit Key business credit
                          account. <br />
                          Business accounts require use of a bank account as the
                          payment method on all new orders.
                        </span>
                      }
                    />
                  </div>
                )}
              <div className="divide-y">
                <PaymentMethodList payment_methods={cards} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

PaymentMethods.role = 'payment-methods-page';
