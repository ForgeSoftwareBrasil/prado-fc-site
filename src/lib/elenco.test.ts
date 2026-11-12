import { test } from "node:test";
import assert from "node:assert/strict";
import { agruparElenco } from "./elenco.ts";
import type { Jogador } from "../types/database.ts";

const j = (apelido: string, numero: number | null, posicao: string | null): Jogador => ({
  id: apelido, nome: apelido, apelido, nome_camisa: null, numero, posicao,
  pe: null, foto_url: null, ativo: true, ordem: null, created_at: "",
});

test("agrupa pela primeira posição, na ordem combinada", () => {
  const grupos = agruparElenco([
    j("Trigueiro", null, "Técnico"), j("Michael", 30, "Pivô"), j("João", 13, "Pivô"),
    j("Daniel", 7, "Ala/Pivô"), j("Yan", 10, "Ala/Meia"), j("Ramos", 1, "Goleiro"),
    j("Braga", 77, "Fixo"), j("Boi", 9, "Fixo"), j("Dudu", 8, "Meia"), j("Novo", 99, null),
  ]);
  assert.deepEqual(
    grupos.map((g) => [g.titulo, g.jogadores.map((x) => x.apelido)]),
    [
      ["Goleiros", ["Ramos"]],
      ["Fixos", ["Boi", "Braga"]],
      ["Alas", ["Daniel", "Yan"]],
      ["Meias", ["Dudu"]],
      ["Pivôs", ["João", "Michael"]],
      ["Elenco", ["Novo"]],
      ["Comissão técnica", ["Trigueiro"]],
    ],
  );
});
