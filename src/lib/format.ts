// Datas sempre no fuso de São Paulo, formato brasileiro.
const TZ = "America/Sao_Paulo";

const fmt = (opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("pt-BR", { timeZone: TZ, ...opts });
const diaSemana = fmt({ weekday: "short" });
const diaMes = fmt({ day: "2-digit", month: "2-digit" });
const dataCompleta = fmt({ day: "2-digit", month: "2-digit", year: "numeric" });
const hora = fmt({ hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
const dataExtenso = fmt({ day: "numeric", month: "short", year: "numeric" });

const semPonto = (s: string) => s.replace(".", "");
const capitalizar = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** "QUA · 18/11" */
export const seloData = (iso: string) => `${semPonto(diaSemana.format(new Date(iso))).toUpperCase()} · ${diaMes.format(new Date(iso))}`;
/** "22:00" */
export const formatarHora = (iso: string) => hora.format(new Date(iso));
/** "15/10" */
export const formatarDiaMes = (iso: string) => diaMes.format(new Date(iso));
/** "Qua, 11/11/2026 · 22:00" */
export const formatarDataHora = (iso: string) =>
  `${capitalizar(semPonto(diaSemana.format(new Date(iso))))}, ${dataCompleta.format(new Date(iso))} · ${formatarHora(iso)}`;
/** "12 de nov. de 2026" → "12 nov 2026" */
export const formatarDataNoticia = (iso: string) => dataExtenso.format(new Date(iso)).replace(/ de /g, " ").replace(".", "");
