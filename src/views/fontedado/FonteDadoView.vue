<template>
  <div>
    <h1 class="titulo-2">Minhas Fontes de Dados</h1>

    <div
      v-for="(tipoFonteDado, tipoFonteDadoIndex) in tiposFonteDado"
      class="item-tipo-fonte-dado"
      :key="tipoFonteDadoIndex"
    >
      <span class="subtitulo-3">{{ tipoFonteDado.descricao }}</span>

      <div
        v-for="(fonteDado, fonteDadoIndex) in tipoFonteDado.fontesDados"
        :key="fonteDadoIndex"
        :class="{
          'item-fonte-dado': true,
          'item-fonte-dado-desativado': !fonteDado.ativo,
        }"
      >
        <img
          v-if="fonteDado.urlLogo"
          :src="fonteDado.urlLogo"
          :alt="fonteDado.descricao"
          class="logo-erp"
        />

        <span v-else>{{ fonteDado.descricao }}</span>

        <a class="botao-link" @click="ativarSincronizacao"
          >Ativar sincronização</a
        >
      </div>
    </div>
  </div>

  <sincronizacao-fonte-dado-modal
    :modalAberta="modalSincronizacaFonteDadoAberta"
    @modalAberta="modalSincronizacaFonteDadoAberta = $event"
  ></sincronizacao-fonte-dado-modal>
</template>

<script lang="ts">
import SincronizacaoFonteDadoModal from "@/views/fontedado/modal/SincronizacaoFonteDadoModal.vue";
import { Component, Vue } from "vue-facing-decorator";

@Component({
  components: { SincronizacaoFonteDadoModal },
})
export default class FonteDadoView extends Vue {
  public modalSincronizacaFonteDadoAberta: boolean = false;
  public tiposFonteDado = [
    {
      descricao: "Planilha",
      fontesDados: [{ descricao: "CSV", urlLogo: null, ativo: true }],
    },
    // {
    //   descricao: "ERP em Nuvem (com API)",
    //   fontesDados: [
    //     { descricao: "Omie", urlLogo: OmieLogo, ativo: false },
    //     { descricao: "Granatum", urlLogo: GranatumLogo, ativo: false },
    //     { descricao: "Nibo", urlLogo: NiboLogo, ativo: false },
    //     { descricao: "Kamino", urlLogo: KaminoLogo, ativo: false },
    //   ],
    // },
    // {
    //   descricao: "Meio de Pagamento",
    //   fontesDados: [{ descricao: "Asaas", urlLogo: AsaasLogo, ativo: false }],
    // },
  ];

  public ativarSincronizacao() {
    this.modalSincronizacaFonteDadoAberta = true;
  }
}
</script>

<style scoped>
.item-tipo-fonte-dado {
  padding-top: 16px;
}

.item-fonte-dado {
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  margin-top: 8px;
  display: flex;
  justify-content: space-between;

  .logo-erp {
    height: 30px;
  }
}

.item-fonte-dado-desativado {
  opacity: 0.5;
  cursor: not-allowed;

  .botao-link {
    pointer-events: none;
  }
}
</style>
