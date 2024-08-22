import JsFileDownloader from 'js-file-downloader';

import { addAuthorization, headers } from '@lib/utils/authorization';

export const getOrder = async (api, id) => {
  const order = await api.get(`/api/orders/${id}`);
  return order?.data.data.attributes;
};

export const getOrders = async (api, entity, type, pageIndex) => {
  const path =
    `/api/orders?filter[${type}]=${entity?.id}` +
    `&page=${pageIndex + 1}&per_page=25` +
    `&include=virtual_card_details,payment_schedule`;

  if (entity) {
    const orders = await api.get(path);
    return orders ? orders : [];
  }
};

export const getAgreement = async (order) => {
  const fileUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${order.id}/agreement`;
  const options = await addAuthorization({ headers: {} });

  const agreementDownload = new JsFileDownloader({
    url: fileUrl,
    autoStart: false,
    contentType: 'application/json',
    headers: headers(options),
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
