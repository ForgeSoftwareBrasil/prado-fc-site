import Image from "next/image";
import Link from "next/link";
import { getPatrocinadores } from "@/lib/data/patrocinadores";
import { INSTAGRAM_URL, NAV } from "@/lib/site";
import { SponsorStrip } from "./SponsorStrip";

function PoweredByForge() {
  return (
    <a
      href="https://forgesoftwarebrasil.vercel.app/"
      target="_blank"
      rel="noopener"
      className="flex items-center gap-2.5 opacity-60 transition-opacity duration-200 hover:opacity-100 focus-visible:opacity-100"
    >
      <span className="text-xs">Powered by</span>
      <Image src="/brand/forge-logo-branca.png" alt="Forge Software" width={84} height={44} className="h-11 w-auto" />
      <span className="sr-only"> (abre em nova aba)</span>
    </a>
  );
}

export async function Footer() {
  const patrocinadores = await getPatrocinadores();
  return (
    <footer className="bg-noite-profunda">
      <SponsorStrip patrocinadores={patrocinadores} compacta />
      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-5 pt-10 pb-8 md:flex-row md:items-start md:justify-between md:gap-16 md:px-20 md:pt-16 md:pb-14">
        <div className="flex items-center gap-4 md:gap-5">
          <Image src="/brand/escudo-prado.png" alt="Prado FC" width={72} height={92} className="h-[71px] w-14 md:h-[92px] md:w-[72px]" />
          <div className="flex flex-col gap-1 md:gap-1.5">
            <p className="titulo text-2xl md:text-[2rem]">Foco, garra e amizade</p>
            <p className="text-[13px] text-texto-2 md:text-sm">Society e futsal no bairro Prado, BH. Desde 2026.</p>
          </div>
        </div>
        <nav aria-label="Rodapé" className="hidden flex-col gap-3 md:flex">
          <p className="rotulo text-texto-3">Navegação</p>
          <ul className="flex flex-col gap-1.5 text-[15px] font-semibold">
            {NAV.slice(1).map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-turquesa-claro">
                  {item.texto}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex flex-col gap-2 md:gap-3">
          <p className="rotulo text-texto-3">Siga o Prado</p>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-lg font-extrabold text-turquesa hover:text-turquesa-claro">
            @pradofcbh<span className="sr-only"> no Instagram (abre em nova aba)</span>
          </a>
          <p className="hidden text-[13px] text-texto-3 md:block">Uniformes: MS Esportes</p>
        </div>
      </div>
      <div className="border-t border-roxo">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-3 px-5 pt-5 pb-7 md:flex-row-reverse md:items-center md:justify-between md:px-20 md:pb-6">
          <PoweredByForge />
          <p className="text-xs text-texto-3">© {new Date().getFullYear()} Prado FC</p>
        </div>
      </div>
    </footer>
  );
}
