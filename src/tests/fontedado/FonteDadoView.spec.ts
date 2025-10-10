import FonteDadoView from "@/views/fontedado/FonteDadoView.vue";
import { mount } from "@vue/test-utils";

// Mock do modal para não renderizar de verdade
vi.mock("@/views/fontedado/modal/SincronizacaoFonteDadoModal.vue", () => ({
  default: {
    name: "SincronizacaoFonteDadoModal",
    template: "<div data-testid='modal' />",
    props: ["modalAberta"],
  },
}));

describe("FonteDadoView.vue", () => {
  function factory() {
    return mount(FonteDadoView, {
      global: {
        stubs: ["sincronizacao-fonte-dado-modal"],
      },
    });
  }

  it("renderiza título principal", () => {
    const wrapper = factory();
    expect(wrapper.find("h1").text()).toBe("Minhas Fontes de Dados");
  });

  it("renderiza tipo de fonte de dado e item ativo sem logo", () => {
    const wrapper = factory();
    expect(wrapper.text()).toContain("Planilha");
    expect(wrapper.text()).toContain("CSV");

    const item = wrapper.find(".item-fonte-dado");
    expect(item.exists()).toBe(true);
    expect(item.classes()).not.toContain("item-fonte-dado-desativado");

    // como urlLogo é null, deve aparecer <span>
    expect(item.find("span").text()).toBe("CSV");
    expect(item.find("img").exists()).toBe(false);
  });

  it("aplica classe item-fonte-dado-desativado quando ativo=false", async () => {
    const wrapper = factory();
    // forçar estado desativado manualmente
    await wrapper.setData({
      tiposFonteDado: [
        {
          descricao: "ERP",
          fontesDados: [
            { descricao: "Omie", urlLogo: "logo.png", ativo: false },
          ],
        },
      ],
    });

    const item = wrapper.find(".item-fonte-dado");
    expect(item.classes()).toContain("item-fonte-dado-desativado");

    // quando tem urlLogo deve renderizar imagem
    expect(item.find("img").attributes("src")).toBe("logo.png");
  });

  it("abre modal ao clicar em 'Ativar sincronização'", async () => {
    const wrapper = factory();

    const link = wrapper.find(".botao-link");
    expect(link.exists()).toBe(true);

    await link.trigger("click");

    // modalAberta deve mudar
    expect(wrapper.vm.modalSincronizacaFonteDadoAberta).toBe(true);

    // modal recebe a prop true
    const modal = wrapper.findComponent({
      name: "SincronizacaoFonteDadoModal",
    });
    expect(modal.props("modalAberta")).toBe(true);
  });
});
