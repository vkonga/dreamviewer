
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
  userId: string; // Simulates foreign key to a User
  title: string;
  date: Date;
  description: string;
  tags: string[];
  emotions: string[];
  aiInterpretation?: AIInterpretation;
  createdAt: Date;
  updatedAt: Date;
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
