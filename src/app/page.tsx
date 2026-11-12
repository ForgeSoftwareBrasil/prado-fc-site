import Image from "next/image";
import { MatchCard } from "@/components/jogos/MatchCard";
import { ResultCard } from "@/components/jogos/ResultCard";
import { SponsorStrip } from "@/components/layout/SponsorStrip";
import { NewsCard } from "@/components/noticias/Noticias";
import { Button } from "@/components/ui/Button";
import { ChevronDivider, DivisasFundo } from "@/components/ui/Chevron";
import { DuotoneImage } from "@/components/ui/DuotoneImage";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getProximosJogos, getUltimoResultado } from "@/lib/data/jogos";
import { getNoticias } from "@/lib/data/noticias";
import { getPatrocinadores } from "@/lib/data/patrocinadores";
import { formatarDataHora } from "@/lib/format";
import { MASCOTE_ATIVA, WHATSAPP_URL } from "@/lib/site";
import type { Jogo } from "@/types/database";

export const revalidate = 300;

const Vazio = ({ children }: { children: React.ReactNode }) => (
  <p className="rounded-2xl border border-dashed border-roxo px-5 py-8 text-center text-texto-2">{children}</p>
);

function Hero({ proximo, ultimo }: { proximo?: Jogo; ultimo: Jogo | null }) {
  return (
    <section aria-labelledby="destaque" className="relative overflow-hidden">
      {/* Imagem: em cima no celular, metade direita no desktop */}
      <div className="relative h-[537px] lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[51.4%]">
        {MASCOTE_ATIVA ? (
          <Image src="/mascote/harpia.webp" alt="A harpia, mascote do Prado, pousada no travessão de um gol" fill priority sizes="(min-width: 1024px) 740px, 100vw" className="object-cover object-[50%_20%]" />
        ) : (
          <>
            <DuotoneImage src="/fotos/elenco-amistoso-pb-roxo.webp" alt="Elenco do Prado FC reunido no campo" sizes="(min-width: 1024px) 740px, 100vw" priority className="absolute inset-0" />
            <DivisasFundo className="top-10 left-1/2 w-[110%] -translate-x-1/2 opacity-70 lg:top-24" />
            <Image src="/brand/escudo-prado.png" alt="" width={300} height={382} className="absolute top-[92px] left-1/2 h-[204px] w-40 -translate-x-1/2 drop-shadow-2xl lg:top-1/2 lg:h-[382px] lg:w-[300px] lg:-translate-y-[60%]" />
          </>
        )}
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-[200px] bg-linear-to-b from-noite/0 via-noite/75 to-noite lg:h-[200px] lg:via-noite/0" />
        <div aria-hidden className="absolute inset-y-0 left-0 hidden w-[46%] bg-linear-to-r from-noite to-noite/0 lg:block" />
      </div>
      {!MASCOTE_ATIVA && <DivisasFundo className="bottom-0 -left-10 hidden w-[720px] opacity-35 lg:block" />}

      <div className="relative mx-auto -mt-[169px] flex max-w-[1440px] flex-col items-center gap-7 px-4 pb-12 lg:mt-0 lg:min-h-[760px] lg:items-start lg:px-20 lg:pt-16 lg:pb-20">
        <h1 id="destaque" className="text-center lg:text-left">
          {MASCOTE_ATIVA ? (
            <span className="font-cinzel text-[30px] leading-[1.15] font-semibold tracking-[0.12em] text-prata uppercase lg:text-5xl lg:leading-[1.1]">
              Alguém está
              <br />
              <span className="text-turquesa">de olho.</span>
            </span>
          ) : (
            <span className="titulo text-5xl lg:text-7xl lg:leading-[0.95]">
              Foco, garra
              <br />
              <span className="text-turquesa">e amizade</span>
            </span>
          )}
          <span className="sr-only"> · Prado FC</span>
        </h1>
        <div className="w-full max-w-[358px] sm:max-w-[520px]">
          {proximo ? (
            <MatchCard jogo={proximo} chamada="Próximo jogo" contagem />
          ) : ultimo ? (
            <ResultCard jogo={ultimo} />
          ) : (
            <Vazio>Nenhum jogo agendado.</Vazio>
          )}
        </div>
      </div>
    </section>
  );
}

export default async function Home() {
  const [proximos, ultimo, noticias, patrocinadores] = await Promise.all([
    getProximosJogos({ limite: 3 }),
    getUltimoResultado(),
    getNoticias({ limite: 3 }),
    getPatrocinadores(),
  ]);

  return (
    <>
      <Hero proximo={proximos[0]} ultimo={ultimo} />

      <div className="mx-auto grid max-w-[1440px] lg:grid-cols-2 lg:gap-10 lg:px-20 lg:pt-18 lg:pb-20">
        <section aria-labelledby="ultimo" className="flex flex-col gap-5 px-4 pt-10 pb-12 lg:gap-6 lg:p-0">
          <SectionTitle id="ultimo" titulo="Último resultado" chapeu={ultimo ? formatarDataHora(ultimo.data_hora).split(" · ")[0] : undefined} />
          {ultimo ? <ResultCard jogo={ultimo} /> : <Vazio>Nenhum jogo encerrado ainda.</Vazio>}
        </section>
        <ChevronDivider className="lg:hidden" />
        <section aria-labelledby="proximos" className="flex flex-col gap-5 bg-noite-profunda px-4 pt-10 pb-12 lg:gap-6 lg:bg-transparent lg:p-0">
          <SectionTitle id="proximos" titulo="Próximos jogos" chapeu="Agenda do Prado" link={{ href: "/jogos", texto: "Ver todos" }} />
          {proximos.length ? proximos.map((j) => <MatchCard key={j.id} jogo={j} />) : <Vazio>Nenhum jogo agendado.</Vazio>}
          <Button href="/jogos" variante="secundario" className="lg:hidden">
            Ver todos os jogos
          </Button>
        </section>
      </div>

      <ChevronDivider className="hidden lg:block" />

      <section aria-labelledby="noticias" className="lg:bg-noite-profunda">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-4 pt-12 pb-12 lg:gap-7 lg:px-20 lg:pt-18 lg:pb-22">
          <SectionTitle id="noticias" titulo="Notícias" chapeu="Do vestiário" link={{ href: "/noticias", texto: "Ver todas" }} />
          {noticias.length ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {noticias.map((n) => (
                <NewsCard key={n.id} noticia={n} />
              ))}
            </div>
          ) : (
            <Vazio>Nenhuma notícia publicada ainda.</Vazio>
          )}
          <Button href="/noticias" variante="secundario" className="lg:hidden">
            Ver todas as notícias
          </Button>
        </div>
      </section>

      <SponsorStrip patrocinadores={patrocinadores} />

      <section aria-labelledby="jogue" className="relative overflow-hidden">
        <DivisasFundo className="right-[-40px] bottom-[-110px] w-[430px] opacity-45 lg:right-0 lg:bottom-[-90px] lg:w-[720px]" />
        <div className="relative mx-auto flex max-w-[1440px] flex-col gap-4 px-4 py-14 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-20 lg:py-24">
          <div className="flex max-w-[720px] flex-col gap-4">
            <p className="rotulo text-turquesa">Bora pro jogo</p>
            <h2 id="jogue" className="titulo text-5xl lg:text-7xl lg:leading-[0.95]">
              Jogue com a gente
            </h2>
            <p className="leading-6 text-texto-2 lg:text-lg lg:leading-7">Quer vestir a camisa do Prado? Chama a gente no WhatsApp e cola no próximo treino.</p>
          </div>
          <Button href={WHATSAPP_URL} externo className="shrink-0">
            Chamar no WhatsApp
          </Button>
        </div>
      </section>
    </>
  );
}
