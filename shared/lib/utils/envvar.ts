export const isEnabled = (envvar: string) => {
  if (typeof envvar !== 'string') return false;

  return envvar.trim().toLowerCase() === 'true';
};
