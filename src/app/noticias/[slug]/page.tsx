import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Capa, MarkdownContent, NewsCard } from "@/components/noticias/Noticias";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getNoticia, getNoticias } from "@/lib/data/noticias";
import { formatarDataNoticia } from "@/lib/format";

export const revalidate = 300;

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getNoticias()).map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const n = await getNoticia((await params).slug);
  if (!n) return { title: "Notícia não encontrada" };
  return {
    title: n.titulo,
    description: n.resumo ?? undefined,
    openGraph: { type: "article", title: n.titulo, description: n.resumo ?? undefined, publishedTime: n.publicado_em ?? undefined, ...(n.capa_url && { images: [n.capa_url] }) },
  };
}

export default async function NoticiaPage({ params }: Params) {
  const { slug } = await params;
  const [noticia, outras] = await Promise.all([getNoticia(slug), getNoticias({ limite: 3, excetoSlug: slug })]);
  if (!noticia) notFound();

  return (
    <>
      <article className="mx-auto flex max-w-[800px] flex-col gap-5 px-4 pt-7 pb-12 md:gap-6 md:px-0 md:pt-12 md:pb-20">
        <Link href="/noticias" className="text-sm font-extrabold text-turquesa hover:text-turquesa-claro">
          <span aria-hidden>← </span>Todas as notícias
        </Link>
        <Capa noticia={noticia} sizes="(min-width: 800px) 800px, 100vw" priority className="h-60 rounded-2xl md:h-100" />
        {noticia.publicado_em && (
          <time dateTime={noticia.publicado_em} className="rotulo text-texto-3">
            {formatarDataNoticia(noticia.publicado_em)}
          </time>
        )}
        <h1 className="titulo text-[38px] md:text-6xl">{noticia.titulo}</h1>
        {noticia.resumo && <p className="text-lg leading-7 text-texto-2">{noticia.resumo}</p>}
        <hr className="border-roxo" />
        <MarkdownContent conteudo={noticia.conteudo_md} />
      </article>

      <section aria-labelledby="mais" className="bg-noite-profunda">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-4 pt-10 pb-12 md:gap-6 md:px-20 md:pt-16 md:pb-22">
          <SectionTitle id="mais" titulo="Mais notícias" />
          {outras.length ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {outras.map((n) => (
                <NewsCard key={n.id} noticia={n} />
              ))}
            </div>
          ) : (
            <p className="text-texto-2">As próximas notícias aparecem aqui. Enquanto isso, acompanhe o Prado no Instagram @pradofcbh.</p>
          )}
        </div>
      </section>
    </>
  );
}
