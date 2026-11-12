import type { Metadata } from "next";
import Link from "next/link";
import { MatchCard } from "@/components/jogos/MatchCard";
import { ResultCard } from "@/components/jogos/ResultCard";
import { PageHead, SectionTitle } from "@/components/ui/SectionTitle";
import { getCompeticoes, getProximosJogos, getResultados } from "@/lib/data/jogos";

export const revalidate = 300;
export const metadata: Metadata = { title: "Jogos", description: "Próximos jogos e resultados do Prado FC." };

const Vazio = ({ children }: { children: React.ReactNode }) => (
  <p className="rounded-2xl border border-dashed border-roxo px-5 py-8 text-center text-texto-2">{children}</p>
);

function Chip({ href, ativo, children }: { href: string; ativo: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={ativo ? "page" : undefined}
      className={`rounded-full px-4 py-2.5 text-[13px] leading-[18px] transition-colors ${
        ativo ? "bg-turquesa font-extrabold text-noite" : "border border-roxo-claro font-semibold hover:border-turquesa-claro hover:text-turquesa-claro"
      }`}
    >
      {children}
    </Link>
  );
}

export default async function JogosPage({ searchParams }: { searchParams: Promise<{ competicao?: string }> }) {
  const { competicao } = await searchParams;
  const [competicoes, proximos, resultados] = await Promise.all([
    getCompeticoes(),
    getProximosJogos({ competicaoId: competicao }),
    getResultados({ competicaoId: competicao }),
  ]);
  // O mesmo nome pode existir em várias temporadas; o filtro é por competição (id)
  const filtro = competicoes.find((c) => c.id === competicao);

  return (
    <>
      <PageHead titulo="Jogos" chapeu={filtro ? `${filtro.nome} · ${filtro.temporada}` : `Temporada ${competicoes[0]?.temporada ?? new Date().getFullYear()}`} />
      {competicoes.length > 1 && (
        <nav aria-label="Filtrar por competição" className="mx-auto max-w-[1440px] px-4 pt-4 pb-2 md:px-20 md:pt-6">
          <ul className="flex flex-wrap gap-2">
            <li>
              <Chip href="/jogos" ativo={!filtro}>
                Todas
              </Chip>
            </li>
            {competicoes.map((c) => (
              <li key={c.id}>
                <Chip href={`/jogos?competicao=${c.id}`} ativo={c.id === filtro?.id}>
                  {c.nome}
                  {new Set(competicoes.map((x) => x.temporada)).size > 1 && ` ${c.temporada}`}
                </Chip>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <section aria-labelledby="proximos" className="mx-auto flex max-w-[1440px] flex-col gap-5 px-4 pt-8 pb-12 md:gap-6 md:px-20 md:pt-10 md:pb-18">
        <SectionTitle id="proximos" titulo="Próximos" />
        {proximos.length ? (
          <div className="grid items-start gap-6 md:grid-cols-2 lg:grid-cols-3">
            {proximos.map((j) => (
              <MatchCard key={j.id} jogo={j} />
            ))}
          </div>
        ) : (
          <Vazio>Nenhum jogo agendado{filtro ? " nessa competição" : ""}.</Vazio>
        )}
      </section>

      <section aria-labelledby="resultados" className="bg-noite-profunda">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-4 pt-10 pb-14 md:gap-6 md:px-20 md:pt-16 md:pb-22">
          <SectionTitle id="resultados" titulo="Resultados" />
          {resultados.length ? (
            <div className="grid items-start gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {resultados.map((j) => (
                <ResultCard key={j.id} jogo={j} />
              ))}
            </div>
          ) : (
            <Vazio>Nenhum jogo encerrado{filtro ? " nessa competição" : ""}.</Vazio>
          )}
        </div>
      </section>
    </>
  );
}
