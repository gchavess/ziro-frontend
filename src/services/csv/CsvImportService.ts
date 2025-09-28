import ServiceBase from "@/services/base/ServiceBase";

class CsvImportService extends ServiceBase {
  private path: string = "/import";

  /**
   * Importa um CSV enviando o arquivo para o backend
   * @param file Arquivo CSV a ser enviado
   */
  async importar(file: File): Promise<void> {
    const formData = new FormData();
    formData.append("file", file);

    return this.$axios.post(`${this.path}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}

export default new CsvImportService();
