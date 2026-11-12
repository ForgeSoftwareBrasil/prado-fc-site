"use client";

import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ResultBadge } from "@/components/jogos/Placar";
import type { Resultado } from "@/lib/stats";

export type PontoGrafico = {
  id: string;
  sigla: string;
  data: string;
  marcados: number;
  sofridos: number;
  resultado: Resultado;
  adversario: string;
  competicao: string;
  dataCompleta: string;
};

const COLUNA = 96; // largura mínima por jogo; abaixo disso o gráfico rola na horizontal

function Dica({ active, payload }: { active?: boolean; payload?: { payload: PontoGrafico }[] }) {
  const p = active ? payload?.[0]?.payload : undefined;
  if (!p) return null;
  return (
    <div className="rounded-lg border border-roxo-claro bg-noite px-3.5 py-2.5 shadow-2xl">
      <p className="text-[13px] font-extrabold">
        Prado {p.marcados} × {p.sofridos} {p.adversario}
      </p>
      <p className="text-xs text-texto-2">
        {p.competicao} · {p.dataCompleta}
      </p>
    </div>
  );
}

export function PerformanceChart({ pontos }: { pontos: PontoGrafico[] }) {
  return (
    <figure className="rounded-2xl border border-roxo bg-noite-profunda p-5 md:p-7">
      <figcaption className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <span className="titulo text-2xl">Gols jogo a jogo</span>
        <span className="flex gap-5 text-[13px] font-semibold text-texto-2">
          <span className="flex items-center gap-2">
            <span aria-hidden className="size-3 rounded-[3px] bg-turquesa" /> Gols marcados
          </span>
          <span className="flex items-center gap-2">
            <span aria-hidden className="size-3 rounded-[3px] bg-roxo-claro" /> Gols sofridos
          </span>
        </span>
      </figcaption>

      <div className="-mx-1 overflow-x-auto px-1 pb-1">
        <div style={{ minWidth: pontos.length * COLUNA + 40 }}>
          <div aria-hidden className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pontos} margin={{ top: 24, right: 0, bottom: 0, left: 0 }} barGap={6} barCategoryGap="30%">
                <CartesianGrid vertical={false} stroke="rgb(255 255 255 / 0.08)" />
                <YAxis width={28} allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: "var(--color-texto-3)", fontSize: 11 }} />
                <XAxis dataKey="id" hide />
                <Tooltip content={<Dica />} cursor={{ fill: "rgb(255 255 255 / 0.04)" }} />
                <Bar dataKey="marcados" fill="var(--color-turquesa)" radius={[4, 4, 0, 0]} maxBarSize={28} activeBar={{ fill: "var(--color-turquesa-claro)" }}>
                  <LabelList dataKey="marcados" position="top" fill="var(--color-turquesa)" fontFamily="var(--font-anton)" fontSize={15} />
                </Bar>
                <Bar dataKey="sofridos" fill="var(--color-roxo-claro)" radius={[4, 4, 0, 0]} maxBarSize={28}>
                  <LabelList dataKey="sofridos" position="top" fill="var(--color-roxo-claro)" fontFamily="var(--font-anton)" fontSize={15} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Rótulos e selos alinhados às colunas (28px = eixo Y) */}
          <ol className="mt-4 grid pl-7" style={{ gridTemplateColumns: `repeat(${pontos.length}, minmax(0, 1fr))` }}>
            {pontos.map((p) => (
              <li key={p.id} className="flex flex-col items-center gap-0.5 text-center">
                <span className="text-[13px] font-extrabold">{p.sigla}</span>
                <span className="text-xs text-texto-3">{p.data}</span>
                <span className="mt-3">
                  <ResultBadge resultado={p.resultado} />
                </span>
                <span className="sr-only">
                  Prado {p.marcados} a {p.sofridos} {p.adversario}, {p.competicao}, {p.dataCompleta}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </figure>
  );
}
