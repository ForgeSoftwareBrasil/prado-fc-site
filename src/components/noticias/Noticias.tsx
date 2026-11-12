import Image from "next/image";
import Link from "next/link";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { formatarDataNoticia } from "@/lib/format";
import type { Noticia } from "@/types/database";

/** Capa sobre fundo roxo: funciona tanto para fotos quanto para logos com fundo transparente. */
export function Capa({ noticia, sizes, priority, className = "" }: { noticia: Noticia; sizes: string; priority?: boolean; className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-roxo ${className}`}>
      <Image
        src={noticia.capa_url ?? "/brand/escudo-prado.png"}
        alt=""
        fill
        sizes={sizes}
        priority={priority}
        className={`object-contain p-5 ${noticia.capa_url ? "" : "opacity-15 grayscale"}`}
      />
    </div>
  );
}

export function NewsCard({ noticia }: { noticia: Noticia }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-roxo bg-noite-profunda">
      <Capa noticia={noticia} sizes="(min-width: 768px) 410px, 100vw" className="h-[200px]" />
      <div className="flex flex-col gap-3 px-5 pt-5 pb-6">
        {noticia.publicado_em && (
          <time dateTime={noticia.publicado_em} className="rotulo text-texto-3">
            {formatarDataNoticia(noticia.publicado_em)}
          </time>
        )}
        <h3 className="titulo text-2xl leading-[1.1]">
          <Link href={`/noticias/${noticia.slug}`} className="after:absolute after:inset-0 group-hover:text-turquesa-claro">
            {noticia.titulo}
          </Link>
        </h3>
        {noticia.resumo && <p className="text-sm leading-5 text-texto-2">{noticia.resumo}</p>}
        <span aria-hidden className="text-sm font-extrabold text-turquesa">
          Ler notícia →
        </span>
      </div>
    </article>
  );
}

const externo = (href?: string) => !!href && /^https?:\/\//.test(href);

export function MarkdownContent({ conteudo }: { conteudo: string }) {
  return (
    <div className="flex flex-col gap-5 text-base leading-6">
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h2 className="titulo mt-2 text-[26px] md:text-[32px]">{children}</h2>,
          h2: ({ children }) => <h2 className="titulo mt-2 text-[26px] md:text-[32px]">{children}</h2>,
          h3: ({ children }) => <h3 className="titulo mt-1 text-xl">{children}</h3>,
          ul: ({ children }) => (
            <ul className="flex flex-col gap-2.5 pl-5 [&>li]:relative [&>li]:before:absolute [&>li]:before:top-2 [&>li]:before:-left-5 [&>li]:before:size-2 [&>li]:before:rotate-45 [&>li]:before:bg-turquesa">
              {children}
            </ul>
          ),
          ol: ({ children }) => <ol className="flex list-decimal flex-col gap-2.5 pl-5 marker:font-extrabold marker:text-turquesa">{children}</ol>,
          a: ({ href, children }) => (
            <a href={href} {...(externo(href) ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="font-semibold text-turquesa underline underline-offset-2 hover:text-turquesa-claro">
              {children}
            </a>
          ),
          strong: ({ children }) => <strong className="font-extrabold">{children}</strong>,
          img: ({ src, alt }) => (
            // Imagens do Markdown têm tamanho desconhecido: <img> simples, com lazy loading
            // eslint-disable-next-line @next/next/no-img-element
            <img src={typeof src === "string" ? src : ""} alt={alt ?? ""} loading="lazy" className="w-full rounded-xl" />
          ),
          blockquote: ({ children }) => <blockquote className="border-l-4 border-turquesa pl-4 text-texto-2">{children}</blockquote>,
        }}
      >
        {conteudo}
      </Markdown>
    </div>
  );
}
