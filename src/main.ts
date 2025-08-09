import App from "@/App.vue";
import router from "@/router";
import { createApp } from "vue";

// Importação global dos estilos
import "@/assets/styles/main.css";
import "@/assets/styles/reset.css";
import "@/assets/styles/theme.css";

const app = createApp(App);

// Usar o router
app.use(router);

// Montar
app.mount("#app");
