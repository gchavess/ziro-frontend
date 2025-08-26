import { reactive } from "vue";

const TOKEN_COOKIE_NAME = "auth_token";
const USUARIO_ID_COOKIE_NAME = "usuario_logado_id";

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
  usuarioLogadoId: "" as string | null,
});

export function loadAuth() {
  const token = getCookie(TOKEN_COOKIE_NAME);
  const usuarioId = getCookie(USUARIO_ID_COOKIE_NAME);

  if (token) {
    authState.token = token;
    authState.isLoggedIn = true;
  }

  if (usuarioId) {
    authState.usuarioLogadoId = usuarioId;
  }
}

export function setAuth(token: string, usuarioId: string) {
  authState.token = token;
  authState.isLoggedIn = !!token;
  authState.usuarioLogadoId = usuarioId;

  setCookie(TOKEN_COOKIE_NAME, token);
  setCookie(USUARIO_ID_COOKIE_NAME, usuarioId);
}

// Limpa o token, ID e remove os cookies
export function clearAuth() {
  authState.token = null;
  authState.isLoggedIn = false;
  authState.usuarioLogadoId = null;

  deleteCookie(TOKEN_COOKIE_NAME);
  deleteCookie(USUARIO_ID_COOKIE_NAME);
}
