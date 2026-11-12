"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronMark, DivisasFundo } from "@/components/ui/Chevron";
import { Button } from "@/components/ui/Button";
import { INSTAGRAM_URL, NAV, WHATSAPP_URL } from "@/lib/site";

const ativo = (pathname: string, href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

function Marca({ pequena }: { pequena?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 md:gap-3">
      <Image src="/brand/escudo-prado.png" alt="" width={40} height={51} className={pequena ? "h-[41px] w-8" : "h-[51px] w-10"} />
      <span className={`titulo ${pequena ? "text-[22px]" : "text-[26px]"}`}>Prado FC</span>
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const [aberto, setAberto] = useState(false);

  // Fecha o menu ao navegar e com Esc; trava a rolagem enquanto aberto
  useEffect(() => setAberto(false), [pathname]);
  useEffect(() => {
    if (!aberto) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setAberto(false);
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = "";
    };
  }, [aberto]);

  return (
    <header className="sticky top-0 z-40 border-b border-roxo bg-noite">
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-turquesa focus:px-4 focus:py-2 focus:text-noite">
        Pular para o conteúdo
      </a>

      {/* Desktop */}
      <div className="mx-auto hidden h-21 max-w-[1440px] items-center justify-between px-20 lg:flex">
        <Marca />
        <nav aria-label="Principal">
          <ul className="flex items-center gap-9">
            {NAV.map((item) => {
              const atual = ativo(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={atual ? "page" : undefined}
                    className={`flex flex-col items-center gap-1.5 pt-2 text-[15px] font-semibold transition-colors hover:text-turquesa-claro ${atual ? "text-turquesa" : ""}`}
                  >
                    {item.texto}
                    <span aria-hidden className={`h-0.5 w-full ${atual ? "bg-turquesa" : "bg-transparent"}`} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <Button href={WHATSAPP_URL} externo>
          Jogue com a gente
        </Button>
      </div>

      {/* Mobile */}
      <div className="flex h-16 items-center justify-between pr-3 pl-4 lg:hidden">
        <Marca pequena />
        <button
          type="button"
          onClick={() => setAberto(true)}
          aria-expanded={aberto}
          aria-controls="menu-mobile"
          className="flex size-11 flex-col items-center justify-center gap-[5px]"
        >
          <span className="sr-only">Abrir menu</span>
          <span aria-hidden className="h-[3px] w-6 rounded-sm bg-branco" />
          <span aria-hidden className="h-[3px] w-6 rounded-sm bg-branco" />
          <span aria-hidden className="h-[3px] w-6 rounded-sm bg-turquesa" />
        </button>
      </div>

      {aberto && (
        <div id="menu-mobile" role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-noite lg:hidden">
          <DivisasFundo className="-bottom-24 left-1/2 w-[440px] -translate-x-1/2 opacity-50" />
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-roxo pr-3 pl-4">
            <Marca pequena />
            <button type="button" onClick={() => setAberto(false)} className="flex size-11 items-center justify-center" autoFocus>
              <span className="sr-only">Fechar menu</span>
              <svg aria-hidden viewBox="0 0 20 20" className="size-5" stroke="currentColor" strokeWidth={3}>
                <path d="m0 0 20 20M20 0 0 20" />
              </svg>
            </button>
          </div>
          <nav aria-label="Principal" className="relative px-6 py-4">
            <ul>
              {NAV.map((item) => {
                const atual = ativo(pathname, item.href);
                return (
                  <li key={item.href} className="border-b border-roxo">
                    <Link href={item.href} aria-current={atual ? "page" : undefined} className={`titulo flex items-center justify-between py-4.5 text-4xl ${atual ? "text-turquesa" : ""}`}>
                      {item.texto}
                      {atual && <ChevronMark />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="relative flex flex-col gap-4 px-6 pt-4 pb-6">
            <Button href={WHATSAPP_URL} externo>
              Jogue com a gente
            </Button>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-texto-2">
              @pradofcbh no Instagram<span className="sr-only"> (abre em nova aba)</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
