<template>
  <div class="app-container">
    <nav v-if="mostrarBarraNavegacao" class="navbar">
      <div class="navbar-logo">Ziro</div>
      <ul class="navbar-links">
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
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import { useRoute } from "vue-router";

@Component({
  components: {},
  directives: {},
  emits: [],
})
export default class App extends Vue {
  private route = useRoute();

  public get mostrarBarraNavegacao(): boolean {
    const nomesQueNaoMostramBarra = ["Login", "Cadastro"];
    return !nomesQueNaoMostramBarra.includes(this.route.name as string);
  }
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  font-family: "Inter", sans-serif;
}

.navbar-logo {
  font-size: 1.5rem;
  font-weight: 600;
  color: #222;
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
  color: #555;
  text-decoration: none;
  font-size: 1rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: color 0.2s ease, background-color 0.2s ease;
}

.navbar-links a:hover {
  background-color: #f5f5f5;
  color: #000;
}

.navbar-links .active {
  color: #000;
  font-weight: 500;
  border-bottom: 2px solid #000;
}

.main-content {
  background-color: #fafafa;
  min-height: calc(100vh - 64px);
  font-family: "Inter", sans-serif;
}
</style>
