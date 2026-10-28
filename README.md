# Instagram Analytics — Frontend Dashboard

Interface web para análise de dados de perfis Instagram Business.
Construída com React e integrada ao pipeline ETL via API REST.

Desenvolvido como parte de pesquisa PIBIC sobre métricas de engajamento em redes sociais.

---

## Índice

1. [Visão Geral](#visão-geral)
2. [Stack Técnica](#stack-técnica)
3. [Pré-requisitos](#pré-requisitos)
4. [Configuração e Execução](#configuração-e-execução)
5. [Arquitetura do Frontend](#arquitetura-do-frontend)
6. [Fluxo de Autenticação](#fluxo-de-autenticação)
7. [Segurança — Gerenciamento de Token](#segurança--gerenciamento-de-token)
8. [Páginas e Componentes](#páginas-e-componentes)
9. [Client da API — backendClient.js](#client-da-api--backendclientjs)
10. [Internacionalização (i18n)](#internacionalização-i18n)
11. [Estrutura de Arquivos](#estrutura-de-arquivos)
12. [Variáveis de Ambiente](#variáveis-de-ambiente)

---

## Visão Geral

O frontend é uma **camada de apresentação pura** — não contém lógica de negócio, não manipula tokens de acesso e não faz chamadas diretas à Meta Graph API.

Toda a lógica de coleta, processamento e análise de dados é responsabilidade do backend. O frontend apenas:

1. Gerencia o fluxo OAuth (redireciona para as URLs geradas pelo backend)
2. Armazena apenas o `profile_id` em `sessionStorage` após o login
3. Consome os endpoints do backend enviando `X-Profile-ID` no header
4. Exibe os dados em visualizações interativas

### Funcionalidades

- **Login OAuth** via Facebook Business Login ou Instagram Business Login
- **Coleta inicial automática** — ao fazer login, dispara `POST /collect/initial`
- **Atualização on-demand** — botão para disparar `POST /collect/refresh`
- **3 abas de visualização:**
  - 👤 **Visão Geral** — dados do perfil e sparkline de crescimento de seguidores
  - 📷 **Posts** — grade de posts com métricas de engajamento por post
  - 📊 **Analytics** — ranking de posts, engajamento por formato, melhores horários, tendência de engajamento
- **Suporte a 3 idiomas** — Português, Inglês e Espanhol

---

## Stack Técnica

| Componente | Tecnologia | Versão |
|------------|-----------|--------|
| Framework UI | React | 19.x |
| Roteamento | React Router DOM | 7.x |
| Estilos | Vanilla CSS | — |
| Internacionalização | Context API customizado | — |
| Comunicação API | Fetch API nativa | — |
| Build tool | Create React App | 5.x |
| Runtime | Node.js | 18+ |

**Sem dependências de UI externas** (sem MUI, Ant Design ou similares) — toda a interface é construída com CSS puro para máximo controle sobre o design.

---

## Pré-requisitos

- Node.js 18 ou superior
- npm 9+ ou yarn
- Backend (`backend-ig-analysis`) rodando localmente ou em produção

---

## Configuração e Execução

### 1. Instale as dependências

```bash
cd frontend-ig-analysis
npm install
```

### 2. Configure o arquivo `.env`

Crie um arquivo `.env` na raiz do projeto frontend:

```env
# URL do backend FastAPI (sem barra final)
REACT_APP_BACKEND_URL=http://localhost:8000
```

Em produção:
```env
REACT_APP_BACKEND_URL=https://api.socialdatalab.online
```

### 3. Execute em desenvolvimento

```bash
npm start
```

O app estará disponível em **http://localhost:3000**.

### 4. Build de produção

```bash
npm run build
```

Os arquivos estáticos serão gerados em `build/`. Configure seu servidor web (nginx, Apache, etc.) para servir o `index.html` para todas as rotas.

**Configuração nginx (SPA):**
```nginx
server {
    listen 80;
    root /var/www/frontend/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## Arquitetura do Frontend

```
┌─────────────────────────────────────────────────────────────┐
│                        React App                             │
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │  LanguageCtx │    │   Router     │    │  Components  │  │
│  │  (i18n)      │    │  (pages)     │    │  (shared)    │  │
│  └──────────────┘    └──────┬───────┘    └──────────────┘  │
│                             │                                │
│           ┌─────────────────┼─────────────────┐            │
│           ▼                 ▼                 ▼            │
│       Dashboard          FbCallback        Home/Privacy     │
│           │                 │              Terms/Deletion   │
│           │                 │                               │
│           ▼                 ▼                               │
│      backendClient.js  backendClient.js                     │
│      (X-Profile-ID)    (POST /oauth/fb/save)                │
│           │                                                  │
└───────────┼──────────────────────────────────────────────--─┘
            │ HTTP (Fetch API)
            ▼
    Backend FastAPI API
    (localhost:8000 ou produção)
```

### Princípio de design: Frontend Dumb

O frontend segue o princípio de **separação estrita de responsabilidades**:

```
❌ O que o frontend NÃO faz:
  - Calcular métricas de engajamento
  - Chamar a Meta Graph API diretamente
  - Armazenar access_token em sessionStorage/localStorage
  - Fazer lógica de negócio (somas, médias, rankings)

✅ O que o frontend faz:
  - Exibir dados retornados pelo backend
  - Gerenciar estado de UI (loading, error, tabs ativas)
  - Navegar nas rotas
  - Redirecionar o usuário para URLs OAuth geradas pelo backend
  - Enviar X-Profile-ID no header de cada requisição autenticada
```

---

## Fluxo de Autenticação

### Login via Facebook Business Login

```
1. Usuário clica "Login with Facebook"
   └─→ GET /oauth/fb/url  (backend gera URL)
        └─→ Redireciona para facebook.com/dialog/oauth

2. Facebook redireciona para /auth/fb/callback#access_token=...
   └─→ FbCallback.js processa o hash

3. FbCallback.js:
   ├─→ Extrai o token do hash da URL
   ├─→ Chama GET graph.facebook.com/me/accounts (busca páginas do Facebook)
   ├─→ Busca a conta Instagram Business vinculada
   ├─→ Chama POST /oauth/fb/save { access_token, user_id, username }
   │    └─→ Backend salva token em MongoDB (oauth_tokens)
   ├─→ Salva APENAS profile_id em sessionStorage ("ig_profile_id")
   └─→ Redireciona para /dashboard

4. Dashboard detecta profile_id em sessionStorage
   ├─→ Dispara POST /collect/initial (coleta inicial automática)
   └─→ Carrega dados dos endpoints /data/* e /analytics/*
```

> **Nota:** O `FbCallback.js` ainda acessa a Graph API uma vez para descobrir o `instagram_business_account.id` — isso é necessário porque o implicit flow do Facebook não retorna o IG user_id diretamente. O token não é armazenado após esse uso.

### Login via Instagram Business Login

```
1. Usuário clica "Login with Instagram"
   └─→ GET /oauth/ig/url (backend gera URL)
        └─→ Redireciona para api.instagram.com/oauth/authorize

2. Instagram redireciona para REDIRECT_URI?code=...
   └─→ Dashboard.js processa o code nos query params

3. Dashboard.js:
   ├─→ Chama GET /oauth/callback?code=...&is_instagram_only=true
   │    ├─→ Backend troca code por short-lived token
   │    ├─→ Backend troca por long-lived token (~60 dias)
   │    ├─→ Backend busca profile_id na Graph API
   │    └─→ Backend salva em MongoDB → retorna { user_id }
   ├─→ Salva profile_id em sessionStorage
   └─→ Dispara POST /collect/initial
```

---

## Segurança — Gerenciamento de Token

Esta é a decisão de arquitetura mais importante do frontend:

### ❌ Antes (inseguro)

```javascript
// Token exposto diretamente na URL → visível em logs, proxy, DevTools
const data = await fetch(
  `https://graph.facebook.com/me?access_token=${accessToken}`
);

// Token armazenado no sessionStorage → acessível via JS qualquer
sessionStorage.setItem("fb_access_token", token);
```

### ✅ Depois (seguro)

```javascript
// Apenas profile_id é armazenado — sem token
sessionStorage.setItem("ig_profile_id", profileId);

// Todas as chamadas passam pelo backend com X-Profile-ID
const data = await backendGet("/data/profile");
// header automático: { "X-Profile-ID": "17841400000000000" }

// O backend busca o token no MongoDB e faz a chamada à API
// O token NUNCA sai do servidor
```

### Ciclo de vida da sessão

```
Login OAuth
    └─→ sessionStorage["ig_profile_id"] = "17841400000000000"

Chamadas autenticadas
    └─→ header: X-Profile-ID: 17841400000000000
         └─→ Backend valida contra oauth_tokens no MongoDB

Token expirado
    └─→ Backend retorna HTTP 401
         └─→ Frontend exibe mensagem "Faça login novamente"

Logout
    └─→ sessionStorage.removeItem("ig_profile_id")
         └─→ Estado React zerado — nenhum dado persiste
```

> `sessionStorage` foi escolhido em vez de `localStorage` para que os dados sejam automaticamente limpos quando o usuário fecha a aba/janela — reduzindo o risco de sessões esquecidas.

---

## Páginas e Componentes

### Páginas (`src/Pages/`)

#### `Dashboard.js` — Página principal

A página mais complexa do app. Gerencia todo o ciclo de vida da sessão e exibe os dados analíticos.

**Estado principal:**
| State | Tipo | Descrição |
|-------|------|-----------|
| `isConnected` | boolean | Se o usuário está autenticado |
| `profileId` | string | profile_id lido do sessionStorage |
| `profile` | object | Dados do perfil (`/data/profile`) |
| `posts` | array | Lista de posts (`/data/posts`) |
| `topPosts` | array | Ranking de posts (`/analytics/top-posts`) |
| `bestHours` | array | Melhores horários (`/analytics/best-hours`) |
| `byFormat` | array | ER por formato (`/analytics/by-format`) |
| `engagementTrend` | array | Tendência 30d (`/analytics/engagement-trend`) |
| `postEngagement` | array | Histórico ER do post selecionado |
| `collecting` | boolean | Se uma coleta está em andamento |
| `collectSteps` | array | Resultado detalhado da última coleta |
| `activeTab` | string | Tab ativa: `overview` \| `posts` \| `analytics` |

**Tabs:**

| Tab | Dados exibidos | Endpoints consumidos |
|-----|---------------|---------------------|
| 👤 Visão Geral | Foto, username, seguidores, seguindo, posts, sparkline de crescimento | `/data/profile`, `/data/snapshots` |
| 📷 Posts | Grade de posts, seletor, métricas ER do post | `/data/posts`, `/data/engagement/{post_id}` |
| 📊 Analytics | Top posts (tabela), por formato (cards), melhores horários (barras), tendência (sparkline) | `/analytics/*` |

#### `FbCallback.js` — Callback do Facebook OAuth

Processa o token retornado pelo Facebook no hash da URL. Executado uma única vez após o redirect do Facebook. Salva apenas o `profile_id` (não o token) e redireciona para `/dashboard`.

#### `Home.js`
Página de landing. Links para o dashboard e documentação de privacidade/termos.

#### `Privacy.js`, `Terms.js`, `DataDeletion.js`
Páginas legais exigidas pela Meta Platform para aprovação do app.

### Componentes (`src/components/`)

| Componente | Descrição |
|------------|-----------|
| `LanguageSelector` | Dropdown para troca de idioma (PT/EN/ES) |

### Sub-componentes inline no Dashboard

| Componente | Props | Descrição |
|------------|-------|-----------|
| `MetricCard` | `label`, `value`, `icon` | Card de métrica individual |
| `LoadingSpinner` | — | Indicador de carregamento com animação |
| `ErrorMessage` | `message` | Mensagem de erro formatada |

---

## Client da API — backendClient.js

O arquivo `src/api/backendClient.js` é o único ponto de comunicação com o backend. **Nenhum outro arquivo deve usar `fetch()` diretamente para chamadas autenticadas.**

### Funções exportadas

```javascript
// Salva profile_id em sessionStorage
saveProfileId(profileId: string): void

// Recupera profile_id do sessionStorage
getProfileId(): string | null

// Remove profile_id do sessionStorage (logout)
clearProfileId(): void

// GET autenticado — injeta X-Profile-ID automaticamente
// params: objeto que será serializado como query string
backendGet(path: string, params?: object): Promise<any>

// POST autenticado — injeta X-Profile-ID automaticamente
backendPost(path: string, body?: object): Promise<any>

// GET público — sem X-Profile-ID (usar apenas em rotas OAuth)
backendGetPublic(path: string): Promise<any>

// POST público — sem X-Profile-ID (usar apenas em rotas OAuth)
backendPostPublic(path: string, body?: object): Promise<any>
```

### Exemplo de uso

```javascript
import { backendGet, backendPost, saveProfileId } from '../api/backendClient';

// Após login OAuth — salvar profile_id
saveProfileId("17841400000000000");

// Buscar dados do perfil
const profile = await backendGet("/data/profile");
// Requisição: GET /data/profile | Header: X-Profile-ID: 17841400000000000

// Buscar top posts com parâmetros
const tops = await backendGet("/analytics/top-posts", { metric: "er_reach", limit: 5 });
// Requisição: GET /analytics/top-posts?metric=er_reach&limit=5

// Disparar coleta
const result = await backendPost("/collect/refresh");
```

### Tratamento de erros

Todos os helpers lançam um `Error` com a mensagem retornada pelo backend (`detail` ou `message`). O componente consumidor deve fazer `try/catch` ou usar `.catch()`.

```javascript
try {
  const data = await backendGet("/data/profile");
  setProfile(data);
} catch (err) {
  setError("profile", err.message);
  // err.message = "Perfil não encontrado. Execute /collect/initial primeiro."
}
```

---

## Internacionalização (i18n)

O app suporta 3 idiomas com um sistema de i18n customizado baseado em `Context API`.

### Idiomas disponíveis

| Idioma | Código | Arquivo |
|--------|--------|---------|
| Português | `pt` | `src/translations/pt.js` |
| English | `en` | `src/translations/en.js` |
| Español | `es` | `src/translations/es.js` |

### Como usar

```javascript
import { useLanguage } from "../contexts/LanguageContext";
import { getTranslation } from "../translations";

function MyComponent() {
  const { language } = useLanguage();
  const t = getTranslation(language);

  return <h1>{t.dashboard.title}</h1>;
}
```

### Estrutura das traduções

```javascript
// src/translations/pt.js
export const pt = {
  home: { title: "Social Data Lab", ... },
  dashboard: {
    title: "Dashboard Instagram Business",
    followers: "Seguidores",
    profileTitle: "Perfil Básico",
    // ...
  },
  privacy: { ... },
  terms: { ... },
};
```

### Adicionando uma nova chave de tradução

1. Adicione a chave nos 3 arquivos: `pt.js`, `en.js`, `es.js`
2. Use via `t.secao.chave` no componente

---

## Estrutura de Arquivos

```
frontend-ig-analysis/
├── public/
│   ├── index.html              # Template HTML (meta tags SEO)
│   └── favicon.ico
├── src/
│   ├── api/
│   │   └── backendClient.js    # ← Cliente centralizado do backend
│   ├── components/
│   │   └── LanguageSelector.js # Seletor de idioma
│   ├── contexts/
│   │   └── LanguageContext.js  # Context de internacionalização
│   ├── Pages/
│   │   ├── Dashboard.js        # ← Página principal com analytics
│   │   ├── FbCallback.js       # ← Callback OAuth do Facebook
│   │   ├── Home.js             # Landing page
│   │   ├── Privacy.js          # Política de privacidade (exigência Meta)
│   │   ├── Terms.js            # Termos de uso
│   │   └── DataDeletion.js     # Página de exclusão de dados (exigência Meta)
│   ├── translations/
│   │   ├── constants.js        # Constantes compartilhadas (emails, datas)
│   │   ├── en.js               # Traduções em inglês
│   │   ├── es.js               # Traduções em espanhol
│   │   ├── index.js            # Export centralizado
│   │   └── pt.js               # Traduções em português
│   ├── App.js                  # Definição de rotas
│   ├── App.css                 # Estilos globais
│   ├── index.js                # Entry point React
│   └── index.css               # Reset e variáveis CSS
├── .env                        # Variáveis de ambiente (não commitar!)
├── .env.example                # Template
├── package.json
└── README.md                   # Este arquivo
```

---

## Variáveis de Ambiente

| Variável | Obrigatória | Descrição | Exemplo |
|----------|-------------|-----------|---------|
| `REACT_APP_BACKEND_URL` | ✅ | URL base do backend FastAPI | `http://localhost:8000` |

> **Prefixo obrigatório:** O Create React App exige que todas as variáveis de ambiente customizadas comecem com `REACT_APP_`. Variáveis sem este prefixo não são acessíveis no código.

> **Segurança:** Qualquer variável com prefixo `REACT_APP_` é incluída no bundle JavaScript e portanto **visível para qualquer usuário que inspecionar o código**. Nunca coloque tokens, senhas ou segredos aqui.

---

## Rotas da Aplicação

| Rota | Componente | Descrição |
|------|-----------|-----------|
| `/` | `Home` | Landing page |
| `/dashboard` | `Dashboard` | Dashboard principal |
| `/auth/fb/callback` | `FbCallback` | Callback OAuth do Facebook |
| `/privacy` | `Privacy` | Política de privacidade |
| `/terms` | `Terms` | Termos de uso |
| `/data-deletion` | `DataDeletion` | Solicitação de exclusão de dados |

---

## Dados e Privacidade

Este frontend está em conformidade com as exigências da **Meta Platform Policy**:

- ✅ Páginas de Política de Privacidade, Termos de Uso e Exclusão de Dados
- ✅ Login via OAuth oficial (sem scraping ou APIs não-oficiais)
- ✅ Token de acesso armazenado apenas no servidor (nunca no cliente)
- ✅ Solicitação de exclusão de dados implementada
- ✅ Permissões mínimas necessárias solicitadas ao usuário
