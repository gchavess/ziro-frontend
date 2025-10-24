<template>
  <modal
    :modalAberta="modalAberta"
    :titulo="tituloModal"
    :botaoCarregando="carregando"
    @cancelar="cancelar"
    @salvar="salvar"
  >
    <template #body>
      <div class="container-sincronizao-fonte-dado-modal">
        <span class="titulo-4">Quais dados serão importados para o Ziro?</span>
        <span class="pt-4">- Categorias (contas) </span>
        <span>- Transferências (lançamentos) </span>

        <div class="pt-4">
          <button class="botao-link" @click="modalInformacaoCsvAberta = true">
            📑 Ver exemplo de arquivo
          </button>
        </div>
      </div>

      <button-upload
        class="pt-4"
        @arquivo="arquivoSelecionado = $event"
      ></button-upload>
    </template>
  </modal>

  <informacao-csv-modal
    :modalAberta="modalInformacaoCsvAberta"
    @modalAberta="modalInformacaoCsvAberta = $event"
  ></informacao-csv-modal>
</template>

<script lang="ts">
import ButtonUpload from "@/components/button-upload/ButtonUpload.vue";
import Modal from "@/components/modal/Modal.vue";
import PanelToggleable from "@/components/panel-toggleable/PanelToggleable.vue";
import CsvImportService from "@/services/csv/CsvImportService";
import InformacaoCsvModal from "@/views/fontedado/modal/InformacaoCsvModal.vue";
import { Component, Prop, Vue } from "vue-facing-decorator";

@Component({
  components: { Modal, PanelToggleable, ButtonUpload, InformacaoCsvModal },
  emits: ["modalAberta"],
})
export default class SincronizacaoFonteDadoModal extends Vue {
  @Prop({ type: Boolean, default: false })
  public modalAberta!: boolean;

  public modalInformacaoCsvAberta: boolean = false;

  public carregando: boolean = false;

  public arquivoSelecionado = null;

  public get tituloModal() {
    return "Ativar Sincronização";
  }

  public async salvar() {
    if (this.arquivoSelecionado == null) {
      return;
    }

    this.carregando = true;

    await CsvImportService.importar(this.arquivoSelecionado)
      .then(() => {
        window.$toast.success("Dados importados com sucesso");

        this.fecharModal();
      })
      .catch(() => {
        window.$toast.error("Erro ao importar os dados");
      })

      .finally(() => {
        this.carregando = false;
      });
  }

  public async cancelar() {
    this.fecharModal();
  }

  private fecharModal() {
    this.$emit("modalAberta", false);
  }
}
</script>

<style scoped>
.container-sincronizao-fonte-dado-modal {
  display: flex;
  flex-direction: column;
}
</style>
