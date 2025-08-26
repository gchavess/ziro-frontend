<template>
  <modal :modalAberta="modalAberta" @cancelar="cancelar" @salvar="salvar">
    <template #header>
      <h2>{{ tituloModal }}</h2>
    </template>

    <template #body>
      <form class="space-y-4" v-if="acao !== acaoButtonIcon.EXCLUIR">
        <div class="formulario-lancamento">
          <div>
            <input-text v-model="form.descricao" :label="'Descrição'" />
          </div>

          <div>
            <input-text v-model="form.codigo" :label="'Código'" />
          </div>

          <div>
            <input-text v-model="form.observacao" :label="'Observação'" />
          </div>
        </div>
      </form>

      <div v-else>
        <p>Você tem certeza que deseja excluir este item?</p>
        <p>
          Descrição:
          {{ itemTreeContaSelecionado?.descricao }}
        </p>
        <p>
          Código:
          {{ itemTreeContaSelecionado?.codigo }}
        </p>
      </div>
    </template>
  </modal>
</template>

<script lang="ts">
import InputCurrency from "@/components/input-currency/InputCurrency.vue";
import InputSelect from "@/components/input-select/InputSelect.vue";
import InputText from "@/components/input-text/InputText.vue";
import Modal from "@/components/modal/Modal.vue";
import { AcaoButtonIcon } from "@/enums/AcaoButtonIcon";
import { ContaDTO } from "@/interface/conta/ContaDTO";
import { ContaTreeNodeDTO } from "@/interface/conta/ContaTreeNodeDTO";
import ContaService from "@/services/conta/ContaService";
import { Component, Prop, Vue, Watch } from "vue-facing-decorator";

@Component({
  components: { Modal, InputCurrency, InputText, InputSelect },
  emits: ["modalAberta", "recarregarTreeContas"],
})
export default class ContaModal extends Vue {
  @Prop({ type: Boolean, default: false })
  public modalAberta!: boolean;

  @Prop({ type: AcaoButtonIcon, default: "" })
  public acao!: string;

  @Prop({ type: Object, default: null })
  public itemTreeContaSelecionado: ContaTreeNodeDTO | null = null;

  public acaoButtonIcon = AcaoButtonIcon;

  public form = {
    id: null,
    descricao: "",
    codigo: "",
    observacao: "",
    paiId: null,
  } as ContaDTO;

  public get tituloModal() {
    switch (this.acao) {
      case this.acaoButtonIcon.INCLUIR:
        return "Nova Conta";
      case this.acaoButtonIcon.ALTERAR:
        return "Alterar Conta";
      case this.acaoButtonIcon.EXCLUIR:
        return "Excluir Conta";
      default:
        return "Conta";
    }
  }

  @Watch("modalAberta")
  public onModalAbertaChange(newValue: boolean) {
    if (newValue) {
      this.inicializar();
    }
  }

  private inicializar() {
    if (
      this.acao === this.acaoButtonIcon.ALTERAR &&
      this.itemTreeContaSelecionado
    ) {
      this.form = {
        ...this.form,
        id: this.itemTreeContaSelecionado.id,
        descricao: this.itemTreeContaSelecionado.descricao,
        codigo: this.itemTreeContaSelecionado.codigo,
        observacao: this.itemTreeContaSelecionado.observacao,
      };
    }

    if (
      this.acao === this.acaoButtonIcon.INCLUIR &&
      this.itemTreeContaSelecionado
    ) {
      this.form.paiId = this.itemTreeContaSelecionado.id;
    }
  }

  public salvar() {
    switch (this.acao) {
      case this.acaoButtonIcon.INCLUIR:
        this.criarConta();
        break;
      case this.acaoButtonIcon.ALTERAR:
        this.alterarConta();
        break;
      case this.acaoButtonIcon.EXCLUIR:
        this.excluirConta();
        break;
      default:
        break;
    }
  }

  private async excluirConta() {
    if (!this.itemTreeContaSelecionado) {
      return;
    }

    await ContaService.excluir(this.itemTreeContaSelecionado.id)
      .then(() => {
        this.preencherTreeContas();
        this.fecharModal();
      })
      .catch((error) => {
        console.error("Erro ao excluir contexto conta:", error);
      });
  }

  private async alterarConta() {
    await ContaService.alterar(this.form)
      .then(() => {
        this.preencherTreeContas();
        this.fecharModal();
      })
      .catch((error) => {
        console.error("Erro ao alterar contexto conta:", error);
      });
  }

  private async criarConta() {
    await ContaService.criar(this.form)
      .then(() => {
        this.preencherTreeContas();
        this.fecharModal();
      })
      .catch((error) => {
        console.error("Erro ao criar contexto conta:", error);
      });
  }

  private preencherTreeContas() {
    this.$emit("recarregarTreeContas");
  }

  public async cancelar() {
    await this.resetarFormulario();
    this.fecharModal();
  }

  private fecharModal() {
    this.$emit("modalAberta", false);
    this.resetarFormulario();
  }

  private resetarFormulario() {
    this.form = {
      id: null,
      descricao: "",
      codigo: "",
      observacao: "",
      paiId: null,
    };
  }
}
</script>

<style scoped>
.formulario-lancamento {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  padding-top: 1rem;
}
</style>
