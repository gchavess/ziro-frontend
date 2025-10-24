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
  let alertMock: any;

  beforeEach(() => {
    pushMock = vi.fn();
    alertMock = vi.fn();
    vi.stubGlobal("alert", alertMock);

    // Mock do toast global
    (window as any).$toast = {
      error: vi.fn(),
      success: vi.fn(),
    };
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

  it("mostra erro quando senhas não coincidem", async () => {
    const wrapper = factory();

    await wrapper.find("#name").setValue("Usuário Teste");
    await wrapper.find("#email").setValue("teste@email.com");
    await wrapper.find("#password").setValue("123456");
    await wrapper.find("#confirmPassword").setValue("654321");

    await wrapper.find("form").trigger("submit.prevent");

    expect(alertMock).toHaveBeenCalledWith("As senhas não coincidem!");
    expect(AuthService.criar).not.toHaveBeenCalled();
  });

  it("realiza cadastro com sucesso", async () => {
    (AuthService.criar as any).mockResolvedValue({ nome: "Usuário Teste" });

    const wrapper = factory();

    await wrapper.find("#name").setValue("Usuário Teste");
    await wrapper.find("#email").setValue("teste@email.com");
    await wrapper.find("#password").setValue("123456");
    await wrapper.find("#confirmPassword").setValue("123456");

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

    await wrapper.find("form").trigger("submit.prevent");
    await wrapper.vm.$nextTick();

    expect(window.$toast.error).toHaveBeenCalledWith(
      "Ocorreu um erro ao cadastrar. Tente novamente"
    );
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("navega para login ao clicar no link", async () => {
    const wrapper = factory();
    await wrapper.find("a").trigger("click.prevent");
    expect(pushMock).toHaveBeenCalledWith({ name: "Login" });
  });
});
