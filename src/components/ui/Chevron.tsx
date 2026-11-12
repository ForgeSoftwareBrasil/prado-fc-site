// As duas divisas em V do escudo. Sempre decorativas.

export function ChevronMark({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 28 24" className={`h-5 w-6 shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth={4}>
      <path d="M2 12 14 3l12 9M2 21l12-9 12 9" className="text-turquesa" />
    </svg>
  );
}

/** Separador entre seções: duas divisas roxas de ponta a ponta. */
export function ChevronDivider({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 1440 140" preserveAspectRatio="none" className={`block h-16 w-full md:h-28 ${className}`} fill="none">
      <path d="M0 92 720 20l720 72M0 132l720-72 720 72" stroke="var(--color-roxo)" strokeWidth={14} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** Divisas grandes de fundo (textura). Posicione com className. */
export function DivisasFundo({ className = "", cor = "var(--color-roxo)" }: { className?: string; cor?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 720 470" className={`pointer-events-none absolute ${className}`} fill="none">
      <path d="M0 360 360 120l360 240M0 450l360-240 360 240" stroke={cor} strokeWidth={40} />
    </svg>
  );
}
