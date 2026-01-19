export interface User {
  id: string;
  email: string;
  name?: string | null;
}

export interface Photo {
  id: string;
  title: string;
  description?: string | null;
  file_name: string;
  file_path: string;
  size_bytes: number;
  acquisition_date: string;
  predominant_color?: string | null;
  album_id: string;
  created_at: string;
}

export interface Album {
  id: string;
  title: string;
  description: string;
  user_id?: string;
  is_public?: boolean;
  share_token?: string | null;
  created_at: string;
  updated_at: string;
  photos?: Photo[];
  photo_count?: number;
}

export type ViewMode = "grid" | "table";
export type SortOrder = "asc" | "desc";
