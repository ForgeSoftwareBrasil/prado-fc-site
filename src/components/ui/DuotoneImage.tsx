import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
};

/**
 * Foto em preto e branco com sobreposição roxa, para unificar fotos de celular (seção 9.3).
 * O className precisa dar posição (relative ou absolute) e tamanho.
 */
export function DuotoneImage({ src, alt, sizes, className = "relative", priority }: Props) {
  return (
    <div className={`overflow-hidden bg-roxo ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover grayscale contrast-110" />
      <div aria-hidden className="absolute inset-0 bg-roxo opacity-60 mix-blend-multiply" />
    </div>
  );
}
