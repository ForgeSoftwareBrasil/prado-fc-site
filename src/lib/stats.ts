import type { Jogador, Jogo } from "../types/database.ts";

export type Resultado = "V" | "E" | "D";

export function resultado(gp: number, ga: number): Resultado {
  return gp > ga ? "V" : gp === ga ? "E" : "D";
}

export type Artilheiro = { posicao: number; jogador: Jogador; gols: number };

export type Estatisticas = {
  jogos: number;
  vitorias: number;
  empates: number;
  derrotas: number;
  golsMarcados: number;
  golsSofridos: number;
  saldo: number;
  /** Pontos ÷ (jogos × 3), em % inteiro. Nulo sem jogos. */
  aproveitamento: number | null;
  pontos: number;
  maiorVitoria: Jogo | null;
  /** Jogos em ordem cronológica. */
  porJogo: Jogo[];
  artilharia: Artilheiro[];
  golsContra: number;
};

/** Recebe apenas jogos encerrados (já filtrados por temporada/competição). */
export function calcularEstatisticas(encerrados: Jogo[]): Estatisticas {
  const porJogo = [...encerrados].sort((a, b) => a.data_hora.localeCompare(b.data_hora));
  let vitorias = 0, empates = 0, derrotas = 0, golsMarcados = 0, golsSofridos = 0, golsContra = 0;
  let maiorVitoria: Jogo | null = null;
  const porJogador = new Map<string, { jogador: Jogador; gols: number }>();

  for (const j of porJogo) {
    const gp = j.gols_prado ?? 0;
    const ga = j.gols_adversario ?? 0;
    golsMarcados += gp;
    golsSofridos += ga;
    const r = resultado(gp, ga);
    if (r === "V") vitorias++;
    else if (r === "E") empates++;
    else derrotas++;
    if (r === "V" && (!maiorVitoria || gp - ga > (maiorVitoria.gols_prado ?? 0) - (maiorVitoria.gols_adversario ?? 0))) {
      maiorVitoria = j;
    }
    for (const g of j.gols) {
      if (g.gol_contra || !g.jogador) {
        golsContra++;
        continue;
      }
      const atual = porJogador.get(g.jogador.id);
      if (atual) atual.gols++;
      else porJogador.set(g.jogador.id, { jogador: g.jogador, gols: 1 });
    }
  }

  const ordenados = [...porJogador.values()].sort(
    (a, b) => b.gols - a.gols || (a.jogador.apelido ?? a.jogador.nome).localeCompare(b.jogador.apelido ?? b.jogador.nome, "pt-BR"),
  );
  // Empates dividem a posição (1, 1, 3...)
  const artilharia = ordenados.map((a) => ({
    ...a,
    posicao: ordenados.findIndex((o) => o.gols === a.gols) + 1,
  }));

  const jogos = porJogo.length;
  const pontos = vitorias * 3 + empates;
  return {
    jogos,
    vitorias,
    empates,
    derrotas,
    golsMarcados,
    golsSofridos,
    saldo: golsMarcados - golsSofridos,
    pontos,
    aproveitamento: jogos ? Math.round((pontos / (jogos * 3)) * 100) : null,
    maiorVitoria,
    porJogo,
    artilharia,
    golsContra,
  };
}

/** "Yan 3, Boi 2, Daniel, gol contra": quem fez mais primeiro, gol contra no fim. */
export function autoresDosGols(jogo: Jogo): string {
  const contagem = new Map<string, number>();
  let contra = 0;
  for (const g of jogo.gols) {
    if (g.gol_contra || !g.jogador) contra++;
    else {
      const nome = g.jogador.apelido ?? g.jogador.nome;
      contagem.set(nome, (contagem.get(nome) ?? 0) + 1);
    }
  }
  const partes = [...contagem.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([nome, n]) => (n > 1 ? `${nome} ${n}` : nome));
  if (contra) partes.push(contra > 1 ? `${contra} gols contra` : "gol contra");
  return partes.join(", ");
}

/** Jogos encerrados cujo número de gols registrados não bate com o placar. */
export function jogosInconsistentes(jogos: Jogo[]): Jogo[] {
  return jogos.filter((j) => j.status === "encerrado" && j.gols.length !== (j.gols_prado ?? 0));
}
