import JsFileDownloader from 'js-file-downloader';

export const getOrder = async (api, id) => {
  const order = await api.get(`/api/orders/${id}`);
  return order?.data.data.attributes;
};

export const getAgreement = (order, token) => {
  const fileUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${order.id}/agreement`;

  const agreementDownload = new JsFileDownloader({
    url: fileUrl,
    autoStart: false,
    contentType: 'application/json',
    headers: [
      { name: 'Accept', value: 'application/json' },
      { name: 'Authorization', value: `Bearer ${token}` },
    ],
  });

  return agreementDownload;
};

export const getTransactions = async (api, id) => {
  const transactions = await api.get(`/api/orders/${id}/transactions`);
  return transactions?.data?.transactions;
};

export const getPaymentSchedule = async (api, id) => {
  const schedule = await api.get(`/api/orders/${id}/schedule`);
  return schedule?.data.payment_schedule;
};
