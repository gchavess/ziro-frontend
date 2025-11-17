<template>
  <div class="register-container">
    <div class="register-box">
      <h1 class="register-title">Criar Conta</h1>
      <p class="register-subtitle">Preencha os dados para se cadastrar</p>

      <form @submit.prevent="handleRegister" class="register-form">
        <label for="name">Nome Completo</label>
        <input
          id="name"
          type="text"
          v-model="name"
          placeholder="Seu nome completo"
          required
          autocomplete="name"
        />

        <label for="email">Email</label>
        <input
          id="email"
          type="email"
          v-model="email"
          placeholder="seu@email.com"
          required
          autocomplete="email"
        />

        <label for="password">Senha</label>
        <input
          id="password"
          type="password"
          v-model="password"
          placeholder="********"
          required
          autocomplete="new-password"
        />

        <label for="confirmPassword">Confirmar Senha</label>
        <input
          id="confirmPassword"
          type="password"
          v-model="confirmPassword"
          placeholder="********"
          required
          autocomplete="new-password"
        />

        <div style="display: flex">
          <input
            type="checkbox"
            id="aceitarTermos"
            v-model="aceitouTermos"
            style="
              height: 18px;
              width: 18px;
              margin-right: 12px;
              accent-color: var(--color-primary);
              outline: none;
              box-shadow: none;
            "
          />

          <p class="termos-privacidade">
            Li e aceito os
            <a @click="abrirTermosCondicoes">Termos e Condições</a> de Uso do
            Ziro
          </p>
        </div>
        <button type="submit" class="btn-register">Cadastrar</button>
      </form>

      <p class="register-footer">
        Já tem uma conta?
        <a href="#" @click.prevent="goToLogin">Faça login aqui</a>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import AuthService from "@/services/auth/AuthService";
import { Component, Vue } from "vue-facing-decorator";

@Component({
  components: {},
  directives: {},
  emits: [],
})
export default class CadastroView extends Vue {
  private name: string = "";
  private email: string = "";
  private confirmPassword: string = "";
  private password: string = "";
  public aceitouTermos: boolean = false;

  public async handleRegister() {
    if (!this.aceitouTermos) {
      window.$toast.error(
        "Leia e aceite os Termos de Uso do Asaas para criar a conta."
      );
      return;
    }

    if (this.password !== this.confirmPassword) {
      window.$toast.error("As senhas não coincidem");
      return;
    }

    try {
      await AuthService.criar({
        nome: this.name,
        email: this.email,
        senha: this.password,
      });

      window.$toast.success("Conta criada com sucesso!");

      this.goToLogin();
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);

      window.$toast.error("Ocorreu um erro ao cadastrar. Tente novamente");
    }
  }

  public goToLogin() {
    this.$router.push({ name: "Login" });
  }

  public abrirTermosCondicoes() {
    const url = this.$router.resolve({
      name: "Termos e Condições de Uso",
    }).href;

    window.open(url, "_blank");
  }
}
</script>

<style scoped>
/* Mesma estrutura e cores da tela de login para consistência */

.register-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #b4b4b4, #f0f0f0);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  padding: 1rem;
}

.register-box {
  background: #fff;
  padding: 2.5rem 3rem;
  border-radius: 12px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.register-title {
  font-size: 3rem;
  margin-bottom: 0.2rem;
  color: var(--color-primary);
  font-weight: 700;
}

.register-subtitle {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
}

.register-form {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.register-form label {
  font-weight: 600;
  margin-bottom: 0.3rem;
  color: #444;
}

.register-form input {
  padding: 0.75rem 1rem;
  margin-bottom: 1.5rem;
  border-radius: 8px;
  border: 1.8px solid #ccc;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.register-form input:focus {
  outline: none;
  border-color: var(--color-primary) c;
  box-shadow: 0 0 6px var(--color-primary);
}

.btn-register {
  background-color: var(--color-primary);
  color: white;
  font-weight: 700;
  padding: 0.9rem;
  border: none;
  border-radius: 8px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 0.9rem;
}

.btn-register:hover {
  background-color: var(--color-primary-light);
}

.termos-privacidade {
  font-size: 0.9rem;
  color: #444;
}

.register-footer {
  margin-top: 1.8rem;
  font-size: 0.9rem;
  color: #444;
}

.termos-privacidade a,
.register-footer a {
  color: var(--color-primary);
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
}

.register-footer a:hover,
.termos-privacidade a:hover {
  text-decoration: underline;
}

@media (max-width: 440px) {
  .register-box {
    padding: 2rem 1.5rem;
  }

  .register-title {
    font-size: 2.5rem;
  }
}
</style>
