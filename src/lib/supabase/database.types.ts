export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      dreams: {
        Row: {
          id: string
          user_id: string
          title: string
          date: string
          description: string
          tags: string[] | null
          emotions: string[] | null
          ai_interpretation: Json | null
          generated_image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          date: string
          description: string
          tags?: string[] | null
          emotions?: string[] | null
          ai_interpretation?: Json | null
          generated_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          date?: string
          description?: string
          tags?: string[] | null
          emotions?: string[] | null
          ai_interpretation?: Json | null
          generated_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dreams_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper type for user metadata, assuming 'username' is stored there.
export type UserMetadata = {
  username?: string;
};
