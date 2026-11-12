import { consultar } from "@/lib/supabase";
import type { Noticia } from "@/types/database";

// O RLS já esconde as não publicadas; o filtro aqui é só para deixar a intenção explícita.
export function getNoticias({ limite, excetoSlug }: { limite?: number; excetoSlug?: string } = {}) {
  return consultar<Noticia[]>("getNoticias", [], async (db) => {
    let q = db.from("noticias").select("*").eq("publicado", true).order("publicado_em", { ascending: false });
    if (excetoSlug) q = q.neq("slug", excetoSlug);
    if (limite) q = q.limit(limite);
    return q;
  });
}

export function getNoticia(slug: string) {
  return consultar<Noticia | null>("getNoticia", null, async (db) =>
    db.from("noticias").select("*").eq("slug", slug).eq("publicado", true).maybeSingle(),
  );
}
