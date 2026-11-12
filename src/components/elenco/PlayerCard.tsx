import Image from "next/image";
import { DuotoneImage } from "@/components/ui/DuotoneImage";
import type { Jogador } from "@/types/database";

export function PlayerCard({ jogador }: { jogador: Jogador }) {
  const apelido = jogador.apelido ?? jogador.nome;
  const detalhes = [jogador.posicao, jogador.pe && `Pé ${jogador.pe.toLowerCase()}`].filter(Boolean).join(" · ");
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-roxo bg-noite-profunda">
      <div className="relative h-[210px] bg-roxo">
        {jogador.foto_url ? (
          <>
            <DuotoneImage src={jogador.foto_url} alt={`Foto de ${apelido}`} sizes="(min-width: 1024px) 200px, 50vw" className="absolute inset-0" />
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-b from-noite-profunda/0 to-noite-profunda" />
            {jogador.numero !== null && <span className="titulo absolute bottom-3 left-3.5 text-[56px]">{jogador.numero}</span>}
          </>
        ) : (
          <>
            <Image src="/brand/escudo-prado.png" alt="" fill sizes="200px" className="object-contain p-1.5 opacity-15 grayscale" />
            {jogador.numero !== null && (
              <span className="titulo absolute inset-0 flex items-center justify-center text-8xl">{jogador.numero}</span>
            )}
          </>
        )}
        {jogador.numero !== null && <span className="sr-only">Camisa {jogador.numero}</span>}
      </div>
      <div className="flex flex-col gap-1 px-3.5 pt-3 pb-4">
        <h3 className="text-lg leading-6 font-extrabold">{apelido}</h3>
        {jogador.nome !== apelido && <p className="text-xs text-texto-3">{jogador.nome}</p>}
        {detalhes && <p className="rotulo text-turquesa">{detalhes}</p>}
      </div>
    </article>
  );
}
