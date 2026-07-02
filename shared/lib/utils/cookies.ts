export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const trimmed = cookie.trim();
    const eqIndex = trimmed.indexOf('=');
    const key = eqIndex === -1 ? trimmed : trimmed.slice(0, eqIndex);
    if (key === name) return decodeURIComponent(eqIndex === -1 ? '' : trimmed.slice(eqIndex + 1));
  }
  return null;
};

export const setCookie = (name: string, value: string, days: number): void => {
  if (typeof document === 'undefined') return;
  const expires = new Date();
  expires.setDate(expires.getDate() + days);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};
