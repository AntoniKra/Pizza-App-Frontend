import axios from "axios";

const TOKEN_KEY = "token";
const EMAIL_KEY = "email";
const IS_PARTNER_KEY = "isPartner";

export const AUTH_SESSION_EXPIRED_MESSAGE =
  "Sesja wygasła. Zaloguj się ponownie.";

export function readAuthFromStorage() {
  return {
    token: localStorage.getItem(TOKEN_KEY),
    email: localStorage.getItem(EMAIL_KEY),
    isPartner: localStorage.getItem(IS_PARTNER_KEY) === "true",
  };
}

/** Jedno miejsce zapisu / czyszczenia localStorage + nagłówka axios */
export function writeAuthToStorage(
  token: string | null,
  email: string | null,
  isPartner: boolean | null,
) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem(TOKEN_KEY);
    delete axios.defaults.headers.common.Authorization;
  }

  if (email) {
    localStorage.setItem(EMAIL_KEY, email);
  } else {
    localStorage.removeItem(EMAIL_KEY);
  }

  if (isPartner !== null) {
    localStorage.setItem(IS_PARTNER_KEY, isPartner ? "true" : "false");
  } else {
    localStorage.removeItem(IS_PARTNER_KEY);
  }
}

export function clearAuthStorage() {
  writeAuthToStorage(null, null, null);
}

type UnauthorizedHandler = (message: string) => void;

let unauthorizedHandler: UnauthorizedHandler | null = null;

export function setUnauthorizedHandler(handler: UnauthorizedHandler | null) {
  unauthorizedHandler = handler;
}

/** Wywoływane z interceptora axios przy 401 (poza loginem/rejestracją) */
export function notifyUnauthorized(message = AUTH_SESSION_EXPIRED_MESSAGE) {
  unauthorizedHandler?.(message);
}

export function isAuthRequestUrl(url?: string): boolean {
  if (!url) return false;
  return (
    url.includes("/api/Auth/Login") || url.includes("/api/Auth/Register")
  );
}
