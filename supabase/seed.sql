-- Dados iniciais do Prado FC (seção 11 do PRADO_FC_SITE.md).
-- Rode DEPOIS do schema.sql, uma única vez.
-- ANTES DE RODAR: troque SEU-PROJETO na linha abaixo pelo código do seu projeto no Supabase
-- (é o pedaço de SUPABASE_URL antes de ".supabase.co").

create temporary table cfg as
select 'https://egmuysnhbhrqhnskvtdc.supabase.co/storage/v1/object/public' as storage;

-- Competições
insert into competicoes (nome, temporada, logo_url) values
  ('Amistoso', 2026, null),
  ('Champions League da Liga Mineira', 2026, (select storage from cfg) || '/competicoes/champions-liga-mineira.png');

-- Adversários
insert into adversarios (nome, sigla, escudo_url) values
  ('Pipoca Doce FC', 'PD', (select storage from cfg) || '/escudos/pipoca-doce.png'),
  ('Tropa FC', 'TFC', (select storage from cfg) || '/escudos/tropa.png'),
  ('Bayern de Speed', 'BDS', (select storage from cfg) || '/escudos/bayern-de-speed.png');

-- Jogadores (posição e pé dos jogadores de linha ainda a confirmar)
insert into jogadores (nome, apelido, numero, posicao) values
  ('Arthur Ramos', 'Ramos', 1, 'Goleiro'),
  ('Thiago', 'Thiago', 12, 'Goleiro'),
  ('Daniel', 'Daniel', 7, 'Ala/Pivô'),
  ('Yan Diniz', 'Yan', 10, 'Ala/Meia'),
  ('Ygor', 'Yguin', 11, 'Fixo'),
  ('Juarez', 'Boi', 9, 'Fixo'),
  ('Felipe Medeiros', 'Medeiros', 5, 'Meia'),
  ('Lucas Braga', 'Braga', 77, 'Fixo'),
  ('Erick', 'Erickin', 15, 'Ala/Meia'),
  ('Igor', 'Igor', 16, 'Fixo'),
  ('Iago Diniz', 'Iago', 19, 'Fixo'),
  ('Eduardo', 'Dudu', 8, 'Meia'),
  ('Michael', 'Michael', 30, 'Pivô'),
  ('João Paulo', 'João', 13, 'Pivô'),
  ('Felipe Trigueiro', 'Trigueiro', null, 'Técnico');

-- Jogos (horário de Brasília, -03)
insert into jogos (data_hora, local, competicao_id, adversario_id, rodada, gols_prado, gols_adversario, status)
select v.data_hora::timestamptz, v.local, c.id, a.id, v.rodada, v.gp, v.ga, 'encerrado'
from (values
  ('2026-10-15 22:00:00-03', 'Arena Morro das Pedras', 'Amistoso', 'Pipoca Doce FC', null, 8, 4),
  ('2026-10-20 22:00:00-03', 'Arena Caiçara', 'Amistoso', 'Tropa FC', null, 3, 3),
  ('2026-10-27 22:00:00-03', 'Arena Caiçara', 'Amistoso', 'Bayern de Speed', null, 10, 1),
  ('2026-11-11 22:00:00-03', 'Arena Caiçara', 'Champions League da Liga Mineira', 'Tropa FC', 'Rodada 1', 3, 5)
) as v(data_hora, local, competicao, adversario, rodada, gp, ga)
join competicoes c on c.nome = v.competicao
join adversarios a on a.nome = v.adversario;

-- Gols: uma linha por gol do Prado
insert into gols (jogo_id, jogador_id, gol_contra)
select j.id, p.id, p.id is null
from (values
  ('2026-10-15', 'Yan', 3), ('2026-10-15', 'Boi', 2), ('2026-10-15', 'Daniel', 1),
  ('2026-10-15', 'Michael', 1), ('2026-10-15', null, 1),
  ('2026-10-20', 'Yan', 1), ('2026-10-20', 'Daniel', 1), ('2026-10-20', 'Michael', 1),
  ('2026-10-27', 'Yguin', 3), ('2026-10-27', 'Yan', 2), ('2026-10-27', 'Michael', 2),
  ('2026-10-27', 'Daniel', 1), ('2026-10-27', 'Boi', 1), ('2026-10-27', 'Braga', 1),
  ('2026-11-11', 'Michael', 2), ('2026-11-11', 'Daniel', 1)
) as v(dia, apelido, qtd)
join jogos j on (j.data_hora at time zone 'America/Sao_Paulo')::date = v.dia::date
left join jogadores p on p.apelido = v.apelido
cross join lateral generate_series(1, v.qtd);

-- Patrocinadores
insert into patrocinadores (nome, logo_url, instagram, ordem) values
  ('Assados Du Chef', (select storage from cfg) || '/patrocinadores/assados-du-chef.png', 'assadosduchef_', 1),
  ('Forge Software', (select storage from cfg) || '/patrocinadores/forge-software.png', 'forgesoftwarebr', 2),
  ('Ponto de Prosa Espetinho', (select storage from cfg) || '/patrocinadores/ponto-de-prosa.png', 'pontodeprosa', 3);

-- Notícia de validação
insert into noticias (titulo, slug, resumo, conteudo_md, capa_url, publicado, publicado_em) values (
  'Prado FC confirmado na Champions League da Liga Mineira',
  'prado-na-champions-league',
  'O Prado estreia na primeira competição oficial: 10 times, 2 grupos e jogos na Arena Caiçara.',
  $md$O Prado FC está confirmado na **Champions League da Liga Mineira** (F7 BH), a primeira competição oficial da história do clube. Os jogos acontecem na Arena Caiçara.

## Como funciona

- 10 times divididos em 2 grupos de 5
- Cada time enfrenta os 5 do outro grupo
- Os 8 melhores da classificação geral avançam
- Primeiro critério de desempate: saldo de gols

A estreia foi em 11/11, contra o Tropa FC. Acompanhe os próximos jogos na página [Jogos](/jogos) e no Instagram [@pradofcbh](https://instagram.com/pradofcbh).$md$,
  (select storage from cfg) || '/competicoes/champions-liga-mineira.png',
  true,
  '2026-11-12 12:00:00-03'
);

-- Conferência: deve mostrar 24 (uma linha por gol)
select count(*) as linhas_de_gols from gols;
