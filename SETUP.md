# 🚀 Setup Rápido

## 1. Configurar Supabase

1. Crie conta em [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Vá em **SQL Editor** e execute o arquivo `supabase/setup.sql`
4. Configure Google OAuth:
   - **Authentication → Providers → Google**
   - Adicione Client ID e Client Secret do [Google Cloud Console](https://console.cloud.google.com)
5. Copie as credenciais:
   - **Settings → API** → copie `URL` e `anon public` key

## 2. Configurar Frontend

```bash
cd frontend
cp .env.example .env
```

Edite o `.env` e adicione:
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
```

Instale e rode:
```bash
npm install
npm run dev
```

Acesse: http://localhost:5173

## 3. Deploy (Vercel)

1. Faça push do código para GitHub
2. Importe no [vercel.com](https://vercel.com)
3. Configure:
   - **Root Directory**: `frontend`
   - **Environment Variables**: adicione as mesmas do `.env`
4. Deploy!

## ✅ Pronto!

Tudo funciona 100% no Supabase + Vercel. Sem backend separado, sem complicações.
