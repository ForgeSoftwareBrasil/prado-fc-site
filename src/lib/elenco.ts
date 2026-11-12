import type { Jogador } from "../types/database.ts";

// Ordem fixa combinada no design (DECISOES_DESIGN.md)
const GRUPOS = [
  { titulo: "Goleiros", posicao: "goleiro" },
  { titulo: "Fixos", posicao: "fixo" },
  { titulo: "Alas", posicao: "ala" },
  { titulo: "Meias", posicao: "meia" },
  { titulo: "Pivôs", posicao: "pivô" },
] as const;

const COMISSAO = "Comissão técnica";
const SEM_GRUPO = "Elenco";

export type GrupoElenco = { titulo: string; jogadores: Jogador[] };

function grupoDe(j: Jogador): string {
  // A primeira posição define o grupo ("Ala/Pivô" → Alas)
  const primeira = j.posicao?.split("/")[0]?.trim().toLocaleLowerCase("pt-BR");
  if (!primeira) return SEM_GRUPO;
  if (/t[ée]cnic|auxiliar|preparador|treinador/.test(primeira)) return COMISSAO;
  return GRUPOS.find((g) => primeira === g.posicao || primeira === g.posicao.replace("ô", "o"))?.titulo ?? SEM_GRUPO;
}

const nulosPorUltimo = (a: number | null, b: number | null) =>
  a === b ? 0 : a === null ? 1 : b === null ? -1 : a - b;

export function agruparElenco(jogadores: Jogador[]): GrupoElenco[] {
  const ordenados = [...jogadores].sort(
    (a, b) => nulosPorUltimo(a.ordem, b.ordem) || nulosPorUltimo(a.numero, b.numero),
  );
  const ordem = [...GRUPOS.map((g) => g.titulo), SEM_GRUPO, COMISSAO];
  return ordem
    .map((titulo) => ({ titulo, jogadores: ordenados.filter((j) => grupoDe(j) === titulo) }))
    .filter((g) => g.jogadores.length > 0);
}
