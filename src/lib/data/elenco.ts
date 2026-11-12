import { consultar } from "@/lib/supabase";
import { agruparElenco } from "@/lib/elenco";
import type { Jogador } from "@/types/database";

export async function getElenco() {
  const jogadores = await consultar<Jogador[]>("getElenco", [], async (db) =>
    db.from("jogadores").select("*").eq("ativo", true),
  );
  return agruparElenco(jogadores);
}
