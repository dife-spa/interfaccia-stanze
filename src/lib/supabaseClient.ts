// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

export type Database = {
  public: {
    Tables: {
      prenotazioni: {
        Row: {
          id_stanza: number;
          ora_inizio: string; // timestamp (ISO string)
          ora_fine: string;   // timestamp (ISO string)
          data: string;       // date (YYYY-MM-DD)
          tipologia: string;
          n_partecipanti: number;
          user_nome: string;
          user_cognome: string;
          userPic: string;
        };
        Insert: {
          id_stanza: number;
          ora_inizio: string;
          ora_fine: string;
          data: string;
          tipologia: string;
          n_partecipanti: number;
          user_nome: string;
          user_cognome: string;
          userPic: string;
        };
        Update: {
          id_stanza?: number;
          ora_inizio?: string;
          ora_fine?: string;
          data?: string;
          tipologia?: string;
          n_partecipanti?: number;
          user_nome?: string;
          user_cognome?: string;
          userPic?: string;
        };
      };
      stanze: {
        Row: {
          id: number;
          nome: string;
          descrizione: string;
          posizione: number;
          capienza: number;
          accessori: string; // expected as a comma-separated string (e.g.: "Proiettore, Lavagna, WiFi")
        };
        Insert: {
          id?: number;
          nome: string;
          descrizione: string;
          posizione: number;
          capienza: number;
          accessori: string;
        };
        Update: {
          id?: number;
          nome?: string;
          descrizione?: string;
          posizione?: number;
          capienza?: number;
          accessori?: string;
        };
      };
    };
  };
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
