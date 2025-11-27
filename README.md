# **Ziro — Sistema de Gestão Financeira Inteligente**  
Frontend da aplicação (Vue.js 3 + TypeScript)

Pequenas e médias empresas enfrentam dificuldades em organizar e interpretar suas finanças, o que compromete decisões estratégicas (Serasa Experian, 2020; Contábeis, 2023). Diante desse cenário, surge a necessidade de soluções acessíveis que facilitem o controle e a análise dos dados financeiros (Oliveira Filho & Grossi, 2010; Revista Espacios, 2015).

O **Ziro** foi criado com esse propósito: fornecer uma aplicação web simples, moderna e inteligente para gestão financeira.  
A plataforma permite registrar e analisar lançamentos, visualizar saldos, acompanhar categorias financeiras e — como diferencial — utiliza **inteligência artificial** para identificar padrões, detectar anomalias e sugerir oportunidades de economia, apoiando decisões mais estratégicas.

---

## 🚀 **Tecnologias Utilizadas**

### **Frontend**
- **Vue.js 3 (Composition API)**  
- **TypeScript**  
- **Pinia** para gerenciamento de estado  
- **Vue Router**
- **Axios** para consumo da API  
- **Vite** para build e desenvolvimento  

### **Backend (projeto complementar)**
- Java + Spring Boot  
- Spring Security  
- JPA/Hibernate  
- PostgreSQL  

### **Inteligência Artificial**
- Integração com **API Gemini**, responsável por:
  - análise de dados financeiros,
  - identificação de padrões e tendências,
  - detecção de anomalias,
  - geração de insights automatizados.

---

## 🏗️ **Arquitetura do Projeto**

- Arquitetura baseada em **MVC (Model–View–Controller)**.  
- Comunicação com o backend via **API RESTful**.  
- Módulo de IA recebe dados processados e retorna insights prontos para o usuário.  
- Estrutura escalável e organizada para facilitar manutenção e evolução.  
- Foco forte em **experiência do usuário**, com interface limpa e responsiva.

---

## 💻 **Como Executar o Projeto**

### **1. Clonar o repositório**
```bash
git clone https://github.com/gchavess/ziro-frontend.git
cd ziro-frontend
```

### 2. Instalar dependências
```bash
yarn install
```

### 3. Subir o container
```bash
docker compose up -d --build
```

### 4. Acessar no navegador

```bash
[docker compose up -d --build](http://localhost:5173/)
```
---

👤 Autor

Gustavo Chaves
🔗 GitHub: https://github.com/gchavess

