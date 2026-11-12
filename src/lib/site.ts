// Configurações do site vindas do ambiente (seção 4).

export const MASCOTE_ATIVA = process.env.NEXT_PUBLIC_MASCOTE_ATIVA === "true";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const INSTAGRAM_URL = "https://instagram.com/pradofcbh";

const MENSAGEM_WHATSAPP = "Olá! Vi o site do Prado FC e quero jogar com vocês.";
export const WHATSAPP_URL = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ""}?text=${encodeURIComponent(MENSAGEM_WHATSAPP)}`;

export const NAV = [
  { href: "/", texto: "Home" },
  { href: "/jogos", texto: "Jogos" },
  { href: "/estatisticas", texto: "Estatísticas" },
  { href: "/elenco", texto: "Elenco" },
  { href: "/noticias", texto: "Notícias" },
] as const;
