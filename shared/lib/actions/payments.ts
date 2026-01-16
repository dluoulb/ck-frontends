export const createLoanPayment = (api, payment) => {
  return api.post('/api/payments', { payment });
};

export const createPaymentPlanPayment = (api, payment) => {
  return api.post('/api/pi4/payments', { payment });
};

export const exportPaymentHistory = async ({ api, userId, startDate, endDate }) => {
  if (!userId) return;
  const params = `user_id=${userId}&start_date=${startDate}&end_date=${endDate}`;

  return await api.get(`/api/payments/export?${params}`);
};
