export const exportPaymentHistory = async ({
  api,
  userId,
  startDate,
  endDate,
}) => {
  if (!userId) return;
  const params = `user_id=${userId}&start_date=${startDate}&end_date=${endDate}`;

  return await api.get(`/api/payments/export?${params}`);
};
