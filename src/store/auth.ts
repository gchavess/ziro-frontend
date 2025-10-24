import { reactive } from "vue";

const TOKEN_COOKIE_NAME = "auth_token";
const USUARIO_ID_COOKIE_NAME = "usuario_logado_id";
const USUARIO_NOME_COOKIE_NAME = "usuario_logado_nome";
const USUARIO_INICIAIS_NOME_COOKIE_NAME = "usuario_logado_iniciais_nome";

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
  nome: "" as string | null,
  iniciaisNome: "" as string | null,
});

export function loadAuth() {
  const token = getCookie(TOKEN_COOKIE_NAME);
  const usuarioId = getCookie(USUARIO_ID_COOKIE_NAME);
  const nome = getCookie(USUARIO_NOME_COOKIE_NAME);
  const iniciaisNome = getCookie(USUARIO_INICIAIS_NOME_COOKIE_NAME);

  if (token) {
    authState.token = token;
    authState.isLoggedIn = true;
  }

  if (usuarioId) {
    authState.usuarioLogadoId = usuarioId;
  }

  if (nome) {
    authState.nome = nome;
  }

  if (iniciaisNome) {
    authState.iniciaisNome = iniciaisNome;
  }
}

export function setAuth(
  token: string,
  usuarioId: string,
  nome: string,
  iniciaisNome: string
) {
  authState.token = token;
  authState.isLoggedIn = !!token;
  authState.usuarioLogadoId = usuarioId;
  authState.nome = nome;
  authState.iniciaisNome = iniciaisNome;

  setCookie(TOKEN_COOKIE_NAME, token);
  setCookie(USUARIO_ID_COOKIE_NAME, usuarioId);
  setCookie(USUARIO_NOME_COOKIE_NAME, nome);
  setCookie(USUARIO_INICIAIS_NOME_COOKIE_NAME, iniciaisNome);
}

// Limpa o token, ID e remove os cookies
export function clearAuth() {
  authState.token = null;
  authState.isLoggedIn = false;
  authState.usuarioLogadoId = null;
  authState.nome = null;
  authState.iniciaisNome = null;

  deleteCookie(TOKEN_COOKIE_NAME);
  deleteCookie(USUARIO_ID_COOKIE_NAME);
  deleteCookie(USUARIO_NOME_COOKIE_NAME);
  deleteCookie(USUARIO_INICIAIS_NOME_COOKIE_NAME);
}
