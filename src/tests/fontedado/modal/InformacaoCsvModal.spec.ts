import InformacaoCsvModal from "@/views/fontedado/modal/InformacaoCsvModal.vue";
import { mount } from "@vue/test-utils";

// Mock do componente Modal para expor título e slots
vi.mock("@/components/modal/Modal.vue", () => ({
  default: {
    name: "Modal",
    props: ["modalAberta", "tamanho", "exibirBoaoSalvar", "titulo"],
    emits: ["cancelar"],
    template: `
      <div data-testid="modal">
        <h1>{{ titulo }}</h1>
        <slot name="body"></slot>
        <button data-testid="cancelar" @click="$emit('cancelar')">cancelar</button>
      </div>
    `,
  },
}));

describe("InformacaoCsvModal.vue", () => {
  function factory(props = { modalAberta: true }) {
    return mount(InformacaoCsvModal, {
      props,
    });
  }

  it("renderiza título e instruções do CSV", () => {
    const wrapper = factory();
    // Agora o título está renderizado pelo mock do Modal
    expect(wrapper.text()).toContain("Exemplo de Arquivo CSV");
    expect(wrapper.text()).toContain("Formato esperado:");
    expect(wrapper.text()).toContain("Arquivo .csv (UTF-8)");
    expect(wrapper.text()).toContain("Separador: ;");
  });

  it("renderiza tabela com cabeçalhos corretos", () => {
    const wrapper = factory();
    const headers = wrapper.findAll("table thead th").map((h) => h.text());
    expect(headers).toEqual([
      "tipo",
      "descricao",
      "observacao",
      "codigo",
      "dataVencimento",
      "dataPagamento",
      "valorBruto",
      "paiOuContaCodigo",
    ]);
  });

  it("renderiza linhas de exemplo no corpo da tabela", () => {
    const wrapper = factory();
    const rows = wrapper.findAll("table tbody tr");
    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0].text()).toContain("CONTA");
    expect(rows[1].text()).toContain("Serviços");
    expect(rows[2].text()).toContain("LANCAMENTO");
  });

  it("renderiza link de download com href e nome correto", () => {
    const wrapper = factory();
    const link = wrapper.find("a.botao-link");
    expect(link.attributes("href")).toBe(
      "/importacao-dados/exemplo-importacao-dados-planilha.csv"
    );
    expect(link.attributes("download")).toBe(
      "exemplo-importacao-dados-planilha.csv"
    );
  });

  it("emite modalAberta=false ao chamar fecharModal", async () => {
    const wrapper = factory();
    (wrapper.vm as any).fecharModal();
    expect(wrapper.emitted("modalAberta")).toBeTruthy();
    expect(wrapper.emitted("modalAberta")![0]).toEqual([false]);
  });

  it("emite modalAberta=false ao disparar cancelar no Modal", async () => {
    const wrapper = factory();
    await wrapper.find("[data-testid='cancelar']").trigger("click");
    expect(wrapper.emitted("modalAberta")).toBeTruthy();
    expect(wrapper.emitted("modalAberta")![0]).toEqual([false]);
  });
});
