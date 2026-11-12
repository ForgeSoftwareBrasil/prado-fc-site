import Image from "next/image";
import type { Patrocinador } from "@/types/database";

const linkDe = (p: Patrocinador) => (p.instagram ? `https://instagram.com/${p.instagram}` : p.site_url);

function Logo({ p, altura }: { p: Patrocinador; altura: string }) {
  const img = <Image src={p.logo_url} alt={p.nome} width={160} height={96} className={`${altura} w-auto object-contain`} />;
  const href = linkDe(p);
  if (!href) return img;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-80">
      {img}
      <span className="sr-only"> (abre em nova aba)</span>
    </a>
  );
}

/** Faixa roxa com as logos brancas dos patrocinadores. */
export function SponsorStrip({ patrocinadores, compacta }: { patrocinadores: Patrocinador[]; compacta?: boolean }) {
  if (!patrocinadores.length) return null;
  if (compacta) {
    return (
      <section aria-label="Patrocinadores" className="bg-roxo">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-center gap-x-9 gap-y-4 px-5 py-4.5 md:gap-x-12 md:px-10 md:py-5">
          <p className="rotulo hidden text-texto-2 md:block">Patrocinadores</p>
          {patrocinadores.map((p) => (
            <Logo key={p.id} p={p} altura="h-11 md:h-13" />
          ))}
        </div>
      </section>
    );
  }
  return (
    <section aria-labelledby="patrocinadores" className="bg-roxo">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-6 px-4 py-10 md:gap-7 md:px-10 md:py-12">
        <h2 id="patrocinadores" className="rotulo text-texto-2">
          Quem joga junto
        </h2>
        <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-6 md:gap-x-18">
          {patrocinadores.map((p) => (
            <li key={p.id}>
              <Logo p={p} altura="h-17 md:h-24" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
