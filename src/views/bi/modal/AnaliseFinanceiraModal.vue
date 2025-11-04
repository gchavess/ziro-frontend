<template>
  <modal
    :modalAberta="modalAberta"
    :titulo="tituloModal"
    :tamanho="'grande'"
    :exibirBoaoSalvar="false"
    :exibirBarraRolagem="true"
    @cancelar="cancelar"
    @salvar="salvar"
  >
    <template #body>
      <div class="container-dados-analise-financeira-modal">
        <div class="container-botao-analise-financeira">
          <primary-button
            texto="Gerar nova Análise Financeira com IA"
            :cor="buttonColor.ALERTA"
            :carregando="botaoGerarAnaliseFinanceiraCarregando"
            @click="gerarAnaliseFinanceira"
          />
        </div>

        <div
          v-for="(fato, index) in dadosAnalise"
          :key="index"
          class="fato-container pt-8"
        >
          <div class="item-fato">
            <div v-if="!fato.editando" class="descricao-fato">
              <b>{{ fato.fato }}</b>
              <span class="data-fato">
                ({{
                  formatarData(
                    fato.dataCriacao ? fato.dataCriacao : new Date()
                  )
                }})</span
              >
            </div>

            <textarea
              v-else
              v-model="fato.fato"
              rows="4"
              class="textarea-edicao"
            />

            <div class="botoes-acao">
              <button-icon
                v-if="!fato.id"
                :acao="acaoButtonIcon.CURTIR"
                @click="adicionarAnaliseFinanceira(fato)"
              />

              <button-icon
                v-if="fato.id && fato.editando"
                :acao="acaoButtonIcon.CHECK"
                @click="clicouSalvarAnaliseFinanceira(fato)"
              />

              <button-icon
                v-else-if="fato.id"
                :acao="acaoButtonIcon.ALTERAR"
                @click="clicouEdicao(fato)"
              />

              <button-icon
                v-if="fato.id"
                :acao="acaoButtonIcon.EXCLUIR"
                @click="clicouExcluirAnaliseFinanceira(fato)"
              />
            </div>
          </div>

          <!-- Controle de causas -->

          <panel-toggleable
            class="mt-4"
            :aberto="expandirCausas[index]"
            @toggle="toggleCausas(index)"
          >
            <template #header>
              <div class="header-painel-causa-acao">
                Causas

                <div>
                  <button-icon
                    v-if="fato.id"
                    :acao="acaoButtonIcon.INCLUIR"
                    :labelTooltip="'Adicionar nova causa'"
                    :posicaoTooltip="'left'"
                    @click.prevent.stop="adicionarNovaCausa(fato)"
                  />

                  <button-icon
                    :acao="
                      !expandirCausas[index]
                        ? acaoButtonIcon.EXPANDIR
                        : acaoButtonIcon.RECOLHER
                    "
                    :posicaoTooltip="'left'"
                  />
                </div>
              </div>
            </template>

            <template #content>
              <div v-for="(causa, i) in fato.causa" :key="i">
                <div class="item-causa">
                  <!-- Modo edição -->
                  <template
                    v-if="
                      causaEditando.fatoId === fato.id &&
                      causaEditando.causaIndex === i
                    "
                  >
                    <textarea
                      v-model="causaEditando.valor"
                      rows="4"
                      class="textarea-edicao"
                    />
                  </template>

                  <!-- Modo leitura -->
                  <template v-else> - {{ causa }} </template>

                  <div class="botoes-acao">
                    <button-icon
                      v-if="
                        causaEditando.fatoId === fato.id &&
                        causaEditando.causaIndex === i
                      "
                      :acao="acaoButtonIcon.CHECK"
                      @click="clicouSalvarCausa()"
                    />

                    <div v-else-if="fato.id">
                      <button-icon
                        :acao="acaoButtonIcon.ALTERAR"
                        @click="clicouEditarCausa(fato.id, i, causa)"
                      />

                      <button-icon
                        :acao="acaoButtonIcon.EXCLUIR"
                        @click="clicouExcluirCausa(fato, i)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </panel-toggleable>

          <panel-toggleable
            class="mt-4"
            :aberto="expandirAcoes[index]"
            @toggle="toggleAcoes(index)"
          >
            <template #header>
              <div class="header-painel-causa-acao">
                Ações
                <div>
                  <button-icon
                    v-if="fato.id"
                    :acao="acaoButtonIcon.INCLUIR"
                    :labelTooltip="'Adicionar nova ação'"
                    :posicaoTooltip="'left'"
                    @click.prevent.stop="adicionarNovaAcao(fato)"
                  />

                  <button-icon
                    :acao="
                      !expandirAcoes[index]
                        ? acaoButtonIcon.EXPANDIR
                        : acaoButtonIcon.RECOLHER
                    "
                    :posicaoTooltip="'left'"
                  />
                </div>
              </div>
            </template>

            <template #content>
              <div v-for="(acao, i) in fato.acao" :key="i" class="item-causa">
                <!-- Modo edição -->
                <template
                  v-if="
                    acaoEditando.fatoId === fato.id &&
                    acaoEditando.acaoIndex === i
                  "
                >
                  <textarea
                    v-model="acaoEditando.valor"
                    rows="4"
                    class="textarea-edicao"
                  />
                </template>

                <!-- Modo leitura -->
                <template v-else> - {{ acao }} </template>

                <div class="botoes-acao">
                  <button-icon
                    v-if="
                      acaoEditando.fatoId === fato.id &&
                      acaoEditando.acaoIndex === i
                    "
                    :acao="acaoButtonIcon.CHECK"
                    @click="clicouSalvarAcao()"
                  />

                  <div v-else-if="fato.id">
                    <button-icon
                      :acao="acaoButtonIcon.ALTERAR"
                      @click="clicouEditarAcao(fato.id, i, acao)"
                    />
                    <button-icon
                      :acao="acaoButtonIcon.EXCLUIR"
                      @click="clicouExcluirAcao(fato, i)"
                    />
                  </div>
                </div>
              </div>
            </template>
          </panel-toggleable>
        </div>
      </div>
    </template>
  </modal>

  <confirmar-modal
    :modalAberta="modalConfirmacaoAberta"
    titulo="Confirmar Exclusão"
    :mensagem="
      fatoSelecionadoParaExcluir
        ? 'Tem certeza que deseja excluir este fato?'
        : causaSelecionadaParaExcluir
        ? 'Tem certeza que deseja excluir esta causa?'
        : acaoSelecionadaParaExcluir
        ? 'Tem certeza que deseja excluir esta ação?'
        : ''
    "
    :tamanho="'media'"
    :dadoExtra="
      fatoSelecionadoParaExcluir
        ? fatoSelecionadoParaExcluir.fato
        : causaSelecionadaParaExcluir
        ? causaSelecionadaParaExcluir.fato.causa[
            causaSelecionadaParaExcluir.index
          ]
        : acaoSelecionadaParaExcluir
        ? acaoSelecionadaParaExcluir.fato.acao[acaoSelecionadaParaExcluir.index]
        : null
    "
    @cancelar="modalConfirmacaoAberta = false"
    @confirmar="confirmarExclusao"
  />
</template>

<script lang="ts">
import ButtonIcon from "@/components/button-icon/ButtonIcon.vue";
import PrimaryButton from "@/components/button/PrimaryButton.vue";
import ConfirmarModal from "@/components/modal/ConfirmarModal.vue";
import Modal from "@/components/modal/Modal.vue";
import PanelToggleable from "@/components/panel-toggleable/PanelToggleable.vue";
import { AcaoButtonIcon } from "@/enums/AcaoButtonIcon";
import { ButtonColor } from "@/enums/ButtonColor";
import { AnaliseFinanceiraDTO } from "@/interface/analisefinanceira/AnaliseFinanceiraDTO";
import { LancamentoGraficoDTO } from "@/interface/lancamento/LancamentoGraficoDTO";
import AnaliseFinanceiraService from "@/services/analisefinanceira/AnaliseFinanceiraService";
import { formatarData } from "@/utils/data/DataUtils";
import { Component, Prop, Vue, Watch } from "vue-facing-decorator";

@Component({
  components: {
    Modal,
    PanelToggleable,
    PrimaryButton,
    ButtonIcon,
    ConfirmarModal,
  },
  emits: ["modalAberta"],
})
export default class AnaliseFinanceiraModal extends Vue {
  @Prop({ type: Boolean, default: false })
  public modalAberta!: boolean;

  @Prop({ default: {} })
  public dadosGrafico!: LancamentoGraficoDTO;

  public fatoSelecionadoParaExcluir: AnaliseFinanceiraDTO | null = null;
  public acaoSelecionadaParaExcluir: {
    fato: AnaliseFinanceiraDTO;
    index: number;
  } | null = null;

  public causaSelecionadaParaExcluir: {
    fato: AnaliseFinanceiraDTO;
    index: number;
  } | null = null;
  public modalConfirmacaoAberta: boolean = false;

  causaEditando: {
    fatoId: number | null;
    causaIndex: number | null;
    valor: string;
  } = {
    fatoId: null,
    causaIndex: null,
    valor: "",
  };

  acaoEditando: {
    fatoId: number | null;
    acaoIndex: number | null;
    valor: string;
  } = {
    fatoId: null,
    acaoIndex: null,
    valor: "",
  };

  public botaoGerarAnaliseFinanceiraCarregando: boolean = false;

  public acaoButtonIcon = AcaoButtonIcon;
  public buttonColor = ButtonColor;
  public formatarData = formatarData;

  public dadosAnalise: AnaliseFinanceiraDTO[] = [];

  public expandirCausas: boolean[] = [];
  public expandirAcoes: boolean[] = [];

  @Watch("modalAberta")
  public onModalAbertaChange(newValue: boolean) {
    if (newValue) {
      this.inicializar();
    }
  }

  public get tituloModal() {
    return "Análise Financeira";
  }

  private inicializar() {
    this.expandirCausas = this.dadosAnalise.map(() => false);
    this.expandirAcoes = this.dadosAnalise.map(() => false);

    this.preencherListaAnaliseFinanceira();
  }

  private async preencherListaAnaliseFinanceira() {
    await AnaliseFinanceiraService.listarTodos()
      .then((response) => {
        this.dadosAnalise = response.data.map(
          (analise: AnaliseFinanceiraDTO) => ({
            ...analise,
            causa: Array.isArray(analise.causa)
              ? analise.causa
              : analise.causa
              ? JSON.parse(analise.causa)
              : [],
            acao: Array.isArray(analise.acao)
              ? analise.acao
              : analise.acao
              ? JSON.parse(analise.acao)
              : [],
            editando: false,
          })
        );
      })
      .catch(() => {
        window.$toast.error("Erro ao preencher as análises financeiras");
      });
  }

  public async adicionarAnaliseFinanceira(fato: AnaliseFinanceiraDTO) {
    const analiseFinanceira: AnaliseFinanceiraDTO = {
      fato: fato.fato,
      acao: JSON.stringify(fato.acao),
      causa: JSON.stringify(fato.causa),
    };

    try {
      const response = await AnaliseFinanceiraService.criar(analiseFinanceira);

      fato.id = response.data.id;
      fato.editando = false;

      if (response.data.causa) {
        fato.causa = Array.isArray(response.data.causa)
          ? response.data.causa
          : JSON.parse(response.data.causa);
      }

      if (response.data.acao) {
        fato.acao = Array.isArray(response.data.acao)
          ? response.data.acao
          : JSON.parse(response.data.acao);
      }

      window.$toast.success("Fato, causas e ações criados com sucesso!");
    } catch (error) {
      window.$toast.error("Erro ao criar fato, causas e ações");
    }
  }

  public async salvarAnaliseFinanceira(fato: AnaliseFinanceiraDTO) {
    const analiseFinanceira: AnaliseFinanceiraDTO = {
      id: fato.id,
      fato: fato.fato,
      acao: JSON.stringify(fato.acao),
      causa: JSON.stringify(fato.causa),
    };

    await AnaliseFinanceiraService.alterar(analiseFinanceira)
      .then(() => {
        fato.editando = false;
      })
      .catch(() => {
        window.$toast.error("Erro ao criar fato, causas e ações");
      });
  }

  public clicouEdicao(objeto: AnaliseFinanceiraDTO) {
    objeto.editando = true;
  }

  public clicouExcluirAnaliseFinanceira(fato: AnaliseFinanceiraDTO) {
    this.fatoSelecionadoParaExcluir = fato;
    this.modalConfirmacaoAberta = true;
  }

  public clicouSalvarAnaliseFinanceira(fato: AnaliseFinanceiraDTO) {
    this.salvarAnaliseFinanceira(fato);
    window.$toast.success("Fato alterado com sucesso!");
  }

  public async confirmarExclusao() {
    if (this.fatoSelecionadoParaExcluir?.id) {
      await this.excluirAnaliseFinanceira();
    } else if (this.causaSelecionadaParaExcluir) {
      const { fato, index } = this.causaSelecionadaParaExcluir;
      if (Array.isArray(fato.causa)) {
        fato.causa.splice(index, 1);
        await this.salvarAnaliseFinanceira(fato);
        window.$toast.success("Causa excluída com sucesso!");
      }
    } else if (this.acaoSelecionadaParaExcluir) {
      const { fato, index } = this.acaoSelecionadaParaExcluir;
      if (Array.isArray(fato.acao)) {
        fato.acao.splice(index, 1);
        await this.salvarAnaliseFinanceira(fato);
        window.$toast.success("Ação excluída com sucesso!");
      }
    }

    this.modalConfirmacaoAberta = false;
    this.fatoSelecionadoParaExcluir = null;
    this.causaSelecionadaParaExcluir = null;
    this.acaoSelecionadaParaExcluir = null;
  }

  public async excluirAnaliseFinanceira() {
    if (
      !this.fatoSelecionadoParaExcluir ||
      !this.fatoSelecionadoParaExcluir.id
    ) {
      return;
    }

    await AnaliseFinanceiraService.excluir(this.fatoSelecionadoParaExcluir.id)
      .then(() => {
        this.dadosAnalise = this.dadosAnalise.filter(
          (f) => f.id !== this.fatoSelecionadoParaExcluir?.id
        );
        window.$toast.success("Fato excluído com sucesso!");
      })
      .catch(() => {
        window.$toast.error("Erro ao excluir fato");
      })
      .finally(() => {
        this.modalConfirmacaoAberta = false;
        this.fatoSelecionadoParaExcluir = null;
      });
  }

  public async gerarAnaliseFinanceira() {
    this.botaoGerarAnaliseFinanceiraCarregando = true;

    await AnaliseFinanceiraService.gerarInsights(this.dadosGrafico)
      .then((response) => {
        this.dadosAnalise.unshift(...response.data);
      })
      .catch(() => {
        window.$toast.error("Erro ao fazer análise financeira");
      })
      .finally(() => {
        this.botaoGerarAnaliseFinanceiraCarregando = false;
      });
  }

  public clicouEditarCausa(
    fatoId: number,
    causaIndex: number,
    valorAtual: string
  ) {
    this.causaEditando = {
      fatoId,
      causaIndex,
      valor: valorAtual,
    };
  }

  public clicouExcluirCausa(fato: AnaliseFinanceiraDTO, causaIndex: number) {
    this.causaSelecionadaParaExcluir = { fato, index: causaIndex };
    this.fatoSelecionadoParaExcluir = null;
    this.modalConfirmacaoAberta = true;
  }

  public clicouSalvarCausa() {
    if (
      this.causaEditando.fatoId !== null &&
      this.causaEditando.causaIndex !== null
    ) {
      const fato = this.dadosAnalise.find(
        (f) => f.id === this.causaEditando.fatoId
      );
      if (fato) {
        if (!fato.causa) {
          fato.causa = [];
        }

        if (
          Array.isArray(fato.causa) &&
          this.causaEditando.causaIndex !== null
        ) {
          fato.causa[this.causaEditando.causaIndex] = this.causaEditando.valor;
        }

        this.causaEditando = { fatoId: null, causaIndex: null, valor: "" };

        this.$nextTick(() => {
          this.salvarAnaliseFinanceira(fato);

          window.$toast.success("Causa alterada com sucesso!");
        });
      }
    }
  }

  public clicouEditarAcao(
    fatoId: number,
    acaoIndex: number,
    valorAtual: string
  ) {
    this.acaoEditando = {
      fatoId,
      acaoIndex,
      valor: valorAtual,
    };
  }

  public clicouExcluirAcao(fato: AnaliseFinanceiraDTO, acaoIndex: number) {
    this.acaoSelecionadaParaExcluir = { fato, index: acaoIndex };
    this.fatoSelecionadoParaExcluir = null;
    this.modalConfirmacaoAberta = true;
  }

  public clicouSalvarAcao() {
    if (
      this.acaoEditando.fatoId !== null &&
      this.acaoEditando.acaoIndex !== null
    ) {
      const fato = this.dadosAnalise.find(
        (f) => f.id === this.acaoEditando.fatoId
      );
      if (fato) {
        if (!Array.isArray(fato.acao)) {
          fato.acao = [];
        }
        fato.acao[this.acaoEditando.acaoIndex] = this.acaoEditando.valor;

        this.acaoEditando = { fatoId: null, acaoIndex: null, valor: "" };
        this.$nextTick(() => {
          this.salvarAnaliseFinanceira(fato);

          window.$toast.success("Ação alterada com sucesso!");
        });
      }
    }
  }

  public adicionarNovaCausa(fato: AnaliseFinanceiraDTO) {
    if (!fato.causa) fato.causa = [];
    (fato.causa as string[]).push("");
    this.$nextTick(() => {
      this.expandirCausas[this.dadosAnalise.indexOf(fato)] = true;
    });
  }

  public adicionarNovaAcao(fato: AnaliseFinanceiraDTO) {
    if (!fato.acao) fato.acao = [];
    (fato.acao as string[]).push("");
    this.$nextTick(() => {
      this.expandirAcoes[this.dadosAnalise.indexOf(fato)] = true;
    });
  }
  public toggleCausas(index: number) {
    this.expandirCausas[index] = !this.expandirCausas[index];
  }

  public toggleAcoes(index: number) {
    this.expandirAcoes[index] = !this.expandirAcoes[index];
  }

  public async salvar() {}
  public async cancelar() {
    this.fecharModal();
  }

  private fecharModal() {
    this.$emit("modalAberta", false);
  }
}
</script>

<style scoped>
.container-dados-analise-financeira-modal {
  height: 800px;
}

.fato-container {
  margin-bottom: 1.5rem;
}

.lista-itens {
  margin-left: 1rem;
  margin-top: 0.25rem;
}

.item-fato {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.data-fato {
  color: #7e7e7e;
}

.item-causa {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 6px;
}

/* Transição suave */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.header-painel-causa-acao {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.textarea-edicao {
  width: 100%;
  resize: vertical;
  padding: 4px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.botoes-acao {
  display: flex;
  flex-direction: row;
  margin-right: 8px;
  min-width: 80px;
  max-width: 80px;
  justify-content: flex-end;
}

.container-botao-analise-financeira {
  justify-content: flex-end;
  display: flex;
}
</style>
