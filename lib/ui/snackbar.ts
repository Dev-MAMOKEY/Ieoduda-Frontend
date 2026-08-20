export const SNACKBAR_EVENT = "ieoduda:snackbar";
const SNACKBAR_STORAGE_KEY = "ieoduda:snackbar:next";

export function showSnackbar(message: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<string>(SNACKBAR_EVENT, { detail: message }));
}

export function showSnackbarAfterNavigation(message: string) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(SNACKBAR_STORAGE_KEY, message);
}

export function consumeNavigationSnackbar() {
  if (typeof window === "undefined") return "";
  const message = window.sessionStorage.getItem(SNACKBAR_STORAGE_KEY) ?? "";
  window.sessionStorage.removeItem(SNACKBAR_STORAGE_KEY);
  return message;
}
