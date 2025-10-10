import { UsuarioDTO } from "@/interface/usuario/UsuarioDTO";
import ServiceBase from "@/services/base/ServiceBase";

class UsuarioService extends ServiceBase {
  private path: string = "/usuarios";

  async criar(usuario: UsuarioDTO): Promise<UsuarioDTO> {
    return this.$axios.post<UsuarioDTO, UsuarioDTO>(`${this.path}`, usuario);
  }
}

export default new UsuarioService();
