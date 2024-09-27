import JsFileDownloader from 'js-file-downloader';

import OrderRecord from '@lib/records/order';
import { addAuthorization, headers } from '@lib/utils/authorization';

export const getOrder = async (api, id) => {
  const order = await api.get(`/api/orders/${id}?include=payment_schedule`);
  return new OrderRecord(order?.data.data.attributes);
};

export const getOrders = async (api, entity, pageIndex) => {
  const path =
    `/api/orders?filter[${entity?.type}]=${entity?.id}` +
    `&page=${pageIndex + 1}&per_page=25` +
    `&include=virtual_card_details,payment_schedule`;

  if (entity) {
    const orders = await api.get(path);
    if (orders?.data?.metadata) {
      return {
        data: orders.data.data,
        metadata: orders.data.metadata,
        hasMore: orders.data.metadata.total_pages > pageIndex + 1 
      };
    }
    return { data: [], metadata: { total_pages: 0 }, hasMore: false };
  }
};

export const getTransactions = async (api, id) => {
  const transactions = await api.get(`/api/orders/${id}/transactions`);
  return transactions?.data?.transactions;
};

export const getPaymentSchedule = async (api, id) => {
  const schedule = await api.get(`/api/orders/${id}/schedule`);
  return schedule?.data.payment_schedule;
};

export const getDocuments = async (api, order) => {
  const documents = await api.get(`/api/orders/${order.id}/documents`);
  return documents.data.data;
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

export const getInvoice = async (order, documentID) => {
  const fileUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${order.id}/documents/${documentID}`;
  const options = await addAuthorization({ headers: {} });

  const invoiceDownload = new JsFileDownloader({
    url: fileUrl,
    autoStart: false,
    contentType: 'application/json',
    headers: headers(options),
  });

  return invoiceDownload;
};
