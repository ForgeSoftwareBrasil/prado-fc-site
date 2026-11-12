"use client";

import { useRouter } from "next/navigation";
import type { Competicao } from "@/types/database";

type Props = { temporadas: number[]; competicoes: Competicao[]; temporada: number; competicaoId?: string };

function Seta() {
  return (
    <svg aria-hidden viewBox="0 0 12 8" className="pointer-events-none absolute top-1/2 right-3.5 h-2 w-3 -translate-y-1/2" fill="none" stroke="var(--color-turquesa)" strokeWidth={2.5}>
      <path d="m0 1 6 6 6-6" />
    </svg>
  );
}

const SELECT = "h-12 w-full appearance-none rounded-lg border border-roxo-claro bg-noite-profunda pr-10 pl-3.5 text-[15px] font-semibold";

/** Filtros na URL (?temporada=2026&competicao=<id>), para o link ser compartilhável. */
export function StatsFilters({ temporadas, competicoes, temporada, competicaoId }: Props) {
  const router = useRouter();
  const daTemporada = competicoes.filter((c) => c.temporada === temporada);

  function ir(t: number, c?: string) {
    const q = new URLSearchParams({ temporada: String(t) });
    if (c) q.set("competicao", c);
    router.push(`/estatisticas?${q}`, { scroll: false });
  }

  return (
    <form action="/estatisticas" className="flex gap-3 md:gap-4">
      <label className="flex flex-1 flex-col gap-1.5 md:w-70 md:flex-none">
        <span className="rotulo text-texto-2">Temporada</span>
        <span className="relative">
          <select name="temporada" value={temporada} onChange={(e) => ir(Number(e.target.value))} className={SELECT}>
            {temporadas.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <Seta />
        </span>
      </label>
      <label className="flex flex-1 flex-col gap-1.5 md:w-70 md:flex-none">
        <span className="rotulo text-texto-2">Competição</span>
        <span className="relative">
          <select name="competicao" value={competicaoId ?? ""} onChange={(e) => ir(temporada, e.target.value || undefined)} className={SELECT}>
            <option value="">Todas</option>
            {daTemporada.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
          <Seta />
        </span>
      </label>
      <noscript>
        <button type="submit" className="self-end rounded-lg bg-turquesa px-4 py-3 font-extrabold text-noite">
          Filtrar
        </button>
      </noscript>
    </form>
  );
}
