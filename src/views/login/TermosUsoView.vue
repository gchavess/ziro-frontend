<template>
  <div class="termos-container">
    <div class="termos-box">
      <h1 class="termos-title">Termos e Condições de Uso</h1>

      <div @submit.prevent="handleRegister" class="termos-form">
        <span>Última atualização: 18/10/2025</span>

        <span>
          Bem-vindo ao <b>Ziro</b>, uma aplicação web voltada à gestão
          financeira empresarial, oferecendo funcionalidades de registro de
          lançamentos, importação de arquivos, categorização, visualização
          gráfica e recursos de inteligência artificial para apoio à tomada de
          decisão.
        </span>

        <span>
          Ao criar uma conta e utilizar o Ziro, você confirma que leu,
          compreendeu e concorda com estes Termos de Uso. Caso não concorde, não
          utilize a plataforma.
        </span>

        <!-- 1. DEFINIÇÕES -->
        <span><b>1. Definições</b></span>

        <span><b>Usuário</b></span>
        <span>
          Pessoa física que cria uma conta no Ziro fornecendo nome, e-mail e
          senha, utilizando a plataforma para registrar, importar e analisar
          informações financeiras.
        </span>

        <span><b>Plataforma Ziro</b></span>
        <span>
          Sistema web acessível via navegador, disponibilizado para gestão,
          categorização e análise financeira.
        </span>

        <span><b>Dados Financeiros</b></span>
        <span>
          Informações financeiras inseridas voluntariamente pelo Usuário, como
          lançamentos, categorias, naturezas, contas, contextos e arquivos
          importados nos formatos CSV ou Excel.
        </span>

        <span><b>IA / Gemini</b></span>
        <span>
          Serviço externo de inteligência artificial (Google AI) utilizado para
          gerar análises, identificar padrões, detectar anomalias e fornecer
          insights financeiros dentro da plataforma.
        </span>

        <!-- 2. OBJETO -->
        <span><b>2. Objeto</b></span>

        <span>
          Os presentes Termos têm por finalidade regular o uso da Plataforma
          Ziro, que disponibiliza recursos para cadastro de usuários, registro e
          importação de lançamentos financeiros, categorização, visualização
          gráfica, relatórios, análise de padrões e suporte por inteligência
          artificial.
        </span>

        <span>
          A plataforma não realiza operações financeiras, pagamentos,
          movimentações bancárias reais ou integração automática com
          instituições financeiras.
        </span>

        <!-- 3. CADASTRO E ACESSO -->
        <span><b>3. Cadastro e Acesso</b></span>

        <span>
          Para utilizar o Ziro, o Usuário deve fornecer nome, e-mail e senha
          válidos, sendo responsável por manter suas credenciais em sigilo e por
          todas as ações realizadas em sua conta.
        </span>

        <span>
          O Ziro pode suspender ou remover contas que violem estes Termos ou
          apresentem risco à segurança da plataforma.
        </span>

        <!-- 4. USO DA PLATAFORMA -->
        <span><b>4. Uso da Plataforma</b></span>

        <span>
          O Usuário concorda em utilizar o Ziro apenas para fins legítimos,
          inserindo apenas informações verdadeiras e evitando o envio de dados
          sensíveis desnecessários, como informações de saúde, religião ou dados
          pessoais de terceiros.
        </span>

        <span>
          É proibido tentar modificar, burlar ou acessar áreas não autorizadas
          da plataforma, bem como realizar engenharia reversa ou qualquer ação
          que comprometa o funcionamento do sistema.
        </span>

        <!-- 5. LGPD E TRATAMENTO DE DADOS -->
        <span><b>5. Tratamento de Dados Pessoais (LGPD)</b></span>

        <span>
          O Ziro realiza o tratamento de dados pessoais conforme a Lei Geral de
          Proteção de Dados (Lei 13.709/2018), adotando medidas de proteção
          técnica e administrativa para garantir a segurança das informações.
        </span>

        <span><b>5.1. Dados coletados</b></span>
        <span>
          • Nome, e-mail e senha criptografada;<br />
          • Dados financeiros inseridos pelo Usuário;<br />
          • Logs de acesso, endereço IP e registros de uso.
        </span>

        <span><b>5.2. Finalidades</b></span>
        <span>
          Os dados são utilizados para permitir cadastro, autenticação,
          funcionamento da plataforma, geração de gráficos, relatórios, análise
          financeira e segurança do sistema.
        </span>

        <span><b>5.3. Direitos do Usuário</b></span>
        <span>
          O Usuário pode solicitar acesso, correção, atualização, portabilidade
          ou exclusão de seus dados, bem como revogar qualquer consentimento
          concedido.
        </span>

        <!-- 6. GEMINI / IA -->
        <span><b>6. Compartilhamento com Terceiros (Gemini)</b></span>

        <span>
          Parte dos dados financeiros pode ser enviada ao serviço Gemini (Google
          AI) para processamento, exclusivamente para gerar análises, insights e
          alertas inteligentes, sem finalidade comercial.
        </span>

        <span>
          O Ziro aplica práticas de minimização e, quando possível, anonimização
          dos dados enviados. Nenhuma informação é retida permanentemente pelo
          serviço.
        </span>

        <span>
          O Usuário pode revogar esta autorização a qualquer momento em sua
          conta.
        </span>

        <!-- 7. SEGURANÇA -->
        <span><b>7. Segurança</b></span>

        <span>
          A plataforma é hospedada em ambiente seguro na AWS EC2, com firewall e
          acesso restrito por credenciais.
        </span>

        <!-- 8. RESPONSABILIDADES -->
        <span><b>8. Responsabilidades e Limitações</b></span>

        <span>
          O Ziro não garante disponibilidade ininterrupta, ausência de falhas ou
          total precisão nos insights gerados pela IA. Os dados e análises têm
          caráter exclusivamente informativo.
        </span>

        <span>
          O Usuário é responsável por qualquer decisão financeira tomada com
          base nos relatórios ou insights fornecidos pela plataforma.
        </span>

        <!-- 9. PROPRIEDADE INTELECTUAL -->
        <span><b>9. Propriedade Intelectual</b></span>

        <span>
          Todo o conteúdo, marca, layout, código e design do Ziro são protegidos
          por direitos autorais. É proibido copiar, reproduzir, redistribuir,
          realizar engenharia reversa ou criar sistemas derivados sem
          autorização.
        </span>

        <!-- 10. CANCELAMENTO E EXCLUSÃO -->
        <span><b>10. Cancelamento e Exclusão</b></span>

        <span>
          O Usuário pode solicitar a exclusão de sua conta e de todos os dados
          relacionados, respeitando obrigações legais de retenção.
        </span>

        <span>
          O Ziro pode suspender ou cancelar contas que violem estes Termos ou
          comprometam a segurança do sistema.
        </span>

        <!-- 11. ALTERAÇÕES -->
        <span><b>11. Alterações nos Termos</b></span>

        <span>
          Os Termos de Uso podem ser atualizados periodicamente. Mudanças
          relevantes serão comunicadas ao Usuário, que deverá aceitar a nova
          versão para continuar utilizando a plataforma.
        </span>

        <!-- 12. CONTATO -->
        <span><b>12. Contato</b></span>

        <span>
          Em caso de dúvidas, solicitações ou exercício de direitos previstos na
          LGPD, entre em contato através do e-mail: suporte@ziroapp.com.
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";

@Component({
  components: {},
  directives: {},
  emits: [],
})
export default class TermosUsoView extends Vue {}
</script>

<style scoped>
.termos-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #b4b4b4, #f0f0f0);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  padding: 1rem;
}

.termos-box {
  background: #fff;
  padding: 2.5rem 3rem;
  border-radius: 12px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 800px;
  text-align: center;
}

.termos-title {
  font-size: 3rem;
  margin-bottom: 0.2rem;
  color: var(--color-primary);
  font-weight: 700;
}

.termos-subtitle {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
}

.termos-form {
  display: flex;
  flex-direction: column;
  text-align: left;
  height: calc(100vh - 300px);
  overflow: auto;
  display: flex;
  gap: 12px;
}

.termos-form label {
  font-weight: 600;
  margin-bottom: 0.3rem;
  color: #444;
}

.termos-form input {
  padding: 0.75rem 1rem;
  margin-bottom: 1.5rem;
  border-radius: 8px;
  border: 1.8px solid #ccc;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.termos-form input:focus {
  outline: none;
  border-color: var(--color-primary) c;
  box-shadow: 0 0 6px var(--color-primary);
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
