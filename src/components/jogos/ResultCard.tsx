import { formatarDataHora } from "@/lib/format";
import { autoresDosGols, resultado } from "@/lib/stats";
import type { Jogo } from "@/types/database";
import { rotuloCompeticao } from "./MatchCard";
import { PRADO, ResultBadge, Scoreline, TeamCrest } from "./Placar";

function Time({ nome, escudoUrl, sigla }: { nome: string; escudoUrl?: string | null; sigla?: string | null }) {
  return (
    <div className="flex w-24 flex-col items-center gap-2 text-center">
      <TeamCrest nome={nome} escudoUrl={escudoUrl} sigla={sigla} tamanho={56} />
      <span className="titulo text-[15px] leading-[1.1]">{nome}</span>
    </div>
  );
}

export function ResultCard({ jogo, className = "" }: { jogo: Jogo; className?: string }) {
  const gp = jogo.gols_prado ?? 0;
  const ga = jogo.gols_adversario ?? 0;
  const autores = autoresDosGols(jogo);
  return (
    <article className={`flex flex-col gap-4.5 rounded-2xl border border-roxo bg-noite-profunda p-5 ${className}`}>
      <header className="flex items-center justify-between gap-3">
        <p className="rotulo text-texto-2">{rotuloCompeticao(jogo)}</p>
        <ResultBadge resultado={resultado(gp, ga)} />
      </header>
      <h3 className="sr-only">Prado FC contra {jogo.adversario.nome}</h3>
      <div className="flex items-center justify-between">
        <Time {...PRADO} />
        <Scoreline golsPrado={gp} golsAdversario={ga} adversario={jogo.adversario.nome} />
        <Time nome={jogo.adversario.nome} escudoUrl={jogo.adversario.escudo_url} sigla={jogo.adversario.sigla} />
      </div>
      {autores && (
        <>
          <hr className="border-roxo" />
          <p className="flex gap-2.5 text-sm font-semibold">
            <span className="rotulo pt-0.5 text-turquesa">Gols</span>
            {autores}
          </p>
        </>
      )}
      <p className="text-xs text-texto-3">
        <time dateTime={jogo.data_hora}>{formatarDataHora(jogo.data_hora)}</time> · {jogo.local}
      </p>
    </article>
  );
}
