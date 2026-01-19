-- ============================================
-- ALBUM ANIMADO - Supabase Database Setup
-- ============================================
-- Execute este script no SQL Editor do Supabase
-- Dashboard > SQL Editor > New Query

-- ============================================
-- 1. TABELAS
-- ============================================

-- Tabela de Álbuns
CREATE TABLE IF NOT EXISTS public.albums (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_public BOOLEAN DEFAULT FALSE,
  share_token TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Fotos
CREATE TABLE IF NOT EXISTS public.photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  acquisition_date TIMESTAMPTZ NOT NULL,
  predominant_color TEXT,
  album_id UUID NOT NULL REFERENCES public.albums(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. ÍNDICES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_albums_user_id ON public.albums(user_id);
CREATE INDEX IF NOT EXISTS idx_albums_share_token ON public.albums(share_token);
CREATE INDEX IF NOT EXISTS idx_photos_album_id ON public.photos(album_id);

-- ============================================
-- 3. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS nas tabelas
ALTER TABLE public.albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 3.1 POLÍTICAS PARA ÁLBUMS
-- ============================================

-- Usuários podem ver seus próprios álbuns
CREATE POLICY "Users can view own albums"
  ON public.albums FOR SELECT
  USING (auth.uid() = user_id);

-- Qualquer pessoa pode ver álbuns públicos (para compartilhamento)
CREATE POLICY "Anyone can view public albums"
  ON public.albums FOR SELECT
  USING (is_public = TRUE);

-- Usuários podem criar álbuns
CREATE POLICY "Users can create albums"
  ON public.albums FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Usuários podem atualizar seus próprios álbuns
CREATE POLICY "Users can update own albums"
  ON public.albums FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Usuários podem deletar seus próprios álbuns
CREATE POLICY "Users can delete own albums"
  ON public.albums FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 3.2 POLÍTICAS PARA FOTOS
-- ============================================

-- Usuários podem ver fotos dos seus álbuns
CREATE POLICY "Users can view photos from own albums"
  ON public.photos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.albums
      WHERE albums.id = photos.album_id
      AND albums.user_id = auth.uid()
    )
  );

-- Qualquer pessoa pode ver fotos de álbuns públicos
CREATE POLICY "Anyone can view photos from public albums"
  ON public.photos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.albums
      WHERE albums.id = photos.album_id
      AND albums.is_public = TRUE
    )
  );

-- Usuários podem adicionar fotos aos seus álbuns
CREATE POLICY "Users can add photos to own albums"
  ON public.photos FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.albums
      WHERE albums.id = album_id
      AND albums.user_id = auth.uid()
    )
  );

-- Usuários podem deletar fotos dos seus álbuns
CREATE POLICY "Users can delete photos from own albums"
  ON public.photos FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.albums
      WHERE albums.id = photos.album_id
      AND albums.user_id = auth.uid()
    )
  );

-- ============================================
-- 4. STORAGE BUCKET
-- ============================================

-- Criar bucket para fotos (executar se não existir)
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 4.1 POLÍTICAS DE STORAGE
-- ============================================

-- Política para upload de fotos (usuários autenticados)
CREATE POLICY "Authenticated users can upload photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'photos' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Política para visualização pública das fotos
CREATE POLICY "Anyone can view photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'photos');

-- Política para deletar fotos (apenas dono)
CREATE POLICY "Users can delete own photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'photos'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ============================================
-- 5. FUNÇÕES AUXILIARES
-- ============================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at nos álbuns
DROP TRIGGER IF EXISTS albums_updated_at ON public.albums;
CREATE TRIGGER albums_updated_at
  BEFORE UPDATE ON public.albums
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- CONFIGURAÇÃO COMPLETA!
-- ============================================
-- Após executar este script:
-- 
-- 1. Configure Google OAuth no Supabase:
--    Authentication > Providers > Google
--    - Adicione Client ID e Client Secret do Google Cloud Console
--    - Configure a URL de callback: https://[seu-projeto].supabase.co/auth/v1/callback
--
-- 2. Configure variáveis de ambiente no frontend (.env):
--    VITE_SUPABASE_URL=https://[seu-projeto].supabase.co
--    VITE_SUPABASE_ANON_KEY=[sua-anon-key]
--
-- 3. No Google Cloud Console:
--    - Adicione a URL de callback do Supabase como redirect URI autorizada
--    - Adicione o domínio do seu app (localhost e produção)
