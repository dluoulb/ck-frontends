import JsFileDownloader from 'js-file-downloader';
import { addAuthorization, headers } from '@lib/utils/authorization';

const buildUrl = (type, resource) => {
  const controller = type === 'account' ? 'pi4/accounts' : 'companies';
  const baseURL = `${process.env.NEXT_PUBLIC_API_URL}/api/`;
  return baseURL + controller + resource;
};

export const getEntityDocument = async (entity, id) => {
  if (!entity) return;
  const fileUrl = buildUrl(entity?.type, `/${entity.id}/documents/${id}`);
  const options = await addAuthorization({ headers: {} });

  const agreementDownload = new JsFileDownloader({
    url: fileUrl,
    autoStart: false,
    contentType: 'application/json',
    headers: headers(options),
  });

  return agreementDownload;
};

export const getDocuments = async (api, entity) => {
  if (!entity) return;
  const documents = await api.get(
    buildUrl(entity?.type, `/${entity?.id}/documents`)
  );
  return documents?.data.data || null;
};

export const getApplications = async (api, entity) => {
  if (!entity) return;
  const apps = await api.get(
    buildUrl(entity?.type, `/${entity?.id}/applications`)
  );
  return apps.data.data;
};

export const getStats = async (api, entity) => {
  if (!entity) return;
  const stats = await api.get(buildUrl(entity?.type, `/${entity?.id}/stats`));
  return stats.data;
};

export const getCompany = async (api, companyID) => {
  if (!companyID) return;
  const foundCompany = await api.get(`/api/companies/${companyID}`);
  return {
    ...foundCompany.data.data.attributes,
    type: foundCompany.data.data.type,
  };
};

export const getAccount = async (api, accountID) => {
  if (!accountID) return;
  const account = await api.get(`/api/pi4/accounts/${accountID}`);
  return { ...account.data.data.attributes, type: account.data.data.type };
};
