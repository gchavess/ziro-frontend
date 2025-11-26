import AuthService from "@/services/auth/AuthService";
import CadastroView from "@/views/login/CadastroView.vue";
import { mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/services/auth/AuthService", () => ({
  default: {
    criar: vi.fn(),
  },
}));

describe("CadastroView.vue", () => {
  let pushMock: any;

  beforeEach(() => {
    pushMock = vi.fn();

    // Mock do toast global
    (window as any).$toast = {
      error: vi.fn(),
      success: vi.fn(),
    };

    // Mock window.open
    window.open = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function factory() {
    return mount(CadastroView, {
      global: {
        mocks: {
          $router: {
            push: pushMock,
            resolve: vi.fn().mockReturnValue({ href: "/termos-condicao-uso" }),
          },
        },
      },
    });
  }

  it("renderiza os elementos da tela de cadastro", () => {
    const wrapper = factory();

    expect(wrapper.text()).toContain("Criar Conta");
    expect(wrapper.find("input#name").exists()).toBe(true);
    expect(wrapper.find("input#email").exists()).toBe(true);
    expect(wrapper.find("input#password").exists()).toBe(true);
    expect(wrapper.find("input#confirmPassword").exists()).toBe(true);
    expect(wrapper.find("button.btn-register").exists()).toBe(true);
  });

  it("mostra erro quando as senhas não coincidem", async () => {
    const wrapper = factory();

    await wrapper.find("#name").setValue("Usuário Teste");
    await wrapper.find("#email").setValue("teste@email.com");
    await wrapper.find("#password").setValue("123456");
    await wrapper.find("#confirmPassword").setValue("654321");

    // Aceita termos
    await wrapper.find("#aceitarTermos").setValue(true);

    await wrapper.find("form").trigger("submit.prevent");

    expect(window.$toast.error).toHaveBeenCalledWith("As senhas não coincidem");
    expect(AuthService.criar).not.toHaveBeenCalled();
  });

  it("realiza cadastro com sucesso", async () => {
    (AuthService.criar as any).mockResolvedValue({ nome: "Usuário Teste" });

    const wrapper = factory();

    await wrapper.find("#name").setValue("Usuário Teste");
    await wrapper.find("#email").setValue("teste@email.com");
    await wrapper.find("#password").setValue("123456");
    await wrapper.find("#confirmPassword").setValue("123456");
    await wrapper.find("#aceitarTermos").setValue(true);

    await wrapper.find("form").trigger("submit.prevent");
    await wrapper.vm.$nextTick();

    expect(AuthService.criar).toHaveBeenCalledWith({
      nome: "Usuário Teste",
      email: "teste@email.com",
      senha: "123456",
    });

    expect(window.$toast.success).toHaveBeenCalledWith(
      "Conta criada com sucesso!"
    );

    expect(pushMock).toHaveBeenCalledWith({ name: "Login" });
  });

  it("mostra erro quando cadastro falha", async () => {
    (AuthService.criar as any).mockRejectedValue(new Error("Falha"));

    const wrapper = factory();

    await wrapper.find("#name").setValue("Usuário Teste");
    await wrapper.find("#email").setValue("teste@email.com");
    await wrapper.find("#password").setValue("123456");
    await wrapper.find("#confirmPassword").setValue("123456");
    await wrapper.find("#aceitarTermos").setValue(true);

    await wrapper.find("form").trigger("submit.prevent");
    await wrapper.vm.$nextTick();

    expect(window.$toast.error).toHaveBeenCalledWith(
      "Ocorreu um erro ao cadastrar. Tente novamente"
    );

    expect(pushMock).not.toHaveBeenCalled();
  });

  it("navega para login ao clicar no link", async () => {
    const wrapper = factory();

    await wrapper.find(".register-footer a").trigger("click.prevent");

    expect(pushMock).toHaveBeenCalledWith({ name: "Login" });
  });

  it("abre Termos e Condições em nova aba", async () => {
    const wrapper = factory();

    await wrapper.find(".termos-privacidade a").trigger("click.prevent");

    expect(wrapper.vm.$router.resolve).toHaveBeenCalledWith({
      name: "Termos e Condições de Uso",
    });

    expect(window.open).toHaveBeenCalledWith("/termos-condicao-uso", "_blank");
  });
});
