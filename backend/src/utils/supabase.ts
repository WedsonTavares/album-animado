import { createClient } from "@supabase/supabase-js";
import env from "../config/env";
import { HttpError } from "./httpError";

if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
  throw new HttpError(
    500,
    "Supabase não configurado. Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.",
  );
}

export const supabase = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export const supabaseBucket = env.supabaseBucket || "photos";
