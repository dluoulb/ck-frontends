import PaymentMethodRecord from '@lib/records/payment_method';

export const getPaymentMethods = async (api, filters = '') => {
  const pms = await api.get(`/api/payment_methods?${filters}`);
  return pms?.data.data.map((p) => {
    return new PaymentMethodRecord(p.attributes);
  });
};

export const updatePaymentMethod = (api, payment_method) => {
  const namespace = payment_method.payment_type === 'card' ? 'pi4' : '';

  return api
    .put(`api/${namespace}/payment_methods/${payment_method.id}`, {
      payment_method,
    })
    .then((res) => {
      return new PaymentMethodRecord(res.data.data);
    });
};

export const deletePaymentMethod = (api, payment_method) => {
  const namespace = payment_method.payment_type === 'card' ? 'pi4/' : '';

  return api.delete(`api/${namespace}payment_methods/${payment_method.id}`, {
    data: {
      payment_method,
    },
  });
};

export const createPaymentMethodBank = (api, payment_method, use_plaid = false) => {
  return api.post('api/payment_methods/bank_account', { payment_method, use_plaid });
};

export const createPaymentMethodPi4Card = (api, payment_method) => {
  return api.post('api/pi4/payment_methods', { payment_method });
};

export const generateBankAgreement = async (api, user) => {
  const agreement = await api.post('/api/payment_methods/0/generate_bank_agreement', {
    user_id: user.id,
  });

  return agreement?.data?.attributes?.data;
};
