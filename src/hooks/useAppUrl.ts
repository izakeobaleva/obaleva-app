export function useAppUrl() {
  const url = import.meta.env.VITE_APP_URL || window.location.origin;
  return url.replace(/\/+$/, '');
}