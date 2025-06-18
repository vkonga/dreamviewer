
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { Dream, DreamFormValues, AIInterpretation, User } from "./definitions";
import { interpretDream as runAIInterpretation, type InterpretDreamOutput } from "@/ai/flows/interpret-dream";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { UserMetadata } from "@/lib/supabase/database.types";

// Mock database for dreams - This should eventually be replaced by Supabase tables
let dreams: Dream[] = [
  {
    id: "1",
    userId: "mockUser123", // This will be the Supabase user ID
    title: "Flying Over Mountains",
    date: new Date("2024-07-15T00:00:00.000Z"),
    description: "I dreamt I was soaring over vast mountain ranges, the wind in my hair. It felt liberating.",
    tags: ["flying", "mountains", "freedom"],
    emotions: ["Excited", "Peaceful", "Awe"],
    createdAt: new Date(),
    updatedAt: new Date(),
    aiInterpretation: {
      overallMeaning: "Flying dreams often symbolize a sense of freedom, ambition, and a desire to overcome obstacles. Soaring over mountains could indicate a feeling of rising above challenges or gaining a new perspective on life.",
      symbols: [
        { symbol: "Flying", meaning: "Freedom, liberation, new perspectives, ambition." },
        { symbol: "Mountains", meaning: "Obstacles, challenges, achievements, spiritual elevation." },
      ],
      emotionalTone: "Positive, empowering, and liberating."
    }
  },
  {
    id: "2",
    userId: "mockUser123",
    title: "Lost in a Maze",
    date: new Date("2024-07-18T00:00:00.000Z"),
    description: "I was trapped in an endless, shifting maze. I felt anxious and couldn't find the exit.",
    tags: ["maze", "lost", "anxiety"],
    emotions: ["Anxious", "Confused", "Scared"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const DreamFormSchema = z.object({
  title: z.string().min(1, "Title is required."),
  date: z.date({ coerce: true }),
  description: z.string().min(1, "Description is required."),
  tags: z.string().optional(), 
  emotions: z.array(z.string()).optional(),
});

// Dream actions (still mock, to be updated to use Supabase DB later)
export async function getDreams(): Promise<Dream[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  // In a real app, filter dreams by the authenticated user's ID from Supabase
  return dreams.sort((a,b) => b.date.getTime() - a.date.getTime());
}

export async function getDreamById(id: string): Promise<Dream | undefined> {
  await new Promise(resolve => setTimeout(resolve, 300));
  // In a real app, also check if the dream belongs to the authenticated user
  return dreams.find((dream) => dream.id === id);
}

export async function createDream(values: DreamFormValues) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { message: "User not authenticated.", errors: { auth: "User not authenticated." } };
  }

  const validatedFields = DreamFormSchema.safeParse(values);
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Failed to create dream. Please check your input.",
    };
  }

  const { title, date, description, tags, emotions } = validatedFields.data;
  const newDream: Dream = {
    id: String(Date.now()), 
    userId: user.id, 
    title,
    date,
    description,
    tags: tags ? tags.split(",").map((tag) => tag.trim()).filter(tag => tag) : [],
    emotions: emotions || [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  dreams.push(newDream); // Replace with Supabase insert
  revalidatePath("/dreams");
  revalidatePath("/dashboard");
  return { message: "Dream created successfully.", dreamId: newDream.id, dream: newDream };
}

export async function updateDream(id: string, values: DreamFormValues) {
   const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { message: "User not authenticated." };
  }

  const validatedFields = DreamFormSchema.safeParse(values);
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Failed to update dream. Please check your input.",
    };
  }

  const { title, date, description, tags, emotions } = validatedFields.data;
  const dreamIndex = dreams.findIndex((dream) => dream.id === id && dream.userId === user.id);

  if (dreamIndex === -1) {
    return { message: "Dream not found or unauthorized." };
  }

  dreams[dreamIndex] = {
    ...dreams[dreamIndex],
    title,
    date,
    description,
    tags: tags ? tags.split(",").map((tag) => tag.trim()).filter(tag => tag) : [],
    emotions: emotions || [],
    updatedAt: new Date(),
  }; // Replace with Supabase update

  revalidatePath(`/dreams`);
  revalidatePath(`/dreams/${id}`);
  revalidatePath(`/dreams/${id}/edit`);
  revalidatePath("/dashboard");
  return { message: "Dream updated successfully.", dream: dreams[dreamIndex] };
}

export async function deleteDream(id: string) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { message: "User not authenticated." };
  }
  
  const initialLength = dreams.length;
  dreams = dreams.filter((dream) => dream.id !== id || dream.userId !== user.id); // Replace with Supabase delete

  if (dreams.length === initialLength) {
     return { message: "Dream not found or unauthorized for deletion." };
  }

  revalidatePath("/dreams");
  revalidatePath("/dashboard");
  return { message: "Dream deleted successfully." };
}

export async function interpretDream(dreamId: string): Promise<{ interpretation?: AIInterpretation, message: string, error?: string }> {
  const dream = await getDreamById(dreamId); // Ensure this checks user ownership if sensitive
  if (!dream) {
    return { message: "Dream not found.", error: "Dream not found." };
  }

  try {
    const aiResponse: InterpretDreamOutput = await runAIInterpretation({ dreamText: dream.description });
    const interpretation: AIInterpretation = {
      overallMeaning: aiResponse.overallMeaning,
      symbols: aiResponse.symbols,
      emotionalTone: aiResponse.emotionalTone,
    };

    const dreamIndex = dreams.findIndex((d) => d.id === dreamId);
    if (dreamIndex !== -1) {
      dreams[dreamIndex].aiInterpretation = interpretation;
      dreams[dreamIndex].updatedAt = new Date();
    }
    
    revalidatePath(`/dreams/${dreamId}`);
    return { interpretation, message: "Dream interpreted successfully." };

  } catch (error) {
    console.error("AI interpretation error:", error);
    return { message: "Failed to interpret dream.", error: (error as Error).message };
  }
}

// Auth actions using Supabase
export async function loginUser(data: { email: string; password_DO_NOT_USE: string }) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password_DO_NOT_USE,
  });

  if (error) {
    return { success: false, message: error.message };
  }
  revalidatePath('/', 'layout'); // Revalidate all paths to update auth state
  return { success: true, message: "Logged in successfully!" };
}

export async function registerUser(data: { email: string; password_DO_NOT_USE: string; username: string }) {
  const supabase = createSupabaseServerClient();
  const { error, data: signUpData } = await supabase.auth.signUp({
    email: data.email,
    password: data.password_DO_NOT_USE,
    options: {
      data: {
        username: data.username,
      },
      // To redirect user to a specific page after email confirmation:
      // emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback` // Create this route if needed
    },
  });

  if (error) {
    return { success: false, message: error.message };
  }
  if (signUpData.user && signUpData.user.identities && signUpData.user.identities.length === 0) {
    // This can happen if email confirmation is required and the user already exists but is not confirmed.
    // Supabase might return a user object but indicate it's not a new session.
    return { success: false, message: "User already exists or another issue occurred. If you haven't confirmed your email, please check your inbox." };
  }
  
  // If email confirmation is enabled (default), user will be sent an email.
  // Session might be null until email is confirmed.
  let message = "Registration successful! ";
  if (supabase.auth.signInWithPassword !== undefined && (!signUpData.session || !signUpData.user?.email_confirmed_at)) {
     message += "Please check your email to confirm your account.";
  } else {
     message += "You are now logged in.";
     revalidatePath('/', 'layout');
  }

  return { success: true, message };
}

export async function logoutUser() {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    return { success: false, message: `Logout failed: ${error.message}` };
  }
  revalidatePath('/', 'layout'); // Revalidate all paths to update auth state
  return { success: true, message: "Logged out successfully." };
}

export async function getCurrentUser(): Promise<User | null> {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const userMetadata = user.user_metadata as UserMetadata;
    return {
      id: user.id,
      email: user.email || "",
      username: userMetadata?.username || user.email?.split('@')[0] || "User", // Fallback username
      createdAt: new Date(user.created_at),
    };
  }
  return null;
}

export async function updateUserProfile(data: { username?: string; email?: string }) {
  const supabase = createSupabaseServerClient();
  const { data: { user: currentUser } } = await supabase.auth.getUser();

  if (!currentUser) {
    return { success: false, message: "User not authenticated." };
  }

  const updates: { email?: string; data?: UserMetadata } = {};
  if (data.email && data.email !== currentUser.email) {
    updates.email = data.email; // Note: Email change might require confirmation
  }
  if (data.username) {
    updates.data = { ...currentUser.user_metadata as UserMetadata, username: data.username };
  }

  if (Object.keys(updates).length === 0) {
    return { success: true, message: "No changes to update." };
  }
  
  const { error } = await supabase.auth.updateUser(updates);

  if (error) {
    return { success: false, message: `Profile update failed: ${error.message}` };
  }

  revalidatePath('/profile');
  revalidatePath('/dashboard'); // If username is displayed there
  return { success: true, message: "Profile updated successfully." };
}
