// Tipos do banco no formato do `supabase gen types typescript`.
// Escritos à mão a partir de supabase/schema.sql; quando o projeto existir, regenere com:
//   npx supabase gen types typescript --project-id <projeto> > src/types/database.ts

type Table<Row, Rel = []> = {
  Row: Row;
  Insert: Partial<Row>;
  Update: Partial<Row>;
  Relationships: Rel;
};

export type StatusJogo = "agendado" | "encerrado" | "adiado" | "cancelado";

export type Database = {
  public: {
    Tables: {
      competicoes: Table<{
        id: string;
        nome: string;
        temporada: number;
        logo_url: string | null;
        created_at: string;
      }>;
      adversarios: Table<{
        id: string;
        nome: string;
        sigla: string | null;
        escudo_url: string | null;
        instagram: string | null;
        created_at: string;
      }>;
      jogos: Table<
        {
          id: string;
          data_hora: string;
          local: string;
          competicao_id: string;
          adversario_id: string;
          rodada: string | null;
          gols_prado: number | null;
          gols_adversario: number | null;
          status: StatusJogo;
          created_at: string;
        },
        [
          {
            foreignKeyName: "jogos_competicao_id_fkey";
            columns: ["competicao_id"];
            isOneToOne: false;
            referencedRelation: "competicoes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "jogos_adversario_id_fkey";
            columns: ["adversario_id"];
            isOneToOne: false;
            referencedRelation: "adversarios";
            referencedColumns: ["id"];
          },
        ]
      >;
      jogadores: Table<{
        id: string;
        nome: string;
        apelido: string | null;
        nome_camisa: string | null;
        numero: number | null;
        posicao: string | null;
        pe: "Direito" | "Esquerdo" | "Ambidestro" | null;
        foto_url: string | null;
        ativo: boolean;
        ordem: number | null;
        created_at: string;
      }>;
      gols: Table<
        {
          id: string;
          jogo_id: string;
          jogador_id: string | null;
          gol_contra: boolean;
          minuto: number | null;
          created_at: string;
        },
        [
          {
            foreignKeyName: "gols_jogo_id_fkey";
            columns: ["jogo_id"];
            isOneToOne: false;
            referencedRelation: "jogos";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "gols_jogador_id_fkey";
            columns: ["jogador_id"];
            isOneToOne: false;
            referencedRelation: "jogadores";
            referencedColumns: ["id"];
          },
        ]
      >;
      noticias: Table<{
        id: string;
        titulo: string;
        slug: string;
        resumo: string | null;
        conteudo_md: string;
        capa_url: string | null;
        publicado: boolean;
        publicado_em: string | null;
        created_at: string;
      }>;
      patrocinadores: Table<{
        id: string;
        nome: string;
        logo_url: string;
        instagram: string | null;
        site_url: string | null;
        ordem: number | null;
        ativo: boolean;
      }>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: { status_jogo: StatusJogo };
    CompositeTypes: Record<string, never>;
  };
};

type Tables = Database["public"]["Tables"];
export type Competicao = Tables["competicoes"]["Row"];
export type Adversario = Tables["adversarios"]["Row"];
export type JogoRow = Tables["jogos"]["Row"];
export type Jogador = Tables["jogadores"]["Row"];
export type Gol = Tables["gols"]["Row"];
export type Noticia = Tables["noticias"]["Row"];
export type Patrocinador = Tables["patrocinadores"]["Row"];

/** Jogo com competição, adversário e gols (com autor), como as páginas usam. */
export type Jogo = JogoRow & {
  competicao: Competicao;
  adversario: Adversario;
  gols: (Gol & { jogador: Jogador | null })[];
};
