# Site do Prado FC — especificação completa

> Documento de contexto para o Claude construir o site oficial do Prado FC.
> Leia **tudo** antes de começar. As decisões aqui já foram discutidas e aprovadas pelo Arthur (dono do projeto). Quando algo não estiver especificado, pergunte antes de inventar.

---

## 0. Como usar este documento

O trabalho acontece em duas fases, nesta ordem:

1. **Fase de design (Figma, via figcraft).** Desenhe todas as telas e componentes descritos nas seções 9 e 10, usando os tokens da identidade visual. **Pare e peça aprovação do Arthur** antes de escrever qualquer código.
2. **Fase de código.** Implemente o site a partir das telas aprovadas, seguindo a stack e a arquitetura das seções 3 a 8.

Sobre a skill **styles.refero.design**: use-a como referência de **qualidade, composição, espaçamento e padrões de interface**. Em caso de conflito, **as cores, fontes, componentes e regras do Prado FC (seção 9) sempre têm prioridade** sobre qualquer estilo sugerido pela skill. O site precisa parecer o Prado, não um template genérico.

Arquivos que acompanham este documento (pasta do kit):

```
PRADO_FC_SITE.md                ← este documento
public/brand/escudo-prado.png   ← escudo oficial com fundo transparente
public/brand/forge-logo-branca.png
public/mascote/harpia.webp      ← mascote (imagem principal)
public/mascote/harpia-olhos-teaser.webp
public/fotos/elenco-amistoso-pb-roxo.webp
supabase-storage/escudos/pipoca-doce.png
supabase-storage/patrocinadores/{assados-du-chef,forge-software,ponto-de-prosa}.png
supabase-storage/competicoes/champions-liga-mineira.png
referencias/uniformes/*.webp    ← fotos dos 4 uniformes oficiais (referência visual)
```

A pasta `public/` vai direto para o `public/` do projeto Next. A pasta `supabase-storage/` deve ser enviada para os buckets do Supabase (seção 6).

---

## 1. Contexto do clube

- **Prado FC**: time de futebol amador do bairro Prado, em Belo Horizonte (MG), fundado em 2026.
- Joga **society (F7)** e **futsal**.
- Instagram: **@pradofcbh**.
- Lema: **"Foco, garra e amizade"**.
- Primeira competição oficial: **Champions League da Liga Mineira (F7 BH)**, na **Arena Caiçara**. 10 times em 2 grupos de 5; cada time enfrenta os 5 do outro grupo; os 8 melhores da classificação geral avançam. Primeiro critério de desempate: saldo de gols.
- Patrocinadores: **Assados Du Chef** (@assadosduchef\_), **Forge Software** (@forgesoftwarebr), **Ponto de Prosa Espetinho** (@pontodeprosa).
- Fornecedor de uniformes: **MS Esportes** (@msesportesbh).
- Mascote: uma **harpia** (a maior águia do Brasil), ainda **sem nome**.
- O site é desenvolvido pela **Forge Software**, sem custo para o clube.

Referência de estrutura: o site do **Cavalry FC** (Canadian Premier League), em especial a página de estatísticas: https://www.cplsoccer.com/cavalryfc/statistics/index

---

## 2. Escopo

### Primeira versão (MVP)

| Página       | Rota               | Conteúdo                                                                                                                                                                 |
| ------------ | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Home         | `/`                | Destaque com a mascote e o próximo jogo (contagem regressiva), último resultado, próximos jogos, notícias recentes, faixa de patrocinadores, chamada "Jogue com a gente" |
| Jogos        | `/jogos`           | Próximos jogos e resultados anteriores                                                                                                                                   |
| Estatísticas | `/estatisticas`    | Números do time, gráfico de desempenho jogo a jogo, artilharia; filtro por temporada e competição                                                                        |
| Elenco       | `/elenco`          | Grade de cards dos jogadores                                                                                                                                             |
| Notícias     | `/noticias`        | Lista de notícias                                                                                                                                                        |
| Notícia      | `/noticias/[slug]` | Página da notícia (Markdown)                                                                                                                                             |
| Erro 404     | —                  | Página personalizada (pode usar a harpia)                                                                                                                                |

Rodapé em todas as páginas: patrocinadores, Instagram do clube e "Powered by Forge Software".

### Fora do escopo (não implementar)

- Feed do Instagram (a API da Meta é instável e trabalhosa).
- Página individual de jogador.
- Assistências, cartões e outras estatísticas além de gols.
- Área administrativa própria com login (o painel do Supabase cumpre esse papel na v1).
- Modo claro.
- Loja.

### Fase 2 (já prevista, não implementar agora)

- Área administrativa própria (login com Supabase Auth) para outras pessoas da gestão atualizarem o site sem usar o painel do Supabase.
- Página individual de jogador.
- Domínio próprio `.com.br` (o Arthur configura na Vercel).

---

## 3. Stack e decisões técnicas

| Item           | Decisão                                                                                                        | Motivo                                                |
| -------------- | -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Framework      | **Next.js** (versão estável mais recente, **App Router**) com **TypeScript em modo strict**                    | Front e back no mesmo repositório                     |
| Estilo         | **Tailwind CSS** com os tokens da seção 9 configurados no tema                                                 | Consistência com o design                             |
| Dados          | **Supabase** (Postgres + Storage), plano gratuito                                                              | Dados relacionais, imagens e painel de edição prontos |
| Busca de dados | **Server Components** consultando o Supabase direto no servidor, com **ISR** (`export const revalidate = 300`) | Menos código; sem rotas de API para exibir dados      |
| Rotas de API   | **Somente quando houver motivo concreto.** Na v1, apenas `/api/keep-alive` (seção 4)                           | Simplicidade                                          |
| Gráficos       | **Recharts** (componente cliente)                                                                              | Leve e suficiente                                     |
| Markdown       | `react-markdown` + `remark-gfm`                                                                                | Notícias                                              |
| Imagens        | `next/image`, com o domínio do Supabase Storage em `remotePatterns`                                            | Performance                                           |
| Hospedagem     | **Vercel, plano Hobby**, em conta do Prado                                                                     | Gratuito; o site não terá cobrança                    |
| Domínio        | Endereço `*.vercel.app` por enquanto                                                                           | O Arthur configura o `.com.br` depois                 |
| Fuso horário   | Todas as datas exibidas em `America/Sao_Paulo`, formato brasileiro                                             | Público local                                         |
| Idioma         | Português do Brasil (`lang="pt-BR"`)                                                                           | —                                                     |

Regras gerais de código:

- Toda consulta ao Supabase fica em `src/lib/data/*.ts`, com funções tipadas (ex.: `getProximosJogos()`, `getEstatisticas({ temporada, competicaoId })`). Páginas não chamam o Supabase diretamente.
- Gere os tipos do banco com `supabase gen types typescript` em `src/types/database.ts`.
- O cliente Supabase usa a **anon key** apenas para leitura (as políticas de RLS da seção 5 garantem que só é possível ler).
- Nada de dados de exemplo fixos no código: tudo vem do banco. Estados vazios precisam ser tratados (ex.: "Nenhum jogo agendado").

---

## 4. Hospedagem, variáveis de ambiente e manutenção

### Variáveis de ambiente (Vercel e `.env.local`)

```bash
SUPABASE_URL=https://<projeto>.supabase.co
SUPABASE_ANON_KEY=<anon key>
CRON_SECRET=<string aleatória longa>
NEXT_PUBLIC_SITE_URL=https://<projeto>.vercel.app
NEXT_PUBLIC_WHATSAPP_NUMBER=5531996103374
NEXT_PUBLIC_MASCOTE_ATIVA=false
```

Crie também um `.env.example` com as mesmas chaves e valores vazios. Nunca commite `.env.local`.

### Keep-alive do Supabase

Projetos do Supabase no plano gratuito são pausados depois de cerca de uma semana sem acesso. Como um site de time amador pode passar dias sem visita:

- Crie a rota `src/app/api/keep-alive/route.ts` (GET), que faz uma consulta simples (ex.: `select id from competicoes limit 1`) e responde `200`.
- A rota só executa se o cabeçalho `Authorization` for `Bearer ${CRON_SECRET}`; caso contrário, responde `401`.
- Configure em `vercel.json`:

```json
{
  "crons": [{ "path": "/api/keep-alive", "schedule": "0 9 * * *" }]
}
```

(O plano Hobby permite cron diário, o que é suficiente.)

### Mascote liga/desliga

A seção da mascote só aparece quando `NEXT_PUBLIC_MASCOTE_ATIVA=true`. O Arthur vai ativar na Vercel no dia da revelação no Instagram. Com a variável em `false`, a home usa um destaque alternativo (seção 7.1).

---

## 5. Banco de dados (Supabase)

Rode este SQL no editor do Supabase. Ele cria as tabelas, as regras de consistência e as políticas de leitura pública.

```sql
-- Extensão para UUID
create extension if not exists "pgcrypto";

-- Competições (ex.: "Champions League da Liga Mineira", "Amistoso")
create table competicoes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  temporada int not null,
  logo_url text,
  created_at timestamptz not null default now()
);

-- Adversários
create table adversarios (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  sigla text,               -- usada quando não há escudo (ex.: "PD")
  escudo_url text,
  instagram text,           -- sem @
  created_at timestamptz not null default now()
);

create type status_jogo as enum ('agendado', 'encerrado', 'adiado', 'cancelado');

-- Jogos
create table jogos (
  id uuid primary key default gen_random_uuid(),
  data_hora timestamptz not null,
  local text not null,
  competicao_id uuid not null references competicoes(id),
  adversario_id uuid not null references adversarios(id),
  rodada text,              -- ex.: "Rodada 1"; nulo em amistosos
  gols_prado int check (gols_prado >= 0),
  gols_adversario int check (gols_adversario >= 0),
  status status_jogo not null default 'agendado',
  created_at timestamptz not null default now(),
  constraint placar_obrigatorio_se_encerrado check (
    status <> 'encerrado' or (gols_prado is not null and gols_adversario is not null)
  )
);

-- Jogadores
create table jogadores (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  apelido text,             -- como o jogador é conhecido no time
  nome_camisa text,
  numero int,
  posicao text,             -- ex.: "Goleiro", "Fixo", "Ala", "Pivô", "Meio-campo", "Atacante"
  pe text check (pe in ('Direito', 'Esquerdo', 'Ambidestro')),
  foto_url text,
  ativo boolean not null default true,
  ordem int,
  created_at timestamptz not null default now()
);

-- Gols do Prado (só os gols a favor do Prado são registrados aqui)
-- gol_contra = true  -> gol contra marcado por um adversário, a favor do Prado (jogador_id nulo)
-- gol_contra = false -> gol de um jogador do Prado (jogador_id obrigatório)
create table gols (
  id uuid primary key default gen_random_uuid(),
  jogo_id uuid not null references jogos(id) on delete cascade,
  jogador_id uuid references jogadores(id),
  gol_contra boolean not null default false,
  minuto int,
  created_at timestamptz not null default now(),
  constraint autor_coerente check (
    (gol_contra and jogador_id is null) or (not gol_contra and jogador_id is not null)
  )
);

-- Notícias
create table noticias (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  slug text not null unique,
  resumo text,
  conteudo_md text not null,
  capa_url text,
  publicado boolean not null default false,
  publicado_em timestamptz,
  created_at timestamptz not null default now()
);

-- Patrocinadores
create table patrocinadores (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  logo_url text not null,
  instagram text,
  site_url text,
  ordem int,
  ativo boolean not null default true
);

-- Leitura pública, escrita só pelo painel (service role ignora RLS)
alter table competicoes   enable row level security;
alter table adversarios   enable row level security;
alter table jogos         enable row level security;
alter table jogadores     enable row level security;
alter table gols          enable row level security;
alter table noticias      enable row level security;
alter table patrocinadores enable row level security;

create policy "leitura publica" on competicoes    for select using (true);
create policy "leitura publica" on adversarios    for select using (true);
create policy "leitura publica" on jogos          for select using (true);
create policy "leitura publica" on jogadores      for select using (true);
create policy "leitura publica" on gols           for select using (true);
create policy "leitura publica" on patrocinadores for select using (ativo);
create policy "leitura publica" on noticias       for select
  using (publicado and publicado_em is not null and publicado_em <= now());
```

### Regra de consistência no código

Para cada jogo encerrado, a quantidade de linhas em `gols` deve ser igual a `gols_prado`. Se não for, o site **exibe o placar normalmente**, mas registra um aviso no console do servidor (`console.warn`) identificando o jogo. Não quebrar a página.

---

## 6. Storage (imagens)

Crie estes buckets **públicos** no Supabase Storage:

| Bucket           | Conteúdo                     |
| ---------------- | ---------------------------- |
| `escudos`        | Escudos dos adversários      |
| `jogadores`      | Fotos dos jogadores          |
| `noticias`       | Capas e imagens das notícias |
| `patrocinadores` | Logos dos patrocinadores     |
| `competicoes`    | Logos das competições        |

Envie os arquivos da pasta `supabase-storage/` do kit para os buckets correspondentes. Nas tabelas, os campos `*_url` guardam o endereço público do arquivo.

O escudo do Prado, a logo da Forge e as imagens da mascote ficam em `public/` (são fixos, não dependem do banco).

---

## 7. Páginas em detalhe

### 7.1 Home (`/`)

Ordem das seções:

1. **Destaque (hero)**
   - Com `NEXT_PUBLIC_MASCOTE_ATIVA=true`: imagem da harpia (`/mascote/harpia.webp`) em destaque, com o card do **próximo jogo** sobreposto e uma **contagem regressiva** (dias, horas, minutos) até o apito inicial. Se não houver jogo agendado, mostrar o último resultado no lugar.
   - Com `false`: mesmo layout, usando o escudo do Prado grande sobre o fundo com divisas e a foto do elenco tratada (`/fotos/elenco-amistoso-pb-roxo.webp`).
   - A contagem regressiva é um componente cliente; o restante da seção é renderizado no servidor.
2. **Último resultado**: card de resultado (placar grande, escudos, competição, data, autores dos gols).
3. **Próximos jogos**: até 3 cards de jogo, com link para `/jogos`.
4. **Notícias recentes**: as 3 últimas publicadas, com link para `/noticias`.
5. **Faixa de patrocinadores**: logos em faixa roxa, cada um linkando para o Instagram ou site do patrocinador (abre em nova aba).
6. **"Jogue com a gente"**: chamada curta com botão que abre o WhatsApp (seção 7.7).

### 7.2 Jogos (`/jogos`)

- Duas abas ou seções: **Próximos** (status `agendado` ou `adiado`, ordem crescente de data) e **Resultados** (status `encerrado`, ordem decrescente).
- Filtro por competição (opcional, `?competicao=<id>` na URL).
- Cada card mostra: escudo do Prado × escudo do adversário (ou círculo com a `sigla` se não houver escudo), data e hora, local, competição e rodada. Nos resultados, o placar e um selo **V**, **E** ou **D**.
- Jogos `cancelado` não aparecem.

### 7.3 Estatísticas (`/estatisticas`)

Filtros: **temporada** (padrão: a atual) e **competição** (padrão: todas). Os filtros ficam na URL (`?temporada=2026&competicao=<id>`) para o link ser compartilhável.

Considerar apenas jogos `encerrado` dentro do filtro.

**Números do time** (cards):

- Jogos, vitórias, empates, derrotas
- Gols marcados, gols sofridos, saldo de gols
- Aproveitamento = pontos ÷ (jogos × 3), com vitória = 3 e empate = 1, em %
- Maior vitória (maior diferença de gols, com o placar)

**Gráfico de desempenho jogo a jogo** (referência: gráficos da página de estatísticas do Cavalry FC):

- Eixo X: os jogos em ordem cronológica (rótulo: sigla ou nome curto do adversário e data).
- Barras agrupadas por jogo: **gols marcados** (turquesa) e **gols sofridos** (roxo claro).
- Abaixo do gráfico, uma faixa com o resultado de cada jogo (selo V/E/D colorido).
- Tooltip com placar completo, adversário, competição e data.
- Responsivo; no celular, permitir rolagem horizontal se houver muitos jogos.

**Artilharia**:

- Tabela com posição, jogador (foto pequena, apelido e número) e gols.
- Conta apenas gols com `gol_contra = false`.
- Gols contra a favor do Prado aparecem numa linha separada no fim ("Gols contra a favor: N").

### 7.4 Elenco (`/elenco`)

- Grade de cards com os jogadores `ativo = true`, ordenados por `ordem` e depois por `numero`.
- Agrupamento por posição quando a posição estiver preenchida (Goleiros primeiro); jogadores sem posição em um grupo "Elenco".
- Card: foto (com tratamento duotone; sem foto, silhueta ou o escudo em marca-d'água), número grande em Anton, apelido em destaque e nome completo menor, posição e pé.
- Sem página individual na v1.

### 7.5 Notícias (`/noticias` e `/noticias/[slug]`)

- Lista: cards com capa, título, resumo e data, ordenados por `publicado_em` decrescente. Paginação simples se passar de 12.
- Página da notícia: capa grande, título, data, conteúdo em Markdown (títulos, negrito, listas, links, imagens) e um bloco "Mais notícias" com 3 outras.
- Gerar metadados (título, descrição e imagem Open Graph) a partir de cada notícia.
- `generateStaticParams` para as notícias publicadas, com ISR.

### 7.6 Rodapé (todas as páginas)

- Escudo do Prado, lema e link para o Instagram (@pradofcbh).
- Faixa de patrocinadores (mesma da home, versão compacta).
- **"Powered by Forge Software"**: logo branca da Forge (`/brand/forge-logo-branca.png`), pequena, com opacidade reduzida (por volta de 60%) e opacidade total no hover/foco. É um link para **https://forgesoftwarebrasil.vercel.app/** (abre em nova aba, `rel="noopener"`). Discreto: não deve competir com os patrocinadores.

### 7.7 "Jogue com a gente"

Botão que abre o WhatsApp com mensagem pronta:

```
https://wa.me/${NEXT_PUBLIC_WHATSAPP_NUMBER}?text=Olá! Vi o site do Prado FC e quero jogar com vocês.
```

(com o texto codificado via `encodeURIComponent`). Abre em nova aba.

### 7.8 Erro 404

Página no estilo do site, com mensagem bem-humorada (ex.: "Essa bola foi pra fora.") e botão para a home. Se a mascote estiver ativa, usar a imagem dos olhos da harpia (`/mascote/harpia-olhos-teaser.webp`).

---

## 8. Estrutura de pastas sugerida

```
src/
  app/
    layout.tsx
    page.tsx                  # home
    jogos/page.tsx
    estatisticas/page.tsx
    elenco/page.tsx
    noticias/page.tsx
    noticias/[slug]/page.tsx
    not-found.tsx
    api/keep-alive/route.ts
  components/
    layout/  (Header, Footer, SponsorStrip, PoweredByForge)
    jogos/   (MatchCard, ResultCard, Scoreline, ResultBadge, Countdown, TeamCrest)
    stats/   (StatTile, PerformanceChart, TopScorersTable, StatsFilters)
    elenco/  (PlayerCard)
    noticias/(NewsCard, MarkdownContent)
    ui/      (Button, SectionTitle, ChevronDivider, DuotoneImage)
  lib/
    supabase.ts
    data/    (jogos.ts, estatisticas.ts, elenco.ts, noticias.ts, patrocinadores.ts)
    format.ts                 # datas em pt-BR / America/Sao_Paulo
  types/
    database.ts
public/  (conteúdo da pasta public do kit)
vercel.json
```

---

## 9. Identidade visual

O site segue a mesma identidade do Instagram do clube. **Só modo escuro.**

### 9.1 Cores (tokens)

| Token            | Hex       | Uso                                                          |
| ---------------- | --------- | ------------------------------------------------------------ |
| `noite`          | `#1A1030` | Fundo principal                                              |
| `noite-profunda` | `#120A22` | Fundos de seções alternadas, rodapé                          |
| `roxo`           | `#4B2E83` | Blocos, cards, faixas, divisas de fundo                      |
| `turquesa`       | `#00B5B8` | Destaques, placares, botões, links, gols marcados no gráfico |
| `turquesa-claro` | `#5FE3E5` | Hover de links e botões                                      |
| `branco`         | `#FFFFFF` | Títulos e textos principais                                  |
| `texto-2`        | `#CFC6E6` | Textos secundários                                           |
| `texto-3`        | `#8E86A3` | Textos terciários, legendas                                  |
| `prata`          | `#A9AEB8` | Textos da seção da mascote                                   |
| `roxo-claro`     | `#9B7FD4` | Gols sofridos no gráfico                                     |

Regras:

- Texto sobre turquesa: sempre `noite`.
- O turquesa é a cor de destaque: não usar como fundo de grandes áreas.
- Selos de resultado: **V** turquesa, **E** `texto-3` (cinza), **D** `roxo-claro`. Não usar verde, amarelo ou vermelho.
- Verificar contraste mínimo AA em todos os textos.

### 9.2 Tipografia

| Uso                        | Fonte                                        | Observação                                                                                                                                                                                      |
| -------------------------- | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Títulos, placares, números | **Anton** (Google Fonts)                     | Sempre em caixa alta                                                                                                                                                                            |
| Texto, navegação, rótulos  | **Montserrat** 500, 600 e 800 (Google Fonts) | —                                                                                                                                                                                               |
| Seção da mascote           | **Cinzel** 600 (Google Fonts)                | Usar **somente** na seção da harpia; caixa alta e espaçamento aberto                                                                                                                            |
| Nome do clube em destaque  | **Imagem do escudo/logotipo**                | A fonte original do escudo (Bernard MT Condensed) é comercial e não pode ser usada como webfont sem licença. Onde "PRADO FC" aparecer em destaque, use o escudo como imagem; no restante, Anton |

Carregar as fontes com `next/font/google`.

### 9.3 Elementos de assinatura

- **Divisas em V**: as duas divisas do escudo, usadas como separadores entre seções e como textura de fundo em roxo sobre o Roxo Noite. Implementar como componente SVG (`ChevronDivider`), decorativo (`aria-hidden`).
- **Card de jogo**: inspirado na arte de "Dia de jogo" do Instagram. Escudos lado a lado com um "×" turquesa, data num selo turquesa (texto em `noite`), hora num selo branco, local e competição abaixo.
- **Placar**: números grandes em Anton, com o "×" em turquesa.
- **Faixa de patrocinadores**: fundo `roxo`, logos brancas.
- **Tratamento de fotos (duotone)**: fotos de jogadores e do time ficam em preto e branco com sobreposição roxa, para unificar fotos de celular. Implementação sugerida no componente `DuotoneImage`: imagem com `filter: grayscale(1) contrast(1.1)` e uma camada por cima com `background: #4B2E83` em `mix-blend-mode: multiply` com opacidade em torno de 0,6.
- **Textura sutil**: listras diagonais muito discretas no fundo (opacidade em torno de 3%), como nas artes do Instagram.

### 9.4 Tom e conteúdo

- Visual de clube grande; textos curtos e com a linguagem do bairro.
- Animações contidas: transições de 150 a 250 ms, entrada suave das seções. Nada de parallax pesado (a maioria das visitas vem do link da bio do Instagram, no celular).
- Mobile first: projetar primeiro para 390 px de largura.

### 9.5 Mascote

- Harpia realista com olhos turquesa, pousada no travessão de um gol (`/mascote/harpia.webp`).
- **Ainda não tem nome.** Não invente um nome. Use apenas "a harpia" se precisar de texto.
- Na seção da mascote, pode-se usar a frase da campanha de lançamento: **"ALGUÉM ESTÁ DE OLHO."** (Cinzel; "DE OLHO." em turquesa).

---

## 10. Fase de design no Figma (figcraft)

Antes de qualquer código, crie no Figma:

1. **Variáveis/estilos** com todos os tokens da seção 9 (cores e tipografia).
2. **Biblioteca de componentes**: Header (desktop e mobile com menu), Footer, PoweredByForge, SponsorStrip, MatchCard (próximo jogo), ResultCard, Scoreline, ResultBadge (V/E/D), Countdown, TeamCrest (com escudo e com sigla), StatTile, PerformanceChart, TopScorersTable, PlayerCard (com e sem foto), NewsCard, Button (primário e secundário), SectionTitle, ChevronDivider.
3. **Telas**, cada uma em **Desktop (1440 px)** e **Mobile (390 px)**:
   - Home com mascote ativa
   - Home com mascote desativada
   - Jogos
   - Estatísticas
   - Elenco
   - Notícias (lista)
   - Notícia (detalhe)
   - 404
4. Use dados reais da seção 11 nas telas (não use "Lorem ipsum").

**Ao terminar, pare e peça aprovação do Arthur.** Só passe para o código depois do aceite, e implemente fiel às telas aprovadas.

---

## 11. Dados iniciais (seed)

Cadastre estes dados reais. Itens marcados com **⚠️ confirmar** precisam de validação do Arthur antes de ir para o ar.

### Competições

| nome                             | temporada | logo                                     |
| -------------------------------- | --------- | ---------------------------------------- |
| Amistoso                         | 2026      | —                                        |
| Champions League da Liga Mineira | 2026      | `competicoes/champions-liga-mineira.png` |

### Adversários

| nome            | sigla | escudo                    |
| --------------- | ----- | ------------------------- |
| Pipoca Doce FC  | PD    | `escudos/pipoca-doce.png` |
| Tropa FC        | TFC   | —                         |
| Bayern de Speed | BDS   | —                         |

### Jogadores (da lista do pedido de uniformes)

| nome             | apelido   | nº  | posição  |
| ---------------- | --------- | --- | -------- |
| Arthur Ramos     | Ramos     | 1   | Goleiro  |
| Thiago           | Thiago    | 12  | Goleiro  |
| Daniel           | Daniel    | 7   | Ala/Pivô |
| Yan Diniz        | Yan       | 10  | Ala/Meia |
| Ygor             | Yguin     | 11  | Fixo     |
| Juarez           | Boi       | 9   | Fixo     |
| Felipe Medeiros  | Medeiros  | 5   | Meia     |
| Lucas Braga      | Braga     | 77  | Fixo     |
| Erick            | Erickin   | 15  | Ala/Meia |
| Igor             | Igor      | 16  | Fixo     |
| Iago Diniz       | Iago      | 19  | Fixo     |
| Eduardo          | Dudu      | 8   | Meia     |
| Michael          | Michael   | 30  | Pivô     |
| João Paulo       | João      | 13  | Pivô     |
| Felipe Trigueiro | Trigueiro | —   | Técnico  |

Posições, pé e fotos dos jogadores de linha: **⚠️ confirmar** com o Arthur (deixar nulos até lá).

### Jogos

| data e hora      | adversário      | competição                                  | local                  | placar | status    |
| ---------------- | --------------- | ------------------------------------------- | ---------------------- | ------ | --------- |
| 15/10/2026 22:00 | Pipoca Doce FC  | Amistoso                                    | Arena Morro das Pedras | 8 × 4  | encerrado |
| 20/10/2026 22:00 | Tropa FC        | Amistoso                                    | Arena Caiçara          | 3 × 3  | encerrado |
| 27/10/2026 22:00 | Bayern de Speed | Amistoso                                    | Arena Caiçara          | 10 × 1 | encerrado |
| 11/11/2026 22:00 | Tropa FC        | Champions League da Liga Mineira (Rodada 1) | Arena Caiçara          | 3 × 5  | encerrado |

### Gols

- **Prado 8 × 4 Pipoca Doce:** Yan 3, Juarez 2, Daniel 1, Michael 1, gol contra 1.
- **Prado 10 × 1 Bayern de Speed:** Ygor 3, Yan 2, Michael 2, Daniel 1, Juarez 1, Braga 1.

- **Prado 3 × 3 Tropa FC (amistoso):** Yan 1, Daniel 1, Michael 1.
- **Prado 3 × 5 Tropa FC (Champions, rodada 1):** Michael 2, Daniel 1.

Confirmado pelo Arthur: "Junim" e "Boi" nas legendas do Instagram são o mesmo jogador, **Juarez** (3 gols no total). A grafia oficial é **Michael**.

### Patrocinadores

| nome                     | logo                                 | instagram       | ordem |
| ------------------------ | ------------------------------------ | --------------- | ----- |
| Assados Du Chef          | `patrocinadores/assados-du-chef.png` | assadosduchef\_ | 1     |
| Forge Software           | `patrocinadores/forge-software.png`  | forgesoftwarebr | 2     |
| Ponto de Prosa Espetinho | `patrocinadores/ponto-de-prosa.png`  | pontodeprosa    | 3     |

Observação: as três logos são **brancas**; funcionam sobre fundo escuro (o site é todo escuro).

### Notícias

Criar 1 notícia publicada para validar o fluxo, por exemplo: **"Prado FC confirmado na Champions League da Liga Mineira"**, com resumo e texto curto sobre a participação, usando a logo da competição como capa.

---

## 12. Como o Arthur vai alimentar o site (incluir no README)

Escreva um `README.md` com este passo a passo, em linguagem simples:

**Cadastrar um jogo**

1. Supabase → Table Editor → `jogos` → Insert row.
2. Preencher data e hora, local, competição, adversário (se o adversário for novo, cadastrar antes em `adversarios`), rodada.
3. Status: `agendado`.

**Registrar um resultado**

1. Abrir o jogo em `jogos`, preencher `gols_prado` e `gols_adversario` e mudar o status para `encerrado`.
2. Em `gols`, criar uma linha por gol do Prado: o jogo, o jogador e, se for gol contra do adversário, marcar `gol_contra` e deixar o jogador vazio.
3. O site atualiza sozinho em até 5 minutos.

**Publicar uma notícia**

1. Subir a capa em Storage → bucket `noticias` e copiar o endereço público.
2. Table Editor → `noticias` → Insert row: título, slug (ex.: `estreia-na-champions`), resumo, conteúdo em Markdown, capa.
3. Marcar `publicado` e preencher `publicado_em` com a data e hora.

**Adicionar escudo de adversário ou foto de jogador**

1. Subir a imagem no bucket correspondente e colar o endereço público no campo `escudo_url` ou `foto_url`.

**Ativar a mascote**

1. Vercel → Settings → Environment Variables → `NEXT_PUBLIC_MASCOTE_ATIVA=true`.
2. Fazer um novo deploy (Deployments → Redeploy).

---

## 13. Acessibilidade, SEO e performance

- HTML semântico, navegação por teclado, foco visível (anel turquesa).
- Textos alternativos em todas as imagens informativas; elementos decorativos com `aria-hidden`.
- Contraste mínimo AA.
- `metadata` do Next em todas as páginas; imagem Open Graph padrão com o escudo sobre o Roxo Noite.
- `sitemap.ts` e `robots.ts`.
- Favicon a partir do escudo.
- Meta de Lighthouse: 90+ em Performance, Acessibilidade, Boas práticas e SEO no mobile.
- Imagens via `next/image`, com tamanhos corretos e `priority` só na imagem do hero.

---

## 14. Critérios de aceite

- [ ] Telas aprovadas no Figma antes do início do código.
- [ ] Todas as páginas do MVP funcionando com dados do Supabase, sem dados fixos no código.
- [ ] Estados vazios tratados em todas as listas.
- [ ] Datas e horas corretas no fuso de São Paulo.
- [ ] Estatísticas batendo com os dados (conferir com o seed, todas as competições: 4 jogos, 2 vitórias, 1 empate e 1 derrota, 24 gols marcados e 13 sofridos, aproveitamento de 58%; artilharia: Michael 6, Yan 6, Daniel 4, Juarez 3, Ygor 3, Braga 1; mais 1 gol contra a favor. Filtrando só a Champions: 1 jogo, 1 derrota, 3 × 5).
- [ ] Filtros de estatísticas refletidos na URL.
- [ ] Mascote aparece somente com `NEXT_PUBLIC_MASCOTE_ATIVA=true`.
- [ ] Botão de WhatsApp abrindo com a mensagem pronta.
- [ ] "Powered by Forge Software" com link funcionando.
- [ ] Rota de keep-alive protegida e cron configurado.
- [ ] Layout validado em 390 px e 1440 px.
- [ ] README com o passo a passo da seção 12.
- [ ] Deploy na Vercel funcionando.

---

## 15. Pendências conhecidas

- Nome da mascote (pode nunca ter; não inventar).
- Posições, pé e fotos dos jogadores.
- Versão vetorial (SVG) do escudo do Prado. Por enquanto, usar o PNG; quando o SVG chegar, substituir em `public/brand/`.
- Fotos profissionais (o clube planeja levar fotógrafos aos jogos; o layout já foi pensado para funcionar com poucas fotos).
- Domínio `.com.br` (o Arthur configura depois).
