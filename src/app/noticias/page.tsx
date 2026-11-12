import type { Metadata } from "next";
import Link from "next/link";
import { NewsCard } from "@/components/noticias/Noticias";
import { PageHead } from "@/components/ui/SectionTitle";
import { getNoticias } from "@/lib/data/noticias";

export const revalidate = 300;
export const metadata: Metadata = { title: "Notícias", description: "As notícias do Prado FC." };

const POR_PAGINA = 12;

export default async function NoticiasPage({ searchParams }: { searchParams: Promise<{ pagina?: string }> }) {
  const todas = await getNoticias();
  const total = Math.max(1, Math.ceil(todas.length / POR_PAGINA));
  const pagina = Math.min(total, Math.max(1, Number((await searchParams).pagina) || 1));
  const noticias = todas.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

  return (
    <>
      <PageHead titulo="Notícias" chapeu="Do vestiário" />
      <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-4 pt-6 pb-16 md:px-20 md:pt-10 md:pb-24">
        {noticias.length ? (
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {noticias.map((n) => (
              <li key={n.id} className="flex">
                <NewsCard noticia={n} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-2xl border border-dashed border-roxo px-5 py-8 text-center text-texto-2">Nenhuma notícia publicada ainda.</p>
        )}
        {total > 1 && (
          <nav aria-label="Paginação" className="flex items-center justify-center gap-6 text-sm font-extrabold">
            {pagina > 1 && <Link href={`/noticias?pagina=${pagina - 1}`} className="text-turquesa hover:text-turquesa-claro">← Mais recentes</Link>}
            <span className="text-texto-3">
              Página {pagina} de {total}
            </span>
            {pagina < total && <Link href={`/noticias?pagina=${pagina + 1}`} className="text-turquesa hover:text-turquesa-claro">Mais antigas →</Link>}
          </nav>
        )}
      </div>
    </>
  );
}
