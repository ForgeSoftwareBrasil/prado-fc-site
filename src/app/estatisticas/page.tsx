import type { Metadata } from "next";
import { PerformanceChart, type PontoGrafico } from "@/components/stats/PerformanceChart";
import { StatTile, TopScorersTable } from "@/components/stats/StatsBlocks";
import { StatsFilters } from "@/components/stats/StatsFilters";
import { PageHead, SectionTitle } from "@/components/ui/SectionTitle";
import { getEstatisticas, getTemporadas } from "@/lib/data/estatisticas";
import { getCompeticoes } from "@/lib/data/jogos";
import { formatarDiaMes, formatarDataHora } from "@/lib/format";
import { resultado } from "@/lib/stats";

export const revalidate = 300;
export const metadata: Metadata = { title: "Estatísticas", description: "Números do Prado FC: resultados, gols, aproveitamento e artilharia." };

const Vazio = ({ children }: { children: React.ReactNode }) => (
  <p className="rounded-2xl border border-dashed border-roxo px-5 py-8 text-center text-texto-2">{children}</p>
);

type Busca = Promise<{ temporada?: string; competicao?: string }>;

export default async function EstatisticasPage({ searchParams }: { searchParams: Busca }) {
  const busca = await searchParams;
  const [temporadas, competicoes] = await Promise.all([getTemporadas(), getCompeticoes()]);
  const pedida = Number(busca.temporada);
  // Padrão: a temporada mais recente cadastrada
  const temporada = temporadas.includes(pedida) ? pedida : (temporadas[0] ?? new Date().getFullYear());
  const competicao = competicoes.find((c) => c.id === busca.competicao && c.temporada === temporada);
  const e = await getEstatisticas({ temporada, competicaoId: competicao?.id });

  const pontos: PontoGrafico[] = e.porJogo.map((j) => ({
    id: j.id,
    sigla: j.adversario.sigla ?? j.adversario.nome,
    data: formatarDiaMes(j.data_hora),
    marcados: j.gols_prado ?? 0,
    sofridos: j.gols_adversario ?? 0,
    resultado: resultado(j.gols_prado ?? 0, j.gols_adversario ?? 0),
    adversario: j.adversario.nome,
    competicao: j.competicao.nome,
    dataCompleta: formatarDataHora(j.data_hora).split(" · ")[0],
  }));
  const mv = e.maiorVitoria;

  return (
    <>
      <PageHead titulo="Estatísticas" chapeu="Em números" />
      <div className="mx-auto max-w-[1440px] px-4 pt-4 pb-2 md:px-20 md:pt-6">
        <StatsFilters temporadas={temporadas.length ? temporadas : [temporada]} competicoes={competicoes} temporada={temporada} competicaoId={competicao?.id} />
      </div>

      {e.jogos === 0 ? (
        <div className="mx-auto max-w-[1440px] px-4 py-12 md:px-20">
          <Vazio>Nenhum jogo encerrado nesse filtro ainda.</Vazio>
        </div>
      ) : (
        <>
          <section aria-labelledby="numeros" className="mx-auto flex max-w-[1440px] flex-col gap-4 px-4 pt-8 pb-10 md:gap-6 md:px-20 md:pt-12 md:pb-18">
            <SectionTitle id="numeros" titulo="Números do time" />
            <dl className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6">
              <StatTile destaque className="col-span-2 md:col-span-1" valor={`${e.aproveitamento}%`} rotulo={`Aproveitamento · ${e.pontos} de ${e.jogos * 3} pontos`} />
              <StatTile valor={String(e.jogos)} rotulo="Jogos" />
              <StatTile valor={String(e.vitorias)} rotulo="Vitórias" />
              <StatTile valor={String(e.empates)} rotulo="Empates" />
              <StatTile valor={String(e.derrotas)} rotulo="Derrotas" />
              <StatTile valor={String(e.golsMarcados)} rotulo="Gols marcados" />
              <StatTile valor={String(e.golsSofridos)} rotulo="Gols sofridos" />
              <StatTile valor={e.saldo > 0 ? `+${e.saldo}` : String(e.saldo)} rotulo="Saldo de gols" />
              <StatTile
                valor={mv ? `${mv.gols_prado} × ${mv.gols_adversario}` : "–"}
                rotulo={mv ? `Maior vitória · ${mv.adversario.sigla ?? mv.adversario.nome}` : "Maior vitória"}
              />
            </dl>
          </section>

          <section aria-labelledby="desempenho" className="bg-noite-profunda">
            <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-4 pt-10 pb-10 md:gap-6 md:px-20 md:pt-16 md:pb-12">
              <SectionTitle id="desempenho" titulo="Desempenho" />
              <PerformanceChart pontos={pontos} />
              <p className="text-xs text-texto-3 md:hidden">Arraste para o lado para ver todos os jogos →</p>
            </div>
            <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-4 pt-6 pb-14 md:gap-6 md:px-20 md:pb-22">
              <SectionTitle titulo="Artilharia" />
              {e.artilharia.length ? <TopScorersTable artilharia={e.artilharia} golsContra={e.golsContra} /> : <Vazio>Nenhum gol registrado nesse filtro.</Vazio>}
            </div>
          </section>
        </>
      )}
    </>
  );
}
