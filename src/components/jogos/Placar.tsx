import Image from "next/image";
import type { Resultado } from "@/lib/stats";

// TeamCrest, Scoreline e ResultBadge: as peças pequenas dos cards de jogo.

export function TeamCrest({ nome, escudoUrl, sigla, tamanho }: { nome: string; escudoUrl?: string | null; sigla?: string | null; tamanho: number }) {
  if (escudoUrl) {
    return <Image src={escudoUrl} alt={`Escudo do ${nome}`} width={tamanho} height={tamanho} className="object-contain" style={{ width: tamanho, height: tamanho }} />;
  }
  return (
    <span
      role="img"
      aria-label={`Escudo do ${nome}`}
      className="titulo flex items-center justify-center rounded-full border-2 border-roxo-claro bg-roxo"
      style={{ width: tamanho, height: tamanho, fontSize: tamanho * 0.3 }}
    >
      {sigla ?? nome.slice(0, 3)}
    </span>
  );
}

export const PRADO = { nome: "Prado FC", escudoUrl: "/brand/escudo-prado.png" };

function Vezes({ className }: { className: string }) {
  return (
    <svg aria-hidden viewBox="0 0 26 26" className={className} fill="none" stroke="var(--color-turquesa)" strokeWidth={6}>
      <path d="m0 0 26 26M26 0 0 26" />
    </svg>
  );
}

export function Scoreline({ golsPrado, golsAdversario, adversario, tamanho = "m" }: { golsPrado: number; golsAdversario: number; adversario: string; tamanho?: "g" | "m" }) {
  const num = tamanho === "g" ? "text-7xl md:text-8xl" : "text-5xl";
  return (
    <p className="flex items-center gap-3">
      <span className="sr-only">
        Prado {golsPrado} a {golsAdversario} {adversario}
      </span>
      <span aria-hidden className={`titulo ${num}`}>{golsPrado}</span>
      <Vezes className={tamanho === "g" ? "size-6" : "size-4"} />
      <span aria-hidden className={`titulo ${num}`}>{golsAdversario}</span>
    </p>
  );
}

const SELO: Record<Resultado, { cls: string; nome: string }> = {
  V: { cls: "bg-turquesa", nome: "Vitória" },
  E: { cls: "bg-texto-3", nome: "Empate" },
  D: { cls: "bg-roxo-claro", nome: "Derrota" },
};

export function ResultBadge({ resultado }: { resultado: Resultado }) {
  return (
    <span title={SELO[resultado].nome} className={`titulo inline-flex size-8 items-center justify-center rounded-md text-lg text-noite ${SELO[resultado].cls}`}>
      <span aria-hidden>{resultado}</span>
      <span className="sr-only">{SELO[resultado].nome}</span>
    </span>
  );
}

export { Vezes };
