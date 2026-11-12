import { consultar } from "@/lib/supabase";
import type { Patrocinador } from "@/types/database";

export function getPatrocinadores() {
  return consultar<Patrocinador[]>("getPatrocinadores", [], async (db) =>
    db.from("patrocinadores").select("*").eq("ativo", true).order("ordem", { nullsFirst: false }),
  );
}
