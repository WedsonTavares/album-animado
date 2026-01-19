# Dr. TIS – Álbum de Fotos (React + Supabase)

Aplicação de álbum de fotos com React e Supabase. Autenticação via Google, banco de dados e storage gerenciados pelo Supabase. Frontend hospedado no Vercel.

## Stack
- **Frontend:** React + Vite + TypeScript, React Router 7, React Query, React Hook Form + Zod, Tailwind CSS v4, framer-motion, lucide-react.
- **Backend:** Supabase (PostgreSQL + Auth + Storage) - Serverless, sem necessidade de servidor Node.
- **Padrões:** componentes reutilizáveis, CSS com variáveis de tema, validação no frontend, rotas protegidas com RLS.

## Funcionalidades
- ✅ Login com Google (Supabase Auth)
- ✅ Registro/Login com e-mail e senha
- ✅ Listagem de álbuns (cards ou tabela) com capa
- ✅ Criação/edição/exclusão de álbuns (exclusão bloqueada se houver fotos)
- ✅ Upload de fotos com **Drag-and-Drop** e upload de **pasta inteira**
- ✅ Configuração de **cor predominante** e **data de aquisição**
- ✅ **Ordenação** de fotos por data (crescente/decrescente)
- ✅ **Paginação** de fotos (12 por página)
- ✅ **Compartilhar álbum público** via link com token
- ✅ Visualização em tabela ou miniaturas com preview ampliado
- ✅ Validação de campos em todos os formulários
- ✅ UI responsiva com animações suaves
- ✅ Row Level Security (RLS) - cada usuário só vê seus dados

## Como rodar localmente

### 1) Configurar Supabase
1. Crie uma conta em [supabase.com](https://supabase.com)
2. Crie um projeto
3. Vá em **SQL Editor** e execute o script `supabase/setup.sql`
4. Configure Google OAuth:
   - Vá em **Authentication → Providers → Google**
   - Adicione Client ID e Client Secret do Google Cloud Console
   - A URL de callback é: `https://[seu-projeto].supabase.co/auth/v1/callback`
5. Copie a **URL** e a **anon key** do projeto (em **Settings → API**)

### 2) Frontend
```bash
cd frontend
cp .env.example .env   # configure as variáveis
npm install
npm run dev            # http://localhost:5173
```

Variáveis de ambiente (.env):
```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
```

---

## 🚀 Deploy em Produção

### Frontend (Vercel)

1. Importe o repositório no [vercel.com](https://vercel.com)
2. Configure o **Root Directory** como `frontend`
3. Variáveis de ambiente:
   ```
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-anon-key
   ```
4. Deploy!

### Google OAuth em Produção

1. No Google Cloud Console, adicione os domínios autorizados:
   - `https://seu-projeto.supabase.co`
   - `https://seu-app.vercel.app`
2. Adicione a URL de redirect:
   - `https://seu-projeto.supabase.co/auth/v1/callback`

---

## Estrutura do Projeto
```
├── supabase/
│   └── setup.sql            # Script SQL para criar tabelas e RLS
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── context/         # AuthContext (Supabase)
│   │   ├── lib/             # Supabase client
│   │   ├── pages/           # Páginas da aplicação
│   │   ├── services/        # Chamadas ao Supabase (auth, albums)
│   │   └── types.ts         # Tipos TypeScript
│   ├── public/              # Assets estáticos (logo, etc)
│   └── package.json
```

## Comandos Úteis

```bash
cd frontend
npm install              # Instalar dependências
npm run dev              # Desenvolvimento (http://localhost:5173)
npm run build            # Build para produção
npm run preview          # Preview do build
```

---

## Licença

MIT
