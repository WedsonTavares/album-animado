import { createClient } from "@supabase/supabase-js";
import env from "../config/env";
import { HttpError } from "./httpError";

// Debug: log environment variables status
console.log("=== Supabase Config Debug ===");
console.log("SUPABASE_URL exists:", !!process.env.SUPABASE_URL);
console.log("SUPABASE_URL value:", process.env.SUPABASE_URL ? process.env.SUPABASE_URL.substring(0, 30) + "..." : "UNDEFINED");
console.log("SUPABASE_SERVICE_ROLE_KEY exists:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);
console.log("env.supabaseUrl:", env.supabaseUrl ? env.supabaseUrl.substring(0, 30) + "..." : "EMPTY");
console.log("env.supabaseServiceRoleKey exists:", !!env.supabaseServiceRoleKey);
console.log("=============================");

if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
  throw new HttpError(
    500,
    `Supabase não configurado. SUPABASE_URL=${!!env.supabaseUrl}, SUPABASE_SERVICE_ROLE_KEY=${!!env.supabaseServiceRoleKey}`,
  );
}

export const supabase = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export const supabaseBucket = env.supabaseBucket || "photos";
