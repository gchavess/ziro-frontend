import { authState } from "@/store/auth";
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

export default class ServiceBase {
  protected readonly API_URL = import.meta.env.VITE_APP_URL_BACK_END;
  protected readonly $axios: AxiosInstance;

  constructor() {
    this.$axios = axios.create({
      baseURL: this.API_URL,
      withCredentials: false,
    });

    this.setupInterceptors();
  }

  /**
   * Configura interceptors de request e response.
   */
  private setupInterceptors() {
    this.$axios.interceptors.request.use(this.onRequest, this.onRequestError);
    this.$axios.interceptors.response.use(
      this.onResponse,
      this.onResponseError
    );
  }

  /**
   * Interceptor de request: adiciona headers de autenticação.
   */
  private onRequest(config: AxiosRequestConfig) {
    if (!config.headers) config.headers = {};

    if (authState.token) {
      config.headers.Authorization = `Bearer ${authState.token}`;
    }

    if (authState.usuarioLogadoId) {
      config.headers["XXX-USUARIO-ID"] = authState.usuarioLogadoId;
    }

    return config;
  }

  private onRequestError(error: AxiosError) {
    console.error("Erro na requisição:", error);
    return Promise.reject(error);
  }

  /**
   * Interceptor de response: trata erros comuns de autenticação.
   */
  private onResponse(response: AxiosResponse) {
    return response;
  }

  private onResponseError(error: AxiosError) {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      const isOnLoginPage = window.location.pathname.includes("/login");
      if (!isOnLoginPage) {
        // Opcional: deslogar ou redirecionar
        // authState.logout?.();
        // window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
}
