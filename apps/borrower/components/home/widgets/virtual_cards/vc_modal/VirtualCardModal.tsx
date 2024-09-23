import React from 'react';
import { Formik } from 'formik';
import { useSearchParams } from 'next/navigation';

import usePromo from '@apps/borrower/hooks/usePromo';
import { useEntity } from '@contexts/EntityContext';
import { useUser } from '@contexts/UserContext';
import useApi from '@hooks/useApi';
import { buildRequestPayload, startVirtualCardOrder } from '@lib/actions/ecomm';
import { formatCurrency } from '@lib/utils/formatters';
import VirtualCardForm from './VirtualCardForm';

type FormValues = {
  merchant_name: string;
  merchant_url: string;
  order_amount: string;
  promo_id: string;
  bypass: boolean;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;
export default function VirtualCardModal({ next, setModalState }) {
  const api = useApi();
  const { user } = useUser();
  const { entity } = useEntity();
  const searchParams = useSearchParams();

  const { getPromoFromMerchant } = usePromo();
  const promo_id = searchParams.get('promo_id');
  const activePromo = getPromoFromMerchant(promo_id);

  const onSubmit = async (values) => {
    await startVirtualCardOrder(api, buildRequestPayload(values, user)).then(
      (res) => {
        if (!res) return;

        setModalState(res);
        setTimeout(function () {
          return window.open(res.checkout_url);
        }, 1 * 1000);

        //go to the next modal screen
        next();
      }
    );
  };

  return (
    <div role={VirtualCardModal.role}>
      <Formik
        initialValues={{
          merchant_name: '',
          merchant_url: '',
          order_amount: '',
          promo_id: promo_id,
          bypass: false,
        }}
        validate={async (values) => {
          const errors: FormErrors = {};

          if (!values.merchant_name) errors.merchant_name = '* Required';
          if (!values.merchant_url) errors.merchant_url = '* Required';
          if (!values.order_amount) errors.order_amount = '* Required';

          const amount = parseFloat(
            values.order_amount.replace(/[^.0-9]/g, '')
          );
          if (amount === 0.0 || isNaN(amount)) {
            errors.order_amount = '* Amount must be greater than zero (0)';
          }

          if (amount > entity?.credit_line.remaining_amount) {
            errors.order_amount =
              '* Amount exceeds remaining credit limit. Please lower amount and try again.';
          }

          if (amount > entity?.vc_sub_limits?.remaining_limit_amount) {
            errors.order_amount =
              '* Amount exceeds remaining card limit. Please lower amount and try again.';
          }

          if (
            !values.bypass &&
            activePromo &&
            amount < activePromo.min_order_amount
          ) {
            errors.order_amount = `You need to spend ${formatCurrency(
              activePromo.min_order_amount
            )} to qualify for the 0% for ${activePromo.max_net_duration} day promotion`;
          }

          return errors;
        }}
        onSubmit={onSubmit}
      >
        {(props) => (
          <VirtualCardForm
            {...props}
            onSubmit={onSubmit}
            activePromo={activePromo}
          />
        )}
      </Formik>
    </div>
  );
}

VirtualCardModal.role = 'virtual-card-modal';
