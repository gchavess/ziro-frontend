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

        <button type="submit" class="btn-register">Cadastrar</button>
      </form>

      <p class="register-footer">
        Já tem uma conta?
        <a href="#" @click.prevent="goToLogin">Faça login aqui</a>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "RegisterView",
  data() {
    return {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
  },
  methods: {
    handleRegister() {
      if (this.password !== this.confirmPassword) {
        alert("As senhas não coincidem!");
        return;
      }
      // Aqui você pode colocar a lógica real de cadastro
      alert(`Cadastro com:\nNome: ${this.name}\nEmail: ${this.email}`);
    },
    goToLogin() {
      // Redirecionar para a tela de login (exemplo)
      this.$router.push({ name: "Login" });
    },
  },
};
</script>

<style scoped>
/* Mesma estrutura e cores da tela de login para consistência */

.register-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #3a9bdc, #3adbc9);
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
  color: #3a9bdc;
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
  border-color: #3a9bdc;
  box-shadow: 0 0 6px #3a9bdc;
}

.btn-register {
  background-color: #3a9bdc;
  color: white;
  font-weight: 700;
  padding: 0.9rem;
  border: none;
  border-radius: 8px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-register:hover {
  background-color: #3180c2;
}

.register-footer {
  margin-top: 1.8rem;
  font-size: 0.9rem;
  color: #444;
}

.register-footer a {
  color: #3a9bdc;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
}

.register-footer a:hover {
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
