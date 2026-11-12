import Link from "next/link";
import type { ReactNode } from "react";

const BASE =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-7 py-4 text-center text-sm font-extrabold uppercase tracking-[0.06em] transition-colors duration-200";
const VARIANTES = {
  primario: "bg-turquesa text-noite hover:bg-turquesa-claro",
  secundario: "border-2 border-turquesa text-branco hover:border-turquesa-claro hover:bg-turquesa/10 hover:text-turquesa-claro",
};

type Props = {
  href: string;
  children: ReactNode;
  variante?: keyof typeof VARIANTES;
  /** Abre em nova aba (links externos, como o WhatsApp). */
  externo?: boolean;
  className?: string;
};

export function Button({ href, children, variante = "primario", externo, className = "" }: Props) {
  const cls = `${BASE} ${VARIANTES[variante]} ${className}`;
  if (externo) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
        <span className="sr-only"> (abre em nova aba)</span>
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
