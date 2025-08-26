import { authState } from "@/store/auth";
import axios, { AxiosStatic } from "axios";

export default class ServiceBase {
  protected API_URL = import.meta.env.VITE_APP_URL_BACK_END;

  constructor() {
    this.$axios.interceptors.request.use(
      (config) => {
        config.baseURL = this.API_URL;

        config.withCredentials = true;

        config.headers["Authorization"] = `${authState.token}`;
        config.headers["Access-Control-Allow-Origin"] = "*";

        if (authState.usuarioLogadoId) {
          config.headers["XXX-USUARIO-ID"] = authState.usuarioLogadoId;
        }

        return config;
      },
      function (error) {
        return Promise.reject(error);
      }
    );

    this.$axios.interceptors.response.use(
      function (response) {
        return response;
      },
      function (error) {
        if (error.request.status == 403) {
          window.top?.location.reload();
        }
        return Promise.reject(error);
      }
    );
  }

  $axios: AxiosStatic = axios;
}
