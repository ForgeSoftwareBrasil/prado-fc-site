import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

let client: SupabaseClient<Database> | null = null;

/** Cliente de leitura (anon key; o RLS só permite select). Só roda no servidor. */
export function supabase(): SupabaseClient<Database> {
  if (client) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Configure SUPABASE_URL e SUPABASE_ANON_KEY (veja .env.example).");
  client = createClient<Database>(url, key, { auth: { persistSession: false } });
  return client;
}

/**
 * Roda uma consulta e devolve `vazio` se o banco falhar, para a página mostrar o estado vazio
 * em vez de quebrar (ex.: projeto do Supabase pausado). O erro fica no log do servidor.
 */
export async function consultar<T>(nome: string, vazio: T, fn: (db: SupabaseClient<Database>) => Promise<{ data: T | null; error: unknown }>): Promise<T> {
  try {
    const { data, error } = await fn(supabase());
    if (error) throw error;
    return data ?? vazio;
  } catch (e) {
    console.error(`[supabase] ${nome}:`, e);
    return vazio;
  }
}
