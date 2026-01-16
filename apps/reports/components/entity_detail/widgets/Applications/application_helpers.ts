import { fromISO } from '@lib/utils/datetime_formatters';

export const listOptions = (applications) => {
  return applications?.map((app) => {
    return {
      id: app.id,
      text: `${app.status} - ${fromISO(app.created_at).toLocaleString()}`,
      status: app.status,
    };
  });
};

export const findApp = (id, applications) => {
  return applications?.filter((app) => app.id === id);
};
