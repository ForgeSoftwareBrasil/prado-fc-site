import { formatarHora, seloData } from "@/lib/format";
import type { Jogo } from "@/types/database";
import { Countdown } from "./Countdown";
import { PRADO, TeamCrest, Vezes } from "./Placar";

export const rotuloCompeticao = (j: Jogo) => [j.competicao.nome, j.rodada].filter(Boolean).join(" · ");

function Time({ nome, escudoUrl, sigla }: { nome: string; escudoUrl?: string | null; sigla?: string | null }) {
  return (
    <div className="flex w-[120px] flex-col items-center gap-2.5 text-center">
      <TeamCrest nome={nome} escudoUrl={escudoUrl} sigla={sigla} tamanho={80} />
      <span className="titulo text-lg leading-[1.1]">{nome}</span>
    </div>
  );
}

type Props = {
  jogo: Jogo;
  /** Texto de cima, ex.: "Próximo jogo". */
  chamada?: string;
  contagem?: boolean;
  className?: string;
};

/** Card do próximo jogo, inspirado na arte "Dia de jogo" do Instagram. */
export function MatchCard({ jogo, chamada, contagem, className = "" }: Props) {
  const adiado = jogo.status === "adiado";
  return (
    <article className={`relative flex flex-col items-center gap-5 overflow-hidden rounded-2xl bg-roxo px-6 pt-6 pb-7 ${className}`}>
      <svg aria-hidden viewBox="0 0 360 180" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 bottom-0 h-40 w-full opacity-5" fill="none">
        <path d="M0 120 180 30l180 90M0 170l180-90 180 90" stroke="white" strokeWidth={22} />
      </svg>
      <header className="flex flex-col items-center gap-1.5 text-center">
        {chamada && <p className="rotulo">{chamada}</p>}
        <p className="rotulo text-turquesa-claro">{rotuloCompeticao(jogo)}</p>
      </header>
      <div className="flex w-full items-center justify-between">
        <Time {...PRADO} />
        <Vezes className="size-6" />
        <Time nome={jogo.adversario.nome} escudoUrl={jogo.adversario.escudo_url} sigla={jogo.adversario.sigla} />
      </div>
      <h3 className="sr-only">
        Prado FC contra {jogo.adversario.nome}
      </h3>
      <div className="flex items-center gap-2 text-[15px] font-extrabold text-noite">
        <time dateTime={jogo.data_hora} className="rounded bg-turquesa px-3 py-2">{seloData(jogo.data_hora)}</time>
        <span className="rounded bg-branco px-3 py-2">{formatarHora(jogo.data_hora)}</span>
      </div>
      <p className="text-sm text-texto-2">{jogo.local}</p>
      {adiado ? <p className="rotulo rounded bg-noite px-3 py-2 text-turquesa-claro">Jogo adiado</p> : contagem && <Countdown dataHora={jogo.data_hora} />}
    </article>
  );
}
