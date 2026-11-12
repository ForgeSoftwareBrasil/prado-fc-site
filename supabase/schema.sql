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
