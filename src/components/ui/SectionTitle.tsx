import Link from "next/link";
import { ChevronMark } from "./Chevron";

type Props = {
  titulo: string;
  chapeu?: string;
  link?: { href: string; texto: string };
  id?: string;
};

export function SectionTitle({ titulo, chapeu, link, id }: Props) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="flex flex-col gap-2.5">
        {chapeu && (
          <p className="rotulo flex items-center gap-2.5 text-turquesa">
            <ChevronMark />
            {chapeu}
          </p>
        )}
        <h2 id={id} className="titulo text-[2rem] md:text-5xl">
          {titulo}
        </h2>
      </div>
      {link && (
        <Link href={link.href} className="shrink-0 text-sm font-extrabold text-turquesa transition-colors hover:text-turquesa-claro">
          {link.texto} <span aria-hidden>→</span>
        </Link>
      )}
    </div>
  );
}

/** Topo das páginas internas: chapéu + título (h1). */
export function PageHead({ titulo, chapeu }: { titulo: string; chapeu: string }) {
  return (
    <header className="mx-auto flex w-full max-w-[1440px] flex-col gap-2.5 px-4 pt-10 pb-2 md:gap-3.5 md:px-20 md:pt-18">
      <p className="rotulo flex items-center gap-2.5 text-turquesa">
        <ChevronMark />
        {chapeu}
      </p>
      <h1 className="titulo text-6xl leading-[0.95] md:text-8xl">{titulo}</h1>
    </header>
  );
}
