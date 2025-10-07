// src/tests/fontedado/modal/SincronizacaoFonteDadoModal.spec.ts
import SincronizacaoFonteDadoModal from "@/views/fontedado/modal/SincronizacaoFonteDadoModal.vue";
import { mount } from "@vue/test-utils";

// =======================
// MOCKS
// =======================

// Mock do Modal
vi.mock("@/components/modal/Modal.vue", () => ({
  default: {
    name: "Modal",
    props: ["modalAberta", "titulo", "botaoCarregando"],
    emits: ["cancelar", "salvar"],
    template: `
      <div data-testid="modal">
        <h1>{{ titulo }}</h1>
        <slot name="body"></slot>
        <button data-testid="cancelar" @click="$emit('cancelar')">cancelar</button>
        <button data-testid="salvar" @click="$emit('salvar')">salvar</button>
      </div>
    `,
  },
}));

// Mock do ButtonUpload
vi.mock("@/components/button-upload/ButtonUpload.vue", () => ({
  default: {
    name: "ButtonUpload",
    emits: ["arquivo"],
    template: `<button data-testid="upload" @click="$emit('arquivo', 'arquivo.csv')">upload</button>`,
  },
}));

// Mock do InformacaoCsvModal
vi.mock("@/views/fontedado/modal/InformacaoCsvModal.vue", () => ({
  default: {
    name: "InformacaoCsvModal",
    props: ["modalAberta"],
    emits: ["modalAberta"],
    template: `<div data-testid="modal-csv"></div>`,
  },
}));

// Mock do serviço CSV
vi.mock("@/services/csv/CsvImportService", () => ({
  default: {
    importar: vi.fn(),
  },
}));

import CsvImportService from "@/services/csv/CsvImportService";

describe("SincronizacaoFonteDadoModal.vue", () => {
  let toastMock: any;

  beforeEach(() => {
    toastMock = { error: vi.fn() };
    // @ts-ignore
    window.$toast = toastMock;
  });

  function factory(props = { modalAberta: true }) {
    return mount(SincronizacaoFonteDadoModal, { props });
  }

  it("renderiza título e instruções", () => {
    const wrapper = factory();
    expect(wrapper.text()).toContain("Ativar Sincronização");
    expect(wrapper.text()).toContain(
      "Quais dados serão importados para o Ziro?"
    );
    expect(wrapper.text()).toContain("Categorias (contas)");
    expect(wrapper.text()).toContain("Transferências (lançamentos)");
    expect(wrapper.find("button.botao-link").exists()).toBe(true);
    expect(wrapper.findComponent({ name: "ButtonUpload" }).exists()).toBe(true);
  });

  it("abre InformacaoCsvModal ao clicar no botão", async () => {
    const wrapper = factory();
    expect(wrapper.vm.modalInformacaoCsvAberta).toBe(false);
    await wrapper.find("button.botao-link").trigger("click");
    expect(wrapper.vm.modalInformacaoCsvAberta).toBe(true);
  });

  it("atualiza arquivoSelecionado ao receber evento do ButtonUpload", async () => {
    const wrapper = factory();
    await wrapper.find("[data-testid='upload']").trigger("click");
    expect(wrapper.vm.arquivoSelecionado).toBe("arquivo.csv");
  });

  it("não faz nada se salvar chamado sem arquivo", async () => {
    const wrapper = factory();
    wrapper.vm.arquivoSelecionado = null;
    await wrapper.vm.salvar();
    expect(CsvImportService.importar).not.toHaveBeenCalled();
  });

  it("chama CsvImportService.importar e fecha modal no sucesso", async () => {
    (CsvImportService.importar as any).mockResolvedValueOnce(true);
    const wrapper = factory();
    wrapper.vm.arquivoSelecionado = "arquivo.csv";

    const promise = wrapper.vm.salvar();
    expect(wrapper.vm.carregando).toBe(true);

    await promise;

    expect(CsvImportService.importar).toHaveBeenCalledWith("arquivo.csv");
    expect(wrapper.emitted("modalAberta")![0]).toEqual([false]);
    expect(wrapper.vm.carregando).toBe(false);
  });

  it("mostra erro se CsvImportService.importar falha", async () => {
    (CsvImportService.importar as any).mockRejectedValueOnce(
      new Error("Falha")
    );
    const wrapper = factory();
    wrapper.vm.arquivoSelecionado = "arquivo.csv";

    await wrapper.vm.salvar();

    expect(toastMock.error).toHaveBeenCalledWith("Erro ao importar os dados");
    expect(wrapper.vm.carregando).toBe(false);
  });

  it("emite modalAberta=false ao cancelar", async () => {
    const wrapper = factory();
    await wrapper.vm.cancelar();
    expect(wrapper.emitted("modalAberta")![0]).toEqual([false]);
  });
});
