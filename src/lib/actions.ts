
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { Dream, DreamFormValues, AIInterpretation, User, DreamTableRow } from "./definitions";
import { interpretDream as runAIInterpretationFlow, type InterpretDreamOutput } from "@/ai/flows/interpret-dream";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { UserMetadata } from "@/lib/supabase/database.types";

// Helper function to convert Supabase dream row to application Dream type
function fromSupabaseRow(row: DreamTableRow): Dream {
  return {
    ...row,
    date: new Date(row.date),
    tags: row.tags || [],
    emotions: row.emotions || [],
    ai_interpretation: row.ai_interpretation || undefined,
    created_at: new Date(row.created_at),
    updated_at: new Date(row.updated_at),
  };
}


const DreamFormSchema = z.object({
  title: z.string().min(1, "Title is required."),
  date: z.date({ coerce: true }), // Coerces input to Date object
  description: z.string().min(1, "Description is required."),
  tags: z.string().optional(), 
  emotions: z.array(z.string()).optional(),
});

// Dream actions using Supabase
export async function getDreams(): Promise<Dream[]> {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return []; // Or throw an error, depending on how you want to handle unauthenticated access
  }

  const { data, error } = await supabase
    .from("dreams")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching dreams:", error);
    return [];
  }
  return data ? data.map(fromSupabaseRow) : [];
}

export async function getDreamById(id: string): Promise<Dream | undefined> {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return undefined; 
  }
  
  const { data, error } = await supabase
    .from("dreams")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id) // Ensure user owns the dream
    .single();

  if (error) {
    console.error("Error fetching dream by ID:", error);
    return undefined;
  }
  return data ? fromSupabaseRow(data as DreamTableRow) : undefined;
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
  
  const newDreamData = {
    user_id: user.id, 
    title,
    date: date.toISOString(), // Convert Date to ISO string for Supabase
    description,
    tags: tags ? tags.split(",").map((tag) => tag.trim()).filter(tag => tag) : [],
    emotions: emotions || [],
    // ai_interpretation will be null by default
  };

  const { data: insertedDream, error } = await supabase
    .from("dreams")
    .insert(newDreamData)
    .select()
    .single();

  if (error) {
    console.error("Error creating dream:", error);
    return { message: "Database error: Failed to create dream." };
  }
  
  if (!insertedDream) {
    return { message: "Failed to create dream, no data returned." };
  }

  revalidatePath("/dreams");
  revalidatePath("/dashboard");
  return { message: "Dream created successfully.", dreamId: insertedDream.id, dream: fromSupabaseRow(insertedDream as DreamTableRow) };
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
  const dreamToUpdate = {
    title,
    date: date.toISOString(),
    description,
    tags: tags ? tags.split(",").map((tag) => tag.trim()).filter(tag => tag) : [],
    emotions: emotions || [],
    updated_at: new Date().toISOString(),
  };

  const { data: updatedDream, error } = await supabase
    .from("dreams")
    .update(dreamToUpdate)
    .eq("id", id)
    .eq("user_id", user.id) // Ensure user owns the dream
    .select()
    .single();
  
  if (error) {
    console.error("Error updating dream:", error);
    return { message: "Database error: Failed to update dream." };
  }

  if (!updatedDream) {
     return { message: "Failed to update dream, dream not found or unauthorized." };
  }

  revalidatePath(`/dreams`);
  revalidatePath(`/dreams/${id}`);
  revalidatePath(`/dreams/${id}/edit`);
  revalidatePath("/dashboard");
  return { message: "Dream updated successfully.", dream: fromSupabaseRow(updatedDream as DreamTableRow) };
}

export async function deleteDream(id: string) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { message: "User not authenticated." };
  }
  
  const { error, count } = await supabase
    .from("dreams")
    .delete({ count: 'exact' }) // Get the count of deleted rows
    .eq("id", id)
    .eq("user_id", user.id); // Ensure user owns the dream

  if (error) {
    console.error("Error deleting dream:", error);
    return { message: "Database error: Failed to delete dream." };
  }
  
  if (count === 0) {
     return { message: "Dream not found or unauthorized for deletion." };
  }

  revalidatePath("/dreams");
  revalidatePath("/dashboard");
  return { message: "Dream deleted successfully." };
}

export async function interpretDream(dreamId: string): Promise<{ interpretation?: AIInterpretation, message: string, error?: string }> {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { message: "User not authenticated.", error: "User not authenticated." };
  }

  const dream = await getDreamById(dreamId); // This already checks user ownership
  if (!dream) {
    return { message: "Dream not found or unauthorized.", error: "Dream not found." };
  }

  try {
    const aiResponse: InterpretDreamOutput = await runAIInterpretationFlow({ dreamText: dream.description });
    const interpretation: AIInterpretation = {
      overallMeaning: aiResponse.overallMeaning,
      symbols: aiResponse.symbols,
      emotionalTone: aiResponse.emotionalTone,
    };

    const { error: updateError } = await supabase
      .from("dreams")
      .update({ 
        ai_interpretation: interpretation,
        updated_at: new Date().toISOString() 
      })
      .eq("id", dreamId)
      .eq("user_id", user.id); // Extra check, though getDreamById should suffice

    if (updateError) {
      console.error("Error saving AI interpretation:", updateError);
      return { message: "Successfully interpreted, but failed to save interpretation.", error: updateError.message };
    }
    
    revalidatePath(`/dreams/${dreamId}`);
    return { interpretation, message: "Dream interpreted and saved successfully." };

  } catch (error) {
    console.error("AI interpretation flow error:", error);
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
      // emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback` 
    },
  });

  if (error) {
    return { success: false, message: error.message };
  }
  if (signUpData.user && signUpData.user.identities && signUpData.user.identities.length === 0) {
    return { success: false, message: "User already exists or another issue occurred. If you haven't confirmed your email, please check your inbox." };
  }
  
  let message = "Registration successful! ";
  // Check if email confirmation is required by your Supabase project settings
  // Supabase returns a session if email confirmation is NOT required.
  // If email confirmation IS required, session will be null until confirmed.
  if (signUpData.session === null && signUpData.user?.email_confirmed_at === null ) {
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
  revalidatePath('/', 'layout'); 
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
      username: userMetadata?.username || user.email?.split('@')[0] || "User", 
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
    updates.email = data.email; 
  }
  if (data.username) {
    // Ensure existing metadata is preserved if any, then update username
    const currentMetaData = currentUser.user_metadata || {};
    updates.data = { ...currentMetaData, username: data.username };
  }

  if (Object.keys(updates).length === 0) {
    return { success: true, message: "No changes to update." };
  }
  
  const { error } = await supabase.auth.updateUser(updates);

  if (error) {
    return { success: false, message: `Profile update failed: ${error.message}` };
  }

  revalidatePath('/profile');
  revalidatePath('/dashboard'); 
  return { success: true, message: "Profile updated successfully." };
}
