import { consultar } from "@/lib/supabase";
import { calcularEstatisticas } from "@/lib/stats";
import { getCompeticoes, SELECT_JOGO } from "@/lib/data/jogos";
import type { Jogo } from "@/types/database";

/** Temporadas com competição cadastrada, da mais recente para a mais antiga. */
export async function getTemporadas(): Promise<number[]> {
  const comps = await getCompeticoes();
  return [...new Set(comps.map((c) => c.temporada))].sort((a, b) => b - a);
}

export async function getEstatisticas({ temporada, competicaoId }: { temporada: number; competicaoId?: string }) {
  const jogos = await consultar<Jogo[]>("getEstatisticas", [], async (db) => {
    let q = db.from("jogos").select(SELECT_JOGO).eq("status", "encerrado").eq("competicao.temporada", temporada);
    if (competicaoId) q = q.eq("competicao_id", competicaoId);
    return q.overrideTypes<Jogo[], { merge: false }>();
  });
  return calcularEstatisticas(jogos);
}
