"use client";

import { useEffect, useState } from "react";

function partes(alvo: number, agora: number) {
  const min = Math.max(0, Math.floor((alvo - agora) / 60000));
  return { dias: Math.floor(min / 1440), horas: Math.floor((min % 1440) / 60), minutos: min % 60, acabou: alvo <= agora };
}

const dois = (n: number) => String(n).padStart(2, "0");

/** Contagem regressiva até o apito inicial (dias, horas, minutos). */
export function Countdown({ dataHora }: { dataHora: string }) {
  const alvo = new Date(dataHora).getTime();
  // null no primeiro render para o HTML do servidor e do cliente baterem
  const [agora, setAgora] = useState<number | null>(null);

  useEffect(() => {
    setAgora(Date.now());
    const id = setInterval(() => setAgora(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  const p = agora === null ? null : partes(alvo, agora);
  if (p?.acabou) return <p className="rotulo text-turquesa-claro">A bola já está rolando</p>;

  const blocos = [
    { valor: p?.dias, rotulo: "Dias" },
    { valor: p?.horas, rotulo: "Horas" },
    { valor: p?.minutos, rotulo: "Min" },
  ];
  return (
    <div role="timer" aria-label={p ? `Faltam ${p.dias} dias, ${p.horas} horas e ${p.minutos} minutos` : "Contagem regressiva"} className="flex items-start gap-1.5">
      {blocos.map((b, i) => (
        <div key={b.rotulo} className="flex items-start gap-1.5">
          {i > 0 && <span aria-hidden className="titulo text-[2rem] leading-[52px] text-turquesa">:</span>}
          <div aria-hidden className="flex w-[76px] flex-col items-center gap-1 rounded-lg bg-noite px-2 pt-3 pb-2.5">
            <span className="titulo text-[2.5rem] tabular-nums">{b.valor === undefined ? "--" : dois(b.valor)}</span>
            <span className="rotulo text-texto-2">{b.rotulo}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
