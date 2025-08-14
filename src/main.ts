import App from "@/App.vue";
import router from "@/router";
import { createApp } from "vue";

// Importação global dos estilos
import "@/assets/styles/main.css";
import "@/assets/styles/reset.css";
import "@/assets/styles/theme.css";

// Importação do estado de autenticação
import { loadToken } from "@/store/auth";

const app = createApp(App);
loadToken();

// Usar o router
app.use(router);

// Montar
app.mount("#app");
