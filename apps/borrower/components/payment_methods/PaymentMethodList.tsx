import React, { useState } from 'react';
import { faEllipsisVertical } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MenuItem } from '@headlessui/react';

import { Dropdown } from '@components/Dropdown';
import Loading from '@components/Loading';
import { DefaultButton } from './DefaultButton';
import { DeleteButton } from './DeleteButton';

export default function PaymentMethodList({ payment_methods }) {
  const [loadingId, setLoadingId] = useState(null);
  const sortedPaymentMethods = payment_methods?.sort(
    (a, b) => (b.is_default ? 1 : 0) - (a.is_default ? 1 : 0),
  );

  return sortedPaymentMethods?.map((pm, idx) => {
    const handleSetLoading = (id) => setLoadingId(id);

    return (
      <div key={idx}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 sm:p-7 w-full">
          <div className="flex flex-col">
            <div className="font-bold text-base sm:text-lg capitalize">
              {pm.payment_type === 'bank_account'
                ? `${pm.bank_name?.toLowerCase() || pm.account_holder?.toLowerCase()}`
                : pm.label}
            </div>
            {pm.payment_type === 'bank_account' && (
              <div className="text-tertiary-gray text-sm capitalize">{pm.account_holder}</div>
            )}
            <div className="text-primary-blue-hover text-sm capitalize">
              {pm.payment_type === 'bank_account'
                ? pm.account_number_masked
                : pm.credit_card_masked}
            </div>
          </div>

          <div className="sm:hidden">
            <div>
              {pm.is_default && (
                <div className="flex items-center gap-1 cursor-pointer mt-4">
                  <p className="font-semibold text-success">My Default</p>
                </div>
              )}
              {loadingId === pm.id ? (
                <Loading className="w-5 h-5" containerClass="max-w-max my-4" />
              ) : (
                <>
                  {!pm.is_default && (
                    <DefaultButton payment_method={pm} setLoading={handleSetLoading} />
                  )}
                  <DeleteButton payment_method={pm} setLoading={handleSetLoading} />
                </>
              )}
            </div>
          </div>

          <div className="hidden sm:inline">
            <div className="flex justify-center items-center">
              {pm.is_default && (
                <p className="text-xs md:text-sm md:mx-3 rounded-md pt-1 pb-1.5 px-4 bg-background-success text-success font-semibold">
                  Default
                </p>
              )}
              {loadingId === pm.id ? (
                <Loading className="w-5 h-5 my-2" />
              ) : (
                <Dropdown button={<FontAwesomeIcon icon={faEllipsisVertical} className="w-4" />}>
                  {!pm.is_default && (
                    <MenuItem>
                      <DefaultButton payment_method={pm} setLoading={handleSetLoading} />
                    </MenuItem>
                  )}
                  <MenuItem>
                    <DeleteButton payment_method={pm} setLoading={handleSetLoading} />
                  </MenuItem>
                </Dropdown>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  });
}
