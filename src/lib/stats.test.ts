// Confere o cálculo com o seed (critério de aceite da seção 14 do PRADO_FC_SITE.md).
import { test } from "node:test";
import assert from "node:assert/strict";
import { autoresDosGols, calcularEstatisticas, jogosInconsistentes } from "./stats.ts";
import type { Competicao, Jogador, Jogo } from "../types/database.ts";

const comp = (id: string, nome: string): Competicao => ({ id, nome, temporada: 2026, logo_url: null, created_at: "" });
const amistoso = comp("c1", "Amistoso");
const champions = comp("c2", "Champions League da Liga Mineira");

const jogador = (apelido: string): Jogador => ({
  id: apelido, nome: apelido, apelido, nome_camisa: null, numero: null, posicao: null,
  pe: null, foto_url: null, ativo: true, ordem: null, created_at: "",
});

function jogo(data: string, competicao: Competicao, sigla: string, gp: number, ga: number, autores: [string | null, number][]): Jogo {
  return {
    id: data, data_hora: `${data}T22:00:00-03:00`, local: "Arena", competicao_id: competicao.id, adversario_id: sigla,
    rodada: null, gols_prado: gp, gols_adversario: ga, status: "encerrado", created_at: "",
    competicao,
    adversario: { id: sigla, nome: sigla, sigla, escudo_url: null, instagram: null, created_at: "" },
    gols: autores.flatMap(([apelido, qtd]) =>
      Array.from({ length: qtd }, (_, i) => ({
        id: `${data}-${apelido}-${i}`, jogo_id: data, jogador_id: apelido, gol_contra: apelido === null,
        minuto: null, created_at: "", jogador: apelido ? jogador(apelido) : null,
      })),
    ),
  };
}

const seed = [
  jogo("2026-10-15", amistoso, "PD", 8, 4, [["Yan", 3], ["Boi", 2], ["Daniel", 1], ["Michael", 1], [null, 1]]),
  jogo("2026-10-20", amistoso, "TFC", 3, 3, [["Yan", 1], ["Daniel", 1], ["Michael", 1]]),
  jogo("2026-10-27", amistoso, "BDS", 10, 1, [["Yguin", 3], ["Yan", 2], ["Michael", 2], ["Daniel", 1], ["Boi", 1], ["Braga", 1]]),
  jogo("2026-11-11", champions, "TFC", 3, 5, [["Michael", 2], ["Daniel", 1]]),
];

test("todas as competições", () => {
  const e = calcularEstatisticas([...seed].reverse());
  assert.equal(e.jogos, 4);
  assert.deepEqual([e.vitorias, e.empates, e.derrotas], [2, 1, 1]);
  assert.deepEqual([e.golsMarcados, e.golsSofridos, e.saldo], [24, 13, 11]);
  assert.equal(e.aproveitamento, 58);
  assert.equal(e.maiorVitoria?.adversario.sigla, "BDS");
  assert.deepEqual(e.porJogo.map((j) => j.adversario.sigla), ["PD", "TFC", "BDS", "TFC"]);
  assert.deepEqual(
    e.artilharia.map((a) => [a.posicao, a.jogador.apelido, a.gols]),
    [[1, "Michael", 6], [1, "Yan", 6], [3, "Daniel", 4], [4, "Boi", 3], [4, "Yguin", 3], [6, "Braga", 1]],
  );
  assert.equal(e.golsContra, 1);
  assert.deepEqual(jogosInconsistentes(seed), []);
});

test("autores dos gols", () => {
  assert.equal(autoresDosGols(seed[0]), "Yan 3, Boi 2, Daniel, Michael, gol contra");
  assert.equal(autoresDosGols(seed[3]), "Michael 2, Daniel");
});

test("só a Champions", () => {
  const e = calcularEstatisticas(seed.filter((j) => j.competicao.id === champions.id));
  assert.deepEqual([e.jogos, e.vitorias, e.empates, e.derrotas, e.golsMarcados, e.golsSofridos], [1, 0, 0, 1, 3, 5]);
  assert.equal(e.maiorVitoria, null);
});

test("sem jogos", () => {
  const e = calcularEstatisticas([]);
  assert.equal(e.aproveitamento, null);
  assert.deepEqual(e.artilharia, []);
});

test("placar sem gols registrados é inconsistente", () => {
  const j = jogo("2026-12-01", amistoso, "X", 2, 0, [["Yan", 1]]);
  assert.equal(jogosInconsistentes([j]).length, 1);
});
