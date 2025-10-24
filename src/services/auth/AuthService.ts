import { LoginResponseDTO } from "@/interface/auth/LoginResponseDTO";
import { UsuarioDTO } from "@/interface/usuario/UsuarioDTO";
import ServiceBase from "@/services/base/ServiceBase";
import { AxiosResponse } from "axios";

class AuthService extends ServiceBase {
  private path: string = "/auth";

  async login(usuario: UsuarioDTO): Promise<AxiosResponse<LoginResponseDTO>> {
    return this.$axios.post<LoginResponseDTO, AxiosResponse<LoginResponseDTO>>(
      `${this.path}/login`,
      usuario
    );
  }

  async validarToken(): Promise<UsuarioDTO> {
    return this.$axios.get<UsuarioDTO, UsuarioDTO>(
      `${this.path}/validar-token`
    );
  }

  async criar(usuario: UsuarioDTO): Promise<UsuarioDTO> {
    return this.$axios.post<UsuarioDTO, UsuarioDTO>(
      `${this.path}/conta`,
      usuario
    );
  }
}

export default new AuthService();
