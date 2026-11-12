import { consultar } from "@/lib/supabase";
import { jogosInconsistentes } from "@/lib/stats";
import type { Competicao, Jogo } from "@/types/database";

export const SELECT_JOGO = "*, competicao:competicoes!inner(*), adversario:adversarios(*), gols(*, jogador:jogadores(*))";

function avisarInconsistencias(jogos: Jogo[]) {
  for (const j of jogosInconsistentes(jogos)) {
    console.warn(
      `[jogos] ${j.id} (${j.data_hora}, vs ${j.adversario.nome}): placar ${j.gols_prado} mas ${j.gols.length} gols registrados em "gols".`,
    );
  }
  return jogos;
}

type Filtro = { competicaoId?: string; limite?: number };

/** Próximos: agendados ou adiados, do mais cedo para o mais tarde. */
export function getProximosJogos({ competicaoId, limite }: Filtro = {}) {
  return consultar<Jogo[]>("getProximosJogos", [], async (db) => {
    let q = db.from("jogos").select(SELECT_JOGO).in("status", ["agendado", "adiado"]).order("data_hora");
    if (competicaoId) q = q.eq("competicao_id", competicaoId);
    if (limite) q = q.limit(limite);
    return q.overrideTypes<Jogo[], { merge: false }>();
  });
}

/** Resultados: encerrados, do mais recente para o mais antigo. */
export async function getResultados({ competicaoId, limite }: Filtro = {}) {
  const jogos = await consultar<Jogo[]>("getResultados", [], async (db) => {
    let q = db.from("jogos").select(SELECT_JOGO).eq("status", "encerrado").order("data_hora", { ascending: false });
    if (competicaoId) q = q.eq("competicao_id", competicaoId);
    if (limite) q = q.limit(limite);
    return q.overrideTypes<Jogo[], { merge: false }>();
  });
  return avisarInconsistencias(jogos);
}

export async function getUltimoResultado(): Promise<Jogo | null> {
  return (await getResultados({ limite: 1 }))[0] ?? null;
}

export function getCompeticoes() {
  return consultar<Competicao[]>("getCompeticoes", [], async (db) =>
    db.from("competicoes").select("*").order("temporada", { ascending: false }).order("nome"),
  );
}
