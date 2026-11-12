import { supabase } from "@/lib/supabase";

// Chamada pelo cron da Vercel (vercel.json) uma vez por dia, para o Supabase gratuito não pausar.
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const segredo = process.env.CRON_SECRET;
  if (!segredo || request.headers.get("authorization") !== `Bearer ${segredo}`) {
    return new Response("Não autorizado", { status: 401 });
  }
  const { error } = await supabase().from("competicoes").select("id").limit(1);
  if (error) {
    console.error("[keep-alive]", error);
    return new Response("Erro ao consultar o banco", { status: 500 });
  }
  return new Response("ok", { status: 200 });
}
