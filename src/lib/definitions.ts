
export type User = {
  id: string;
  username?: string;
  email: string;
  createdAt: Date;
};

export type DreamSymbol = {
  symbol: string;
  meaning: string;
};

export type AIInterpretation = {
  overallMeaning: string;
  symbols: DreamSymbol[];
  emotionalTone: string;
};

export type Dream = {
  id: string;
  user_id: string; // Changed from userId to match Supabase convention
  title: string;
  date: Date; // Will be string from DB, converted to Date in actions
  description: string;
  tags: string[];
  emotions: string[];
  ai_interpretation?: AIInterpretation | null; // Changed to match Supabase convention, can be null
  generated_image_url?: string | null; // Added to store the generated image
  created_at: Date; // Will be string from DB, converted to Date in actions
  updated_at: Date; // Will be string from DB, converted to Date in actions
};

// For react-hook-form
export type DreamFormValues = {
  title: string;
  date: Date;
  description: string;
  tags: string; // Comma-separated string, to be parsed
  emotions: string[];
};

export const PREDEFINED_EMOTIONS = ["Happy", "Sad", "Anxious", "Excited", "Confused", "Scared", "Peaceful", "Angry", "Surprised", "Awe"];

// Type for rows coming directly from Supabase dreams table
export type DreamTableRow = {
  id: string;
  user_id: string;
  title: string;
  date: string; // Timestamptz comes as string
  description: string;
  tags: string[] | null;
  emotions: string[] | null;
  ai_interpretation?: AIInterpretation | null;
  generated_image_url: string | null; // Added to match new DB column
  created_at: string; // Timestamptz comes as string
  updated_at: string; // Timestamptz comes as string
};
