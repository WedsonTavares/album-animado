# Dr. TIS – Álbum de Fotos (React + Node)

Aplicação full-stack organizada em pastas isoladas (`frontend` e `backend`) com autenticação, CRUD de álbuns, upload de fotos com detecção de cor predominante e UI minimalista na paleta da Dr. TIS. Login disponível via e-mail/senha e Google.

## Stack
- **Frontend:** React + Vite + TypeScript, React Router 7, React Query, React Hook Form + Zod, Tailwind CSS v4, framer-motion, lucide-react.
- **Backend:** Node + Express + TypeScript, Prisma + PostgreSQL (Neon), Multer para uploads, JWT para autenticação, exifr + sharp para metadados/cor, Google OAuth.
- **Padrões:** componentes reutilizáveis, CSS com variáveis de tema, validação nos dois lados, rotas protegidas.

## Funcionalidades
- ✅ Registro/Login com e-mail e senha (JWT) + Login com Google
- ✅ Listagem de álbuns (cards ou tabela) com capa
- ✅ Criação/edição/exclusão de álbuns (exclusão bloqueada se houver fotos)
- ✅ Upload de fotos com **Drag-and-Drop** e upload de **pasta inteira**
- ✅ Detecção automática de **cor predominante** e **data via EXIF**
- ✅ **Ordenação** de fotos por data (crescente/decrescente)
- ✅ **Paginação** de fotos (12 por página)
- ✅ **Compartilhar álbum público** via link com token
- ✅ Visualização em tabela ou miniaturas com preview ampliado
- ✅ Validação de campos em todos os formulários
- ✅ Validação de mime-type no upload
- ✅ UI responsiva com animações suaves

## Como rodar localmente

### 1) Backend
```bash
cd backend
cp .env.example .env   # configure DATABASE_URL, JWT_SECRET, GOOGLE_CLIENT_ID
npm install
npm run prisma:push    # sincroniza o schema com o banco
npm run dev            # http://localhost:4000
```

### 2) Frontend
```bash
cd frontend
cp .env.example .env   # configure VITE_API_URL e VITE_GOOGLE_CLIENT_ID
npm install
npm run dev            # http://localhost:5173
```

---

## 🚀 Deploy em Produção

### Banco de Dados (Neon - PostgreSQL gratuito)

1. Crie uma conta em [neon.tech](https://neon.tech)
2. Crie um novo projeto
3. Copie a **Connection String** (formato: `postgresql://user:pass@host/db?sslmode=require`)

### Backend (Railway, Render ou Fly.io)

**Railway (recomendado):**
1. Conecte seu repositório GitHub
2. Configure as variáveis de ambiente:
   ```
   DATABASE_URL=postgresql://...sua-url-neon...
   JWT_SECRET=sua-chave-secreta-segura
   CLIENT_URL=https://seu-frontend.vercel.app
   GOOGLE_CLIENT_ID=seu-id-google (opcional)
   ```
3. Deploy automático!

**Render:**
1. New Web Service → conecte o repo
2. Build Command: `npm install && npm run build`
3. Start Command: `npm start`
4. Configure as mesmas variáveis acima

### Frontend (Vercel)

1. Importe o repositório no [vercel.com](https://vercel.com)
2. Configure o **Root Directory** como `frontend`
3. Variáveis de ambiente:
   ```
   VITE_API_URL=https://seu-backend.railway.app/api
   VITE_GOOGLE_CLIENT_ID=seu-id-google (opcional)
   ```
4. Deploy!

---

## Estrutura do Projeto
```
├── backend/
│   ├── prisma/
│   │   └── schema.prisma    # Modelos: User, Album, Photo
│   ├── src/
│   │   ├── controllers/     # Lógica de negócio
│   │   ├── routes/          # Rotas da API
│   │   ├── middleware/      # Auth, error handler
│   │   ├── utils/           # Color, EXIF, tokens
│   │   └── server.ts        # Entry point
│   └── uploads/             # Arquivos enviados
│
├── frontend/
│   ├── src/
│   │   ├── pages/           # Landing, Auth, Albums, PublicAlbum
│   │   ├── components/      # UI reutilizáveis
│   │   ├── services/        # API calls
│   │   └── context/         # AuthContext
│   └── public/              # Assets estáticos
```

## Variáveis de Ambiente

### Backend (.env)
```env
DATABASE_URL="postgresql://..."  # Neon PostgreSQL
JWT_SECRET="sua-chave-secreta"
CLIENT_URL="http://localhost:5173"
PORT=4000
GOOGLE_CLIENT_ID=""              # Opcional
```

### Frontend (.env)
```env
VITE_API_URL="http://localhost:4000/api"
VITE_GOOGLE_CLIENT_ID=""         # Opcional
```

## Comandos Úteis

```bash
# Backend
npm run dev              # Desenvolvimento
npm run build            # Build para produção
npm run prisma:push      # Sincroniza schema → banco
npm run prisma:migrate   # Aplica migrations

# Frontend
npm run dev              # Desenvolvimento
npm run build            # Build para produção
npm run preview          # Preview do build
```

---

Desenvolvido para o processo seletivo **Dr. TIS** 🎯
