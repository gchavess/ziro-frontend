<template>
  <modal
    :modalAberta="modalAberta"
    @modalAberta="$emit('modalAberta', $event)"
    @salvar="salvar"
  >
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
          {{
            naturezaContaSelecionada?.descricao ||
            contextoContaSelecionado?.descricao
          }}
        </p>
        <p>
          Código:
          {{
            naturezaContaSelecionada?.codigo || contextoContaSelecionado?.codigo
          }}
        </p>
      </div>
    </template>

    <!-- <template #footer>
      <div class="flex justify-end gap-2">
        <button
          class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          @click="$emit('modalAberta', false)"
        >
          Cancelar
        </button>
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          @click="salvar()"
        >
          Salvar
        </button>
      </div>
    </template> -->
  </modal>
</template>

<script lang="ts">
import InputCurrency from "@/components/input-currency/InputCurrency.vue";
import InputSelect from "@/components/input-select/InputSelect.vue";
import InputText from "@/components/input-text/InputText.vue";
import Modal from "@/components/modal/Modal.vue";
import { AcaoButtonIcon } from "@/enums/AcaoButtonIcon";
import { ContextoContaDTO } from "@/interface/contextoconta/ContextoContaDTO";
import { NaturezaContaDTO } from "@/interface/naturezaconta/NaturezaContaDTO";
import ContextoContaService from "@/services/contextoconta/ContextoContaService";
import NaturezaContaService from "@/services/naturezaconta/NaturezaContaService";
import { Component, Prop, Vue, Watch } from "vue-facing-decorator";

@Component({
  components: { Modal, InputCurrency, InputText, InputSelect },
})
export default class ContextoNaturezaModal extends Vue {
  @Prop({ type: Boolean, default: false })
  public modalAberta!: boolean;

  @Prop({ type: AcaoButtonIcon, default: "" })
  public acao!: string;

  @Prop({ type: Object, default: null })
  public naturezaContaSelecionada: NaturezaContaDTO | null = null;

  @Prop({ type: Object, default: null })
  public contextoContaSelecionado: ContextoContaDTO | null = null;

  public acaoButtonIcon = AcaoButtonIcon;

  public form = {
    id: null,
    descricao: "",
    codigo: "",
    observacao: "",
    contextoConta: {
      id: null,
    },
  } as ContextoContaDTO | NaturezaContaDTO;

  public get modoContexto() {
    if (this.contextoContaSelecionado) {
      return true;
    } else if (this.naturezaContaSelecionada) {
      return false;
    }
  }

  public get tituloModal() {
    switch (this.acao) {
      case this.acaoButtonIcon.INCLUIR:
        return "Novo Contexto/Natureza";
      case this.acaoButtonIcon.ALTERAR:
        return "Alterar Contexto/Natureza";
      case this.acaoButtonIcon.EXCLUIR:
        return "Excluir Contexto/Natureza";
      default:
        return "Contexto/Natureza";
    }
  }

  @Watch("modalAberta")
  public onModalAbertaChange(newValue: boolean) {
    if (newValue) {
      this.inicializar();
    }
  }

  private inicializar() {
    if (this.modoContexto && this.acao === this.acaoButtonIcon.INCLUIR) {
      this.form = {
        ...this.form,
        contextoConta: {
          id: this.contextoContaSelecionado
            ? this.contextoContaSelecionado.id
            : null,
        },
      };
      return;
    }

    if (
      this.modoContexto &&
      this.acao === this.acaoButtonIcon.ALTERAR &&
      this.contextoContaSelecionado
    ) {
      this.form = {
        id: this.contextoContaSelecionado.id,
        descricao: this.contextoContaSelecionado.descricao,
        codigo: this.contextoContaSelecionado.codigo,
        observacao: this.contextoContaSelecionado.observacao,
        contextoConta: {
          id: null,
        },
      };
      return;
    }

    if (
      !this.modoContexto &&
      this.acao === this.acaoButtonIcon.ALTERAR &&
      this.naturezaContaSelecionada
    ) {
      this.form = {
        id: this.naturezaContaSelecionada.id,
        descricao: this.naturezaContaSelecionada.descricao,
        codigo: this.naturezaContaSelecionada.codigo,
        observacao: this.naturezaContaSelecionada.observacao,
        contextoConta: {
          id: this.naturezaContaSelecionada.contextoConta
            ? this.naturezaContaSelecionada.contextoConta.id
            : null,
        },
      };
      return;
    }
  }

  public salvar() {
    if (
      this.modoContexto &&
      this.acao === this.acaoButtonIcon.EXCLUIR &&
      this.contextoContaSelecionado &&
      this.contextoContaSelecionado.codigo !== "TODOS"
    ) {
      this.excluirContextoConta();
      return;
    }

    if (!this.modoContexto && this.acao === this.acaoButtonIcon.EXCLUIR) {
      this.excluirNaturezaConta();
      return;
    }
    if (
      this.modoContexto &&
      this.acao === this.acaoButtonIcon.INCLUIR &&
      this.contextoContaSelecionado &&
      "contextoConta" in this.form &&
      this.contextoContaSelecionado.codigo === "TODOS"
    ) {
      this.criarContextoConta();

      return;
    }

    if (
      this.modoContexto &&
      this.acao === this.acaoButtonIcon.ALTERAR &&
      this.contextoContaSelecionado &&
      "contextoConta" in this.form &&
      this.contextoContaSelecionado.codigo !== "TODOS"
    ) {
      this.alterarContextoConta();

      return;
    }

    if (
      this.modoContexto &&
      this.acao === this.acaoButtonIcon.INCLUIR &&
      this.contextoContaSelecionado &&
      "contextoConta" in this.form
    ) {
      this.form.contextoConta.id = this.contextoContaSelecionado.id;

      this.criarNaturezaConta();

      return;
    }

    if (!this.modoContexto && this.acao === this.acaoButtonIcon.ALTERAR) {
      this.alterarNaturezaConta();
    }
  }

  private async criarContextoConta() {
    await ContextoContaService.criar(this.form)
      .then(() => {
        this.fecharModal();
        this.recarregarPanelMenuContextoNatureza();
      })
      .catch((error) => {
        console.error("Erro ao criar contexto conta:", error);
      });
  }

  private async alterarContextoConta() {
    await ContextoContaService.alterar(this.form)
      .then(() => {
        this.fecharModal();
        this.recarregarPanelMenuContextoNatureza();
      })
      .catch((error) => {
        console.error("Erro ao alterar contexto conta:", error);
      });
  }

  private async criarNaturezaConta() {
    if ("contextoConta" in this.form) {
      await NaturezaContaService.criar(this.form)
        .then(() => {
          this.fecharModal();
          this.recarregarPanelMenuContextoNatureza();
        })
        .catch((error) => {
          console.error("Erro ao criar natureza conta:", error);
        });
    }
  }

  private async alterarNaturezaConta() {
    if ("contextoConta" in this.form) {
      await NaturezaContaService.alterar(this.form)
        .then(() => {
          this.fecharModal();
          this.recarregarPanelMenuContextoNatureza();
        })
        .catch((error) => {
          console.error("Erro ao alterar natureza conta:", error);
        });
    }
  }

  private async excluirNaturezaConta() {
    if (!this.naturezaContaSelecionada || !this.naturezaContaSelecionada.id) {
      return;
    }

    await NaturezaContaService.excluir(this.naturezaContaSelecionada.id)
      .then(() => {
        this.fecharModal();
        this.recarregarPanelMenuContextoNatureza();
      })
      .catch((error) => {
        console.error("Erro ao excluir natureza conta:", error);
      });
  }

  private async excluirContextoConta() {
    if (!this.contextoContaSelecionado || !this.contextoContaSelecionado.id) {
      return;
    }

    await ContextoContaService.excluir(this.contextoContaSelecionado.id)
      .then(() => {
        this.fecharModal();
        this.recarregarPanelMenuContextoNatureza();
      })
      .catch((error) => {
        console.error("Erro ao excluir contexto conta:", error);
      });
  }

  private recarregarPanelMenuContextoNatureza() {
    this.$emit("recarregarPanelMenuContextoNatureza");
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
      contextoConta: {
        id: null,
      },
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
