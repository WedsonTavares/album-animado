<div align="center">
  <img src="frontend/public/logo.png" alt="Dr. TIS Logo" width="120" height="120" />
  <h1>📸 Dr. TIS - Álbum de Fotos</h1>
  <p><strong>Organize e compartilhe suas memórias de forma simples e elegante</strong></p>
  
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-19.2-61dafb?logo=react)](https://react.dev/)
  [![Vite](https://img.shields.io/badge/Vite-7.2-646cff?logo=vite)](https://vitejs.dev/)
  [![Supabase](https://img.shields.io/badge/Supabase-Latest-3ecf8e?logo=supabase)](https://supabase.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
  
  <br/>
  
  <a href="https://album-animado.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/🚀_Ver_Demo_Online-8b5cf6?style=for-the-badge&logoColor=white" alt="Ver Demo Online" />
  </a>
</div>

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Stack Tecnológica](#-stack-tecnológica)
- [Arquitetura](#-arquitetura)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Uso](#-uso)
- [Deploy](#-deploy)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Otimizações de Performance](#-otimizações-de-performance)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

---

## 🎯 Sobre o Projeto

**Dr. TIS** é uma aplicação web moderna para gerenciamento de álbuns de fotos, construída com foco em **performance**, **experiência do usuário** e **segurança**. Permite que usuários organizem suas memórias, façam upload de fotos com metadados personalizados e compartilhem álbuns com amigos e família através de links públicos.

### 🌟 Destaques

- 🚀 **100% Serverless** - Sem necessidade de gerenciar servidores
- 🔐 **Autenticação Segura** - Login com Google ou e-mail/senha
- 📱 **Totalmente Responsivo** - Funciona perfeitamente em mobile, tablet e desktop
- ⚡ **Performance Otimizada** - Code splitting, lazy loading e cache inteligente
- 🎨 **UI Moderna** - Interface elegante com animações suaves
- 🔒 **Row Level Security** - Cada usuário só acessa seus próprios dados

---

## ✨ Funcionalidades

### 🔐 Autenticação
- ✅ Login com Google (OAuth 2.0)
- ✅ Registro e login com e-mail/senha
- ✅ Recuperação de senha
- ✅ Gerenciamento de sessão com Supabase Auth
- ✅ Rotas protegidas com redirecionamento automático

### 📁 Gerenciamento de Álbuns
- ✅ Criar, editar e excluir álbuns
- ✅ Visualização em **grid** ou **tabela**
- ✅ Capa automática (primeira foto do álbum)
- ✅ Contador de fotos em tempo real
- ✅ Proteção contra exclusão acidental (álbuns com fotos)
- ✅ Busca e ordenação

### 📸 Upload de Fotos
- ✅ **Drag-and-Drop** intuitivo
- ✅ Upload de **pastas inteiras** (recursivo)
- ✅ Upload múltiplo de arquivos
- ✅ Preview antes do upload
- ✅ Metadados personalizados:
  - Título e descrição
  - Data de aquisição
  - Cor predominante (suporte para nomes em português ou HEX)
- ✅ Armazenamento seguro no Supabase Storage

### 🖼️ Visualização de Fotos
- ✅ Grid responsivo (1-4 colunas conforme tela)
- ✅ Visualização em tabela com metadados completos
- ✅ Preview ampliado com informações detalhadas
- ✅ Ordenação por data (crescente/decrescente)
- ✅ Paginação (12 fotos por página)
- ✅ Indicador visual de cor predominante

### 🔗 Compartilhamento
- ✅ Gerar link público para álbum
- ✅ Token único e seguro
- ✅ Copiar link com um clique
- ✅ Tornar álbum privado novamente
- ✅ Página pública sem necessidade de login

### 🎨 Interface
- ✅ Design moderno com Tailwind CSS v4
- ✅ Tema dark/light (suporte nativo)
- ✅ Animações suaves com Framer Motion
- ✅ Componentes reutilizáveis com StarBorder, ClickSpark
- ✅ Feedback visual em todas as ações
- ✅ Modais de confirmação personalizados
- ✅ Loading states e error handling

---

## 🛠️ Stack Tecnológica

### Frontend
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| [React](https://react.dev/) | 19.2.3 | Biblioteca UI |
| [TypeScript](https://www.typescriptlang.org/) | 5.9.3 | Type safety |
| [Vite](https://vitejs.dev/) | 7.2.4 | Build tool |
| [React Router](https://reactrouter.com/) | 7.2.2 | Roteamento |
| [TanStack Query](https://tanstack.com/query) | 5.64.2 | State management |
| [React Hook Form](https://react-hook-form.com/) | 7.54.2 | Formulários |
| [Zod](https://zod.dev/) | 3.24.1 | Validação |
| [Tailwind CSS](https://tailwindcss.com/) | 4.0.0 | Estilização |
| [Framer Motion](https://www.framer.com/motion/) | 11.15.0 | Animações |
| [Lucide React](https://lucide.dev/) | 0.468.0 | Ícones |

### Backend (Serverless)
| Tecnologia | Descrição |
|------------|-----------|
| [Supabase](https://supabase.com/) | Backend as a Service |
| PostgreSQL | Banco de dados relacional |
| Supabase Auth | Autenticação e autorização |
| Supabase Storage | Armazenamento de arquivos |
| Row Level Security | Segurança em nível de linha |

### DevOps & Deploy
| Tecnologia | Uso |
|------------|-----|
| [Vercel](https://vercel.com/) | Hospedagem do frontend |
| Git | Controle de versão |
| npm | Gerenciador de pacotes |

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                     FRONTEND (Vercel)                   │
│                                                         │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Pages     │  │  Components  │  │   Services   │  │
│  │             │  │              │  │              │  │
│  │ - Landing   │  │ - Albums     │  │ - albums.ts  │  │
│  │ - Auth      │  │ - Photos     │  │ - auth.ts    │  │
│  │ - Albums    │  │ - UI         │  │              │  │
│  │ - Detail    │  │ - Layout     │  │              │  │
│  │ - Public    │  │              │  │              │  │
│  └─────────────┘  └──────────────┘  └──────────────┘  │
│                                                         │
│          │                    │                         │
│          └────────────────────┘                         │
│                     │                                   │
└─────────────────────┼───────────────────────────────────┘
                      │
                      │ Supabase Client
                      │
┌─────────────────────▼───────────────────────────────────┐
│                  SUPABASE (Backend)                     │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  PostgreSQL  │  │  Auth (JWT)  │  │   Storage    │ │
│  │              │  │              │  │              │ │
│  │ - albums     │  │ - Google     │  │ - photos/    │ │
│  │ - photos     │  │ - Email/Pwd  │  │              │ │
│  │ - RLS        │  │ - Sessions   │  │              │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Padrões de Projeto
- **Component-based Architecture** - Componentes reutilizáveis e isolados
- **Custom Hooks** - useAuth para gerenciamento de autenticação
- **Service Layer** - Separação de lógica de negócio
- **Type Safety** - TypeScript em todo o código
- **Code Splitting** - Lazy loading de páginas
- **Error Boundaries** - Tratamento de erros gracioso

---

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ e npm
- Conta no [Supabase](https://supabase.com) (gratuita)
- Conta no [Vercel](https://vercel.com) para deploy (opcional)

### 1. Clone o Repositório
```bash
git clone https://github.com/WedsonTavares/album-animado.git
cd album-animado
```

### 2. Configurar Supabase

#### 2.1. Criar Projeto
1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Clique em **"New Project"**
3. Preencha os dados e aguarde a criação

#### 2.2. Executar Script SQL
1. No painel do Supabase, vá em **SQL Editor**
2. Copie o conteúdo de `supabase/setup.sql`
3. Cole e execute o script (cria tabelas e RLS)

#### 2.3. Configurar Storage
1. Vá em **Storage**
2. Crie um bucket chamado `photos`
3. Configure como **Public** (ou privado com signed URLs)

#### 2.4. Configurar Google OAuth (Opcional)
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um projeto e ative a **Google+ API**
3. Em **Credenciais**, crie um **OAuth 2.0 Client ID**
4. Adicione URIs autorizados:
   ```
   https://[seu-projeto].supabase.co
   ```
5. Adicione URI de redirecionamento:
   ```
   https://[seu-projeto].supabase.co/auth/v1/callback
   ```
6. No Supabase: **Authentication → Providers → Google**
7. Cole Client ID e Client Secret

---

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Crie o arquivo `.env` no diretório `frontend/`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key-aqui
```

📌 **Como obter as credenciais:**
1. No Supabase, vá em **Settings → API**
2. Copie a **Project URL** (VITE_SUPABASE_URL)
3. Copie a **anon/public key** (VITE_SUPABASE_ANON_KEY)

### 2. Instalar Dependências

```bash
cd frontend
npm install
```

---

## 🚀 Uso

### Desenvolvimento Local

```bash
cd frontend
npm run dev
```

Acesse: **http://localhost:5173**

### Build de Produção

```bash
npm run build
```

Os arquivos otimizados estarão em `frontend/dist/`

### Preview do Build

```bash
npm run preview
```

### Verificar Tipos TypeScript

```bash
npm run type-check
```

---

## 🌐 Deploy

### Deploy no Vercel (Recomendado)

#### Via GitHub (Automático)
1. Faça push do código para o GitHub
2. Acesse [vercel.com](https://vercel.com) e faça login
3. Clique em **"Import Project"**
4. Selecione o repositório
5. Configure:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
6. Adicione as variáveis de ambiente:
   ```
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-anon-key
   ```
7. Clique em **Deploy**

#### Via CLI
```bash
cd frontend
npm install -g vercel
vercel
```

### Configurar Domínio Customizado

1. No Vercel, vá em **Settings → Domains**
2. Adicione seu domínio
3. Configure os DNS conforme instruções
4. Atualize as URLs de callback no Google OAuth (se usar):
   ```
   https://seu-dominio.com
   ```

---

## 📁 Estrutura do Projeto

```
album-animado/
│
├── frontend/                    # Aplicação React
│   ├── public/                  # Assets estáticos
│   │   ├── logo.png            # Logo da aplicação
│   │   └── ...
│   │
│   ├── src/
│   │   ├── components/          # Componentes React
│   │   │   ├── albums/         # AlbumCard, AlbumTable, AlbumForm
│   │   │   ├── photos/         # PhotoGrid, PhotoTable, PhotoPreview
│   │   │   ├── ui/             # Componentes UI reutilizáveis
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── ConfirmDialog.tsx
│   │   │   │   ├── StarBorder.tsx
│   │   │   │   ├── ClickSpark.tsx
│   │   │   │   └── ...
│   │   │   └── Layout/         # AppLayout, Header, Footer
│   │   │
│   │   ├── context/            # Context API
│   │   │   └── AuthContext.tsx # Gerenciamento de autenticação
│   │   │
│   │   ├── lib/                # Configurações externas
│   │   │   └── supabase.ts     # Cliente Supabase
│   │   │
│   │   ├── pages/              # Páginas da aplicação (lazy loaded)
│   │   │   ├── LandingPage.tsx
│   │   │   ├── AuthPage.tsx
│   │   │   ├── AlbumListPage.tsx
│   │   │   ├── AlbumDetailPage.tsx
│   │   │   └── PublicAlbumPage.tsx
│   │   │
│   │   ├── services/           # Camada de serviços
│   │   │   ├── albums.ts       # CRUD de álbuns e fotos
│   │   │   └── auth.ts         # Autenticação
│   │   │
│   │   ├── utils/              # Utilitários
│   │   │   ├── cores.ts        # Conversão de cores PT → HEX
│   │   │   └── format.ts       # Formatação de dados
│   │   │
│   │   ├── styles/
│   │   │   └── global.css      # Estilos globais + Tailwind
│   │   │
│   │   ├── App.tsx             # Configuração de rotas
│   │   ├── main.tsx            # Entry point
│   │   └── types.ts            # Tipos TypeScript globais
│   │
│   ├── .env.example            # Exemplo de variáveis de ambiente
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts          # Configuração do Vite
│   └── tailwind.config.js      # Configuração do Tailwind
│
├── supabase/
│   └── setup.sql               # Script SQL (tabelas + RLS)
│
├── .gitignore
├── vercel.json                 # Configuração do Vercel
└── README.md                   # Este arquivo
```

---

## 📜 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento

# Build
npm run build            # Compila para produção
npm run preview          # Preview do build local

# Qualidade de Código
npm run type-check       # Verifica tipos TypeScript (sem build)
npm run lint             # Executa ESLint (se configurado)

# Limpeza
rm -rf dist node_modules # Limpar build e dependências
npm install              # Reinstalar dependências
```

---

## ⚡ Otimizações de Performance

### Code Splitting
- ✅ **Lazy Loading** de todas as páginas
- ✅ **Dynamic Imports** com React.lazy()
- ✅ Suspense boundaries com fallbacks

### Chunk Optimization
```javascript
// vite.config.ts - Manual chunks
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        'query-vendor': ['@tanstack/react-query'],
        'form-vendor': ['react-hook-form', 'zod'],
        'supabase-vendor': ['@supabase/supabase-js'],
        'animation-vendor': ['framer-motion', 'gsap']
      }
    }
  }
}
```

### Resultados
- 📦 Bundle inicial: **~33 KB** (gzipped)
- ⚡ Time to Interactive: **< 2s** (3G)
- 🎯 Lighthouse Score: **95+**

### Boas Práticas Implementadas
- ✅ Image lazy loading (`loading="lazy"`)
- ✅ React Query cache (5s stale time)
- ✅ Debounce em inputs de busca
- ✅ Paginação de fotos
- ✅ Vendor chunks separados (melhor cache)

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Commits Semânticos
Use [Conventional Commits](https://www.conventionalcommits.org/):
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação
- `refactor`: Refatoração
- `perf`: Performance
- `test`: Testes

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

**Wedson Tavares**

- GitHub: [@WedsonTavares](https://github.com/WedsonTavares)
- Email: wedsontavares016@gmail.com

---

## 🙏 Agradecimentos

- [Supabase](https://supabase.com/) - Backend incrível
- [Vercel](https://vercel.com/) - Hospedagem simplificada
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Lucide](https://lucide.dev/) - Ícones lindos
- [Framer Motion](https://www.framer.com/motion/) - Animações suaves

---

<div align="center">
  <p>Feito com ❤️ por <strong>Wedson Tavares</strong></p>
  <p>⭐ Se gostou do projeto, deixe uma estrela!</p>
</div>

---

## Licença

MIT
