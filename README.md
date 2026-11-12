# Site do Prado FC

Site oficial do Prado FC: jogos, estatísticas, elenco e notícias. Feito em Next.js, com os dados no Supabase e hospedagem na Vercel.

- Especificação completa: `PRADO_FC_SITE.md`
- Decisões de design: `DECISOES_DESIGN.md` · telas aprovadas: `Prado FC — Site.figcraft` (abrir no FigCraft)

---

## Como alimentar o site (dia a dia)

Tudo é feito no painel do Supabase (supabase.com → seu projeto). O site atualiza sozinho em até 5 minutos.

### Cadastrar um jogo

1. **Table Editor** → tabela `jogos` → **Insert row**.
2. Preencha: data e hora (`data_hora`), local, competição (`competicao_id`), adversário (`adversario_id`) e rodada (ex.: `Rodada 2`; deixe vazio em amistosos).
   - Se o adversário for novo, cadastre antes na tabela `adversarios` (nome e sigla, ex.: `TFC`).
3. Status: `agendado`.

> Dica: no campo de data, use o horário de Brasília com o fuso, ex.: `2026-11-18 22:00:00-03`.

### Registrar um resultado

1. Abra o jogo em `jogos`, preencha `gols_prado` e `gols_adversario` e mude o status para `encerrado`.
2. Na tabela `gols`, crie **uma linha por gol do Prado**: escolha o jogo (`jogo_id`) e o jogador (`jogador_id`).
   - Gol contra do adversário (a favor do Prado): marque `gol_contra` e deixe o jogador vazio.
3. O site atualiza sozinho em até 5 minutos.

> O número de linhas em `gols` precisa ser igual a `gols_prado`. Se não for, o placar aparece normal, mas a artilharia fica incompleta.

### Publicar uma notícia

1. **Storage** → bucket `noticias` → envie a capa e copie o endereço público (**Get URL**).
2. **Table Editor** → `noticias` → **Insert row**: título, slug (endereço da notícia, sem espaços nem acentos, ex.: `estreia-na-champions`), resumo, conteúdo em Markdown e a capa (`capa_url`).
3. Marque `publicado`. Para publicar na hora, deixe `publicado_em` vazio (o banco preenche com a hora atual). Para agendar, preencha `publicado_em` no formato `2026-11-18 10:00:00-03`; a notícia aparece a partir desse horário.

No conteúdo, dá para usar **negrito** (`**texto**`), títulos (`## Título`), listas (`- item`), links (`[texto](https://...)`) e imagens (`![descrição](https://...)`).

### Adicionar escudo de adversário ou foto de jogador

1. Suba a imagem no bucket correspondente (`escudos` ou `jogadores`) e copie o endereço público.
2. Cole no campo `escudo_url` (adversário) ou `foto_url` (jogador).

As fotos de jogador ganham o tratamento roxo (duotone) automaticamente.

### Ativar a mascote

1. Vercel → projeto → **Settings → Environment Variables** → mude `NEXT_PUBLIC_MASCOTE_ATIVA` para `true`.
2. **Deployments** → no último deploy, **⋯ → Redeploy**.

---

## Primeira instalação (uma vez só)

### 1. Supabase

1. Crie um projeto gratuito em [supabase.com](https://supabase.com).
2. **SQL Editor** → cole e rode `supabase/schema.sql` (cria as tabelas e as regras de leitura pública).
3. **Storage** → crie 5 buckets **públicos**: `escudos`, `jogadores`, `noticias`, `patrocinadores`, `competicoes`.
4. Envie os arquivos da pasta `supabase-storage/` para os buckets de mesmo nome.
5. Abra `supabase/seed.sql`, troque `SEU-PROJETO` pelo código do projeto (o pedaço do endereço antes de `.supabase.co`) e rode no **SQL Editor**. A última linha deve mostrar `24`.
6. Em **Project Settings → API**, copie a **Project URL** e a **anon public key**.

### 2. Rodar no computador (opcional)

Precisa do Node.js 20 ou mais novo.

```bash
npm install
```

Preencha o arquivo `.env.local` (modelo em `.env.example`) e rode:

```bash
npm run dev
```

O site abre em http://localhost:3000.

### 3. Publicar na Vercel

1. Suba esta pasta para um repositório no GitHub (o `.env.local` fica de fora automaticamente).
2. Em [vercel.com](https://vercel.com), **Add New → Project** e importe o repositório.
3. Em **Environment Variables**, cadastre:

| Variável | Valor |
| --- | --- |
| `SUPABASE_URL` | Project URL do Supabase |
| `SUPABASE_ANON_KEY` | anon public key do Supabase |
| `CRON_SECRET` | um texto aleatório longo (é a senha do keep-alive) |
| `NEXT_PUBLIC_SITE_URL` | o endereço do site, ex.: `https://prado-fc.vercel.app` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `5531996103374` |
| `NEXT_PUBLIC_MASCOTE_ATIVA` | `false` (até o dia da revelação) |

4. **Deploy**.

O `vercel.json` já agenda uma visita diária ao endereço `/api/keep-alive` (9h UTC), para o Supabase gratuito não pausar o projeto por falta de acesso.

---

## Para quem for mexer no código

- Next.js (App Router) + TypeScript strict + Tailwind CSS 4. Tokens de cor e fontes em `src/app/globals.css`.
- Toda consulta ao banco fica em `src/lib/data/*.ts`. Se o Supabase falhar, as páginas mostram o estado vazio em vez de quebrar e o erro vai para o log.
- O cálculo das estatísticas e o agrupamento do elenco ficam em `src/lib/stats.ts` e `src/lib/elenco.ts`, com testes que conferem os números do seed: `npm test`.
- `src/types/database.ts` foi escrito à mão a partir do schema. Com o projeto criado, dá para regenerar:
  `npx supabase gen types typescript --project-id <projeto> > src/types/database.ts`
- O escudo, a logo da Forge e as imagens da mascote ficam em `public/`. Quando chegar o SVG do escudo, troque em `public/brand/`.
