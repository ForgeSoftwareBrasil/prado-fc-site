import type { Metadata } from "next";
import { PlayerCard } from "@/components/elenco/PlayerCard";
import { PageHead, SectionTitle } from "@/components/ui/SectionTitle";
import { getElenco } from "@/lib/data/elenco";

export const revalidate = 300;
export const metadata: Metadata = { title: "Elenco", description: "Os jogadores e a comissão técnica do Prado FC." };

const contagem = (titulo: string, n: number) =>
  titulo === "Comissão técnica" ? `${n} ${n === 1 ? "integrante" : "integrantes"}` : `${n} ${n === 1 ? "atleta" : "atletas"}`;

export default async function ElencoPage() {
  const grupos = await getElenco();
  return (
    <>
      <PageHead titulo="Elenco" chapeu={`Temporada ${new Date().getFullYear()}`} />
      <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-4 pt-6 pb-14 md:gap-14 md:px-20 md:pt-10 md:pb-24">
        {grupos.length ? (
          grupos.map((g) => {
            const id = `grupo-${g.titulo.normalize("NFD").replace(/\W/g, "").toLowerCase()}`;
            return (
              <section key={g.titulo} aria-labelledby={id} className="flex flex-col gap-4">
                <SectionTitle id={id} titulo={g.titulo} chapeu={contagem(g.titulo, g.jogadores.length)} />
                <ul className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-[repeat(6,196px)] lg:gap-5">
                  {g.jogadores.map((j) => (
                    <li key={j.id}>
                      <PlayerCard jogador={j} />
                    </li>
                  ))}
                </ul>
              </section>
            );
          })
        ) : (
          <p className="rounded-2xl border border-dashed border-roxo px-5 py-8 text-center text-texto-2">O elenco ainda não foi cadastrado.</p>
        )}
      </div>
    </>
  );
}
