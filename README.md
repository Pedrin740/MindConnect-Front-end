# 🧠 Mind Connect — FIAP | Global Solution 2026

## 📌 1. Título e descrição do projeto

**Nome do Projeto:** Mind Connect

**Objetivo do Projeto:**

O Mind Connect é uma plataforma digital desenvolvida com o objetivo de facilitar o acesso a informações sobre saúde mental, serviços de acolhimento e conteúdos educativos. A solução busca aproximar os usuários de recursos de apoio disponíveis na cidade de São Paulo, contribuindo para a disseminação de informações e para a promoção do bem-estar emocional.

A plataforma reúne funcionalidades de consulta de serviços de acolhimento, visualização geográfica de unidades, acesso a conteúdos informativos, registro pessoal de bem-estar e comunicação com a equipe responsável.

### 💜 Principais funcionalidades

- **Serviços de acolhimento:** consulta de unidades e serviços disponíveis na cidade de São Paulo.
- **Mapa de serviços:** visualização geográfica das unidades cadastradas na plataforma.
- **Conteúdos:** acesso a materiais educativos relacionados à saúde mental.
- **Diário de bem-estar:** registro de sentimentos, experiências e acompanhamento pessoal.
- **Contato:** envio de dúvidas, sugestões e feedbacks.
- **Autenticação:** cadastro, login e gerenciamento da conta do usuário.
- **Personalização:** escolha entre os temas claro, intermediário e escuro.
- **Administração:** acesso às funcionalidades administrativas da plataforma.

---

## 💻 2. Tecnologias utilizadas

As seguintes tecnologias e ferramentas foram utilizadas no desenvolvimento do projeto:

**Front-end:**

1. React
2. Vite
3. TypeScript
4. Tailwind CSS
5. React Router DOM
6. React Hook Form
7. Lucide React
8. Leaflet
9. React Leaflet

**Back-end:**

1. Java
2. Spring Boot
3. JDBC
4. Oracle Database
5. Bean Validation
6. ModelMapper

**Ferramentas e serviços:**

- Git e GitHub — versionamento e gerenciamento do código-fonte.
- Visual Studio Code — ambiente de desenvolvimento.
- IntelliJ IDEA — desenvolvimento do back-end.
- Oracle SQL Developer — gerenciamento do banco de dados.
- Oracle Data Modeler — modelagem do banco de dados.
- Vercel — hospedagem do front-end.
- Render — hospedagem do back-end.

---

## 🔌 3. API utilizada no projeto

O Mind Connect utiliza uma API própria, desenvolvida pela equipe, responsável pela comunicação entre o front-end e o banco de dados Oracle.

**URL da API:**

https://mindconnect-backend-ashz.onrender.com

A API disponibiliza os dados utilizados pelas funcionalidades da plataforma, incluindo usuários, serviços de acolhimento, categorias, conteúdos, registros de bem-estar, favoritos e mensagens de contato.

**Banco de dados:** Oracle Database.

---

## 📂 4. Estrutura de pastas do projeto

Abaixo está a organização geral dos principais diretórios e arquivos do front-end:

```text
MindConnect-Frontend/
│
├── 📄 index.html
├── 📄 package.json
├── 📄 package-lock.json
├── 📄 vite.config.ts
├── 📄 tsconfig.json
├── 📄 tsconfig.app.json
├── 📄 tsconfig.node.json
├── 📄 .gitignore
├── 📄 .env.example
├── 📄 README.md
│
├── 📁 public/
│   └── 📁 images/
│       ├── 📄 logo-mindconnect.png
│       └── 📁 imagens utilizadas na plataforma
│
└── 📁 src/
    │
    ├── 📄 App.tsx
    ├── 📄 main.tsx
    ├── 📄 index.css
    │
    ├── 📁 assets/
    │
    ├── 📁 components/
    │   └── Componentes reutilizáveis da interface
    │
    ├── 📁 context/
    │   ├── AuthContext.tsx
    │   └── ThemeContext.tsx
    │
    ├── 📁 services/
    │   └── api.ts
    │
    └── 📁 pages/
        ├── Cadastro.tsx
        ├── Contato.tsx
        ├── Conteudos.tsx
        ├── Diario.tsx
        ├── FAQ.tsx
        ├── Home.tsx
        ├── Integrantes.tsx
        ├── Login.tsx
        ├── Servicos.tsx
        └── Sobre.tsx
```

*Observação: a estrutura apresenta os principais diretórios e arquivos da aplicação. Os nomes e a organização devem corresponder à versão final existente no repositório.*

---

## 👥 5. Autores e créditos

O projeto foi desenvolvido pelos seguintes integrantes:

### 1. Guilherme Joel de Camargo
- **RM:** 570403
- **Turma:** 1TDSPK
- **GitHub:** [guilhermejcam](https://github.com/guilhermejcam)

### 2. Pedro Felipe de Castro Rosa
- **RM:** 569049
- **Turma:** 1TDSPK
- **GitHub:** [Pedrin740](https://github.com/Pedrin740)
- **LinkedIn:** [Pedro Felipe de Castro Rosa](https://www.linkedin.com/in/pedro-felipe-castro-rosa/)

### 3. Pedro Henrique Cardoso Cavalcante de Souza
- **RM:** 570464
- **Turma:** 1TDSPK
- **GitHub:** [pedrostack-01](https://github.com/pedrostack-01)

### 4. Rafaela Donadio Figueiredo Tavares
- **RM:** 572797
- **Turma:** 1TDSPK
- **GitHub:** [mrafahdft](https://github.com/mrafahdft)

### 5. Victor Ferreira Gomes
- **RM:** 569273
- **Turma:** 1TDSPK
- **GitHub:** [Victor180422](https://github.com/Victor180422)

---

## 🚀 6. Como executar o projeto

Para executar o front-end localmente, é necessário possuir o Node.js instalado.

**1. Clone o repositório:**

```bash
git clone https://github.com/Pedrin740/MindConnect-Frontend.git
```

**2. Entre na pasta do projeto:**

```bash
cd MindConnect-Frontend
```

**3. Instale as dependências:**

```bash
npm install
```

**4. Configure as variáveis de ambiente:**

Crie um arquivo `.env` na raiz do projeto com a seguinte configuração:

```env
VITE_API_URL=https://mindconnect-backend-ashz.onrender.com
```

**5. Execute a aplicação:**

```bash
npm run dev
```

Após a inicialização, o Vite disponibilizará um endereço local para acessar a plataforma pelo navegador.

---

## 🌐 7. Links do projeto

**📁 Repositório do GitHub — Front-end:**

https://github.com/Pedrin740/MindConnect-Frontend

**📁 Repositório do GitHub — Back-end:**

https://github.com/Pedrin740/MindConnect-Backend

**💻 Plataforma hospedada no Vercel:**

https://mind-connect-front-end.vercel.app

**🔌 API hospedada no Render:**

https://mindconnect-backend-ashz.onrender.com

**🎥 Vídeo de apresentação no YouTube:**

https://youtu.be/0WRkPZk6bOc

---

## ✉️ 8. Contato

Para dúvidas, sugestões ou informações sobre o projeto, entre em contato com os integrantes por meio dos e-mails institucionais:

1. **Guilherme Joel de Camargo:** RM570403@fiap.com.br
2. **Pedro Felipe de Castro Rosa:** RM569049@fiap.com.br
3. **Pedro Henrique Cardoso Cavalcante de Souza:** RM570464@fiap.com.br
4. **Rafaela Donadio Figueiredo Tavares:** RM572797@fiap.com.br
5. **Victor Ferreira Gomes:** RM569273@fiap.com.br

---

**Mind Connect — Conectando pessoas ao cuidado. 💜**