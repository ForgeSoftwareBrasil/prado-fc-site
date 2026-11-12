import { DuotoneImage } from "@/components/ui/DuotoneImage";
import type { Artilheiro } from "@/lib/stats";

export function StatTile({ valor, rotulo, destaque, className = "" }: { valor: string; rotulo: string; destaque?: boolean; className?: string }) {
  return (
    <div className={`flex flex-col gap-1.5 rounded-xl p-4.5 md:p-6 ${destaque ? "bg-roxo" : "border border-roxo bg-noite-profunda"} ${className}`}>
      <dt className="rotulo order-2 text-texto-2">{rotulo}</dt>
      <dd className={`titulo order-1 text-5xl md:text-[56px] ${destaque ? "text-turquesa" : ""}`}>{valor}</dd>
    </div>
  );
}

export function TopScorersTable({ artilharia, golsContra }: { artilharia: Artilheiro[]; golsContra: number }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-roxo bg-noite-profunda md:max-w-180">
      <table className="w-full">
        <caption className="sr-only">Artilharia do Prado</caption>
        <thead className="bg-roxo">
          <tr className="rotulo text-left text-texto-2">
            <th scope="col" className="w-12 py-3.5 pl-5">#</th>
            <th scope="col" className="py-3.5">Jogador</th>
            <th scope="col" className="py-3.5 pr-5 text-right">Gols</th>
          </tr>
        </thead>
        <tbody>
          {artilharia.map((a) => (
            <tr key={a.jogador.id} className="border-b border-roxo/60">
              <td className="titulo py-3 pl-5 text-[22px] text-turquesa">{a.posicao}</td>
              <th scope="row" className="py-3 text-left font-medium">
                <span className="flex items-center gap-3">
                  {a.jogador.foto_url ? (
                    <DuotoneImage src={a.jogador.foto_url} alt="" sizes="40px" className="relative size-10 shrink-0 rounded-full" />
                  ) : (
                    <span aria-hidden className="titulo flex size-10 shrink-0 items-center justify-center rounded-full bg-roxo text-base">
                      {a.jogador.numero ?? "–"}
                    </span>
                  )}
                  <span className="flex flex-col">
                    <span className="text-lg font-extrabold">{a.jogador.apelido ?? a.jogador.nome}</span>
                    {a.jogador.numero !== null && <span className="text-xs text-texto-3">Camisa {a.jogador.numero}</span>}
                  </span>
                </span>
              </th>
              <td className="titulo py-3 pr-5 text-right text-[28px]">{a.gols}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {golsContra > 0 && <p className="px-5 pt-3.5 pb-4 text-sm text-texto-3">Gols contra a favor: {golsContra}</p>}
    </div>
  );
}
