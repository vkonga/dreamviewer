
// This is a placeholder file.
// You should generate your Supabase database types and place them here.
// You can generate them using the Supabase CLI:
// supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/supabase/database.types.ts
// Or from the Supabase dashboard: Project Settings -> API -> Generate types

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
      // Define your tables here if you have any, e.g., profiles
      // For now, we'll keep it minimal as auth uses its own tables.
      // Example:
      // profiles: {
      //   Row: {
      //     id: string
      //     updated_at: string | null
      //     username: string | null
      //     full_name: string | null
      //     avatar_url: string | null
      //     website: string | null
      //   }
      //   Insert: {
      //     id: string
      //     updated_at?: string | null
      //     username?: string | null
      //     full_name?: string | null
      //     avatar_url?: string | null
      //     website?: string | null
      //   }
      //   Update: {
      //     id?: string
      //     updated_at?: string | null
      //     username?: string | null
      //     full_name?: string | null
      //     avatar_url?: string | null
      //     website?: string | null
      //   }
      //   Relationships: [
      //     {
      //       foreignKeyName: "profiles_id_fkey"
      //       columns: ["id"]
      //       referencedRelation: "users"
      //       referencedColumns: ["id"]
      //     }
      //   ]
      // }
      // Ensure your user metadata (like username) is handled by Supabase Auth's user_metadata
      // or by a 'profiles' table linked to auth.users.id.
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
  // Add other metadata fields if any
};
