import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são obrigatórias"
  );
}

// Tipos do banco de dados
export interface DbAlbum {
  id: string;
  title: string;
  description: string;
  user_id: string;
  is_public: boolean;
  share_token: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbPhoto {
  id: string;
  title: string;
  description: string | null;
  file_name: string;
  file_path: string;
  size_bytes: number;
  acquisition_date: string;
  predominant_color: string | null;
  album_id: string;
  created_at: string;
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const STORAGE_BUCKET = "photos";
