<template>
  <div class="app-container">
    <nav v-if="mostrarBarraNavegacao" class="navbar">
      <div class="navbar-logo">Ziro</div>
      <ul class="navbar-links">
        <li>
          <router-link to="/fontes-dados" active-class="active">
            Minhas Fontes de Dados
          </router-link>
        </li>
        <li>
          <router-link to="/movimentacao-financeira" active-class="active">
            Movimentação Financeira
          </router-link>
        </li>
        <li>
          <router-link to="/modelagem-financeira" active-class="active">
            Modelagem Financeira
          </router-link>
        </li>
      </ul>
    </nav>
    <main
      class="main-content"
      :style="{ padding: mostrarBarraNavegacao ? '2rem' : '0' }"
    >
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import AuthService from "@/services/auth/AuthService";
import { clearAuth } from "@/store/auth";
import { Component, Vue } from "vue-facing-decorator";
import { useRoute } from "vue-router";

@Component({
  components: {},
  directives: {},
  emits: [],
})
export default class App extends Vue {
  private route = useRoute();

  mounted() {
    this.inicializar();
  }

  private inicializar() {
    this.validarAutenticacao();
  }

  public get mostrarBarraNavegacao(): boolean {
    const nomesQueNaoMostramBarra = ["Login", "Cadastro"];
    return !nomesQueNaoMostramBarra.includes(this.route.name as string);
  }

  private validarAutenticacao() {
    AuthService.validarToken().catch(() => {
      clearAuth();
      this.$router.push({ name: "Login" });
    });
  }
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: var(--color-bg);
  border-bottom: 1px solid #e0e0e0;
  font-family: "Inter", sans-serif;
}

.navbar-logo {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text);
  letter-spacing: -0.5px;
}

.navbar-links {
  display: flex;
  list-style: none;
  gap: 1.5rem;
  margin: 0;
  padding: 0;
}

.navbar-links a {
  color: #555555;
  text-decoration: none;
  font-size: 1rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: color 0.2s ease, background-color 0.2s ease;
}

.navbar-links a:hover {
  background-color: var(--color-hover-bg);
  color: var(--color-primary-light);
}

.navbar-links .active {
  color: var(--color-primary-light);
  font-weight: 500;
  border-bottom: 2px solid var(--color-primary-light);
}

.main-content {
  background-color: var(--color-hover-bg);
  min-height: calc(100vh - 70px);
  font-family: "Inter", sans-serif;
  height: calc(100vh - 70px);
}
</style>
