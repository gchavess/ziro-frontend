<template>
  <div class="login-container">
    <div class="login-box">
      <h1 class="login-title">Ziro</h1>
      <p class="login-subtitle">Faça seu login para continuar</p>

      <form @submit.prevent="handleLogin" class="login-form">
        <label for="email">Email</label>
        <input
          id="email"
          type="email"
          v-model="email"
          placeholder="seu@email.com"
          required
          autocomplete="username"
        />

        <label for="password">Senha</label>
        <input
          id="password"
          type="password"
          v-model="password"
          placeholder="********"
          required
          autocomplete="current-password"
        />

        <button type="submit" class="btn-login">Entrar</button>
      </form>

      <p class="login-footer">
        Não tem conta?
        <a href="#" @click.prevent="goToRegister">Crie uma agora</a>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import AuthService from "@/services/auth/AuthService";
import { setAuth } from "@/store/auth";
import { Component, Vue } from "vue-facing-decorator";

@Component({
  components: {},
  directives: {},
  emits: [],
})
export default class LoginView extends Vue {
  private email: string = "";
  private password: string = "";

  public handleLogin() {
    AuthService.login({
      email: this.email,
      senha: this.password,
    })
      .then((response) => {
        const dados = response.data;
        setAuth(
          dados.token,
          dados.usuarioId.toString(),
          dados.nome,
          dados.iniciaisNome
        );
        this.$router.push({ name: "Movimentação Financeira" });
      })
      .catch(() => {
        window.$toast.error("Email ou senha inválidos");
      });
  }

  public goToRegister() {
    this.$router.push({ name: "Cadastro" });
  }
}
</script>

<style scoped>
/* Fundo geral com gradiente */
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #b4b4b4, #f0f0f0);

  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  padding: 1rem;
}

/* Caixa branca com sombra */
.login-box {
  background: #fff;
  padding: 2.5rem 3rem;
  border-radius: 12px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

/* Título principal */
.login-title {
  font-size: 3rem;
  margin-bottom: 0.2rem;
  color: var(--color-primary);
  font-weight: 700;
  transition: transform 0.2s ease;
}

.login-title:hover {
  transform: scale(1.05);
}

/* Subtítulo */
.login-subtitle {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
}

/* Formulário */
.login-form {
  display: flex;
  flex-direction: column;
  text-align: left;
}

/* Labels */
.login-form label {
  font-weight: 600;
  margin-bottom: 0.3rem;
  color: #444;
}

/* Inputs */
.login-form input {
  padding: 0.75rem 1rem;
  margin-bottom: 1.5rem;
  border-radius: 8px;
  border: 1.8px solid #ccc;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.login-form input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 6px var(--color-primary);
}

/* Botão */
.btn-login {
  background-color: var(--color-primary);
  color: white;
  font-weight: 700;
  padding: 0.9rem;
  border: none;
  border-radius: 8px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-login:hover {
  background-color: var(--color-primary-light);
}

/* Rodapé com link */
.login-footer {
  margin-top: 1.8rem;
  font-size: 0.9rem;
  color: #444;
}

.login-footer a {
  color: var(--color-primary);
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
}

.login-footer a:hover {
  text-decoration: underline;
}

/* Responsividade */
@media (max-width: 440px) {
  .login-box {
    padding: 2rem 1.5rem;
  }

  .login-title {
    font-size: 2.5rem;
  }
}
</style>
