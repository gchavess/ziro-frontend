import { reactive } from "vue";

const TOKEN_COOKIE_NAME = "auth_token";

function setCookie(name: string, value: string, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires}; path=/`;
}

function getCookie(name: string) {
  return document.cookie.split("; ").reduce((r, v) => {
    const [key, val] = v.split("=");
    return key === name ? decodeURIComponent(val) : r;
  }, "");
}

function deleteCookie(name: string) {
  setCookie(name, "", -1);
}

export const authState = reactive({
  token: "" as string | null,
  isLoggedIn: false,
});

export function loadToken() {
  const token = getCookie(TOKEN_COOKIE_NAME);
  if (token) {
    authState.token = token;
    authState.isLoggedIn = true;
  }
}

export function setToken(token: string) {
  console.log("Setting token:", token);
  authState.token = token;
  authState.isLoggedIn = !!token;
  setCookie(TOKEN_COOKIE_NAME, token);
}

// Limpa o token e remove o cookie
export function clearToken() {
  authState.token = null;
  authState.isLoggedIn = false;
  deleteCookie(TOKEN_COOKIE_NAME);
}
