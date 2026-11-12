import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { DivisasFundo } from "@/components/ui/Chevron";
import { MASCOTE_ATIVA } from "@/lib/site";

export const metadata = { title: "Página não encontrada" };

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-[1440px] flex-col items-center gap-5 px-4 pb-18 lg:flex-row-reverse lg:gap-16 lg:px-20 lg:pt-16 lg:pb-24">
      <div className="relative h-[250px] w-[calc(100%+2rem)] shrink-0 overflow-hidden lg:h-[360px] lg:w-[600px] lg:rounded-3xl">
        {MASCOTE_ATIVA ? (
          // A imagem tem a frase da campanha embaixo: o recorte mostra só os olhos
          <Image src="/mascote/harpia-olhos-teaser.webp" alt="Os olhos turquesa da harpia" fill priority sizes="(min-width: 1024px) 600px, 100vw" className="object-cover object-[50%_8%]" />
        ) : (
          <div className="absolute inset-0 bg-roxo">
            <DivisasFundo className="inset-x-0 top-6 mx-auto w-full opacity-60" cor="var(--color-noite)" />
            <Image src="/brand/escudo-prado.png" alt="" width={160} height={204} className="absolute top-1/2 left-1/2 h-[204px] w-40 -translate-1/2" />
          </div>
        )}
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-b from-noite/0 to-noite lg:h-40" />
      </div>
      <div className="flex w-full flex-col items-center gap-5 text-center lg:items-start lg:gap-6 lg:text-left">
        <p className="rotulo text-turquesa">Erro 404</p>
        <h1 className="titulo text-5xl lg:text-[88px] lg:leading-[0.95]">Essa bola foi pra fora.</h1>
        <p className="leading-6 text-texto-2 lg:text-lg">A página que você procurou não existe ou mudou de lugar.</p>
        <Button href="/" className="w-full lg:w-auto">
          Voltar para a home
        </Button>
      </div>
    </section>
  );
}
