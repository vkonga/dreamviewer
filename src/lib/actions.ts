
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { Dream, DreamFormValues, AIInterpretation, User, DreamTableRow } from "./definitions";
import { interpretDream as runAIInterpretationFlow, type InterpretDreamOutput } from "@/ai/flows/interpret-dream";
import { generateImageFromDream as runDreamToImageFlow, type GenerateImageFromDreamOutput } from "@/ai/flows/dream-to-image-flow";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { UserMetadata } from "@/lib/supabase/database.types";
import { redirect } from 'next/navigation';
import { headers } from "next/headers";

// Helper function to convert Supabase dream row to application Dream type
function fromSupabaseRow(row: DreamTableRow): Dream {
  return {
    ...row,
    date: new Date(row.date),
    tags: row.tags || [],
    emotions: row.emotions || [],
    ai_interpretation: row.ai_interpretation || undefined, // Ensure it maps to aiInterpretation
    generated_image_url: row.generated_image_url || undefined,
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
export async function getDreams(query?: string): Promise<Dream[]> {
  const supabase = createSupabaseServerClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.error("getDreams - Error fetching user:", userError.message, JSON.stringify(userError, null, 2));
    return [];
  }
  if (!user) {
    console.warn("getDreams - No user session found when trying to fetch dreams.");
    redirect('/auth');
  }

  console.log(`getDreams - Attempting to fetch dreams for user: ${user.id} (query: '${query || ''}')`);

  let supabaseQuery = supabase
    .from("dreams")
    .select("*")
    .eq("user_id", user.id);

  if (query) {
    // Use .or() to search in title and description. The query format is specific.
    // We search for the query string appearing anywhere in the title or description, case-insensitive.
    supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
  }

  // Limit query to the 24 most recent dreams for performance.
  const { data, error } = await supabaseQuery
    .order("date", { ascending: false })
    .limit(24);


  if (error) {
    console.error("getDreams - Error fetching dreams from Supabase:", JSON.stringify(error, null, 2));
    // Log specific parts if available for easier reading
    console.error(`Supabase error details: message: ${error.message}, code: ${error.code}, details: ${error.details}, hint: ${error.hint}`);
    return [];
  }
  console.log(`getDreams - Successfully fetched ${data?.length || 0} dreams for user: ${user.id}`);
  return data ? data.map(fromSupabaseRow) : [];
}

export async function getDreamById(id: string): Promise<Dream | undefined> {
  const supabase = createSupabaseServerClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.error(`getDreamById(${id}) - Error fetching user:`, userError.message, JSON.stringify(userError, null, 2));
    return undefined;
  }
  if (!user) {
    console.warn(`getDreamById(${id}) - No user session found.`);
    redirect('/auth');
  }

  console.log(`getDreamById(${id}) - Attempting to fetch for user: ${user.id}`);
  const { data, error } = await supabase
    .from("dreams")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id) // Ensure user owns the dream
    .single();

  if (error) {
    console.error(`getDreamById(${id}) - Error fetching dream from Supabase:`, JSON.stringify(error, null, 2));
    console.error(`Supabase error details: message: ${error.message}, code: ${error.code}, details: ${error.details}, hint: ${error.hint}`);
    return undefined;
  }
  console.log(`getDreamById(${id}) - Successfully fetched dream.`);
  return data ? fromSupabaseRow(data as DreamTableRow) : undefined;
}

export async function createDream(values: DreamFormValues) {
  const supabase = createSupabaseServerClient();
  const { data: { user } , error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.error("createDream - Error fetching user:", userError.message);
    return { message: "Authentication error.", errors: { auth: "User not authenticated." } };
  }
  if (!user) {
    console.warn("createDream - No user session found.");
    redirect('/auth');
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
    date: date.toISOString(),
    description,
    tags: tags ? tags.split(",").map((tag) => tag.trim()).filter(tag => tag) : [],
    emotions: emotions || [],
  };

  console.log(`createDream - Attempting to insert dream for user: ${user.id}`, newDreamData);
  const { data: insertedDream, error } = await supabase
    .from("dreams")
    .insert(newDreamData)
    .select()
    .single();

  if (error) {
    console.error("createDream - Error inserting dream:", JSON.stringify(error, null, 2));
    const specificMessage = error.message || "Failed to create dream.";
    const errorCode = error.code || "UNKNOWN_CODE";
    return { message: `Database error: ${specificMessage} (Code: ${errorCode}). Please check server logs for full details.` };
  }

  if (!insertedDream) {
    console.error("createDream - Failed to create dream, no data returned from insert.");
    return { message: "Failed to create dream, no data returned." };
  }

  console.log(`createDream - Dream created successfully with id: ${insertedDream.id}`);
  revalidatePath("/dreams");
  revalidatePath("/dashboard");
  redirect(`/dreams/${insertedDream.id}`);
}

export async function updateDream(id: string, values: DreamFormValues) {
  const supabase = createSupabaseServerClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError) {
     console.error(`updateDream(${id}) - Error fetching user:`, userError.message);
    return { message: "Authentication error." };
  }
  if (!user) {
    console.warn(`updateDream(${id}) - No user session found.`);
    redirect('/auth');
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

  console.log(`updateDream(${id}) - Attempting to update for user: ${user.id}`, dreamToUpdate);
  const { data: updatedDream, error } = await supabase
    .from("dreams")
    .update(dreamToUpdate)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error(`updateDream(${id}) - Error updating dream:`, JSON.stringify(error, null, 2));
    return { message: "Database error: Failed to update dream." };
  }

  if (!updatedDream) {
     console.error(`updateDream(${id}) - Failed to update dream, dream not found or unauthorized.`);
     return { message: "Failed to update dream, dream not found or unauthorized." };
  }

  console.log(`updateDream(${id}) - Dream updated successfully.`);
  revalidatePath(`/dreams`);
  revalidatePath(`/dreams/${id}`);
  revalidatePath(`/dreams/${id}/edit`);
  revalidatePath("/dashboard");
  redirect(`/dreams/${id}`);
}

export async function deleteDream(id: string) {
  const supabase = createSupabaseServerClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.error(`deleteDream(${id}) - Error fetching user:`, userError.message);
    return { message: "Authentication error." };
  }
  if (!user) {
    console.warn(`deleteDream(${id}) - No user session found.`);
    redirect('/auth');
  }

  console.log(`deleteDream(${id}) - Attempting to delete for user: ${user.id}`);
  const { error, count } = await supabase
    .from("dreams")
    .delete({ count: 'exact' })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error(`deleteDream(${id}) - Error deleting dream:`, JSON.stringify(error, null, 2));
    return { message: "Database error: Failed to delete dream." };
  }

  if (count === 0) {
     console.warn(`deleteDream(${id}) - Dream not found or unauthorized for deletion for user: ${user.id}.`);
     return { message: "Dream not found or unauthorized for deletion." };
  }

  console.log(`deleteDream(${id}) - Dream deleted successfully.`);
  revalidatePath("/dreams");
  revalidatePath("/dashboard");
  // Don't redirect here, let the client-side handle it after a successful toast.
  return { success: true, message: "Dream deleted successfully." };
}

export async function interpretDream(dreamId: string): Promise<{ interpretation?: AIInterpretation, message: string, error?: string }> {
  const supabase = createSupabaseServerClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.error(`interpretDream(${dreamId}) - Error fetching user:`, userError.message);
    return { message: "User not authenticated.", error: "User not authenticated." };
  }
  if (!user) {
    console.warn(`interpretDream(${dreamId}) - No user session found.`);
    redirect('/auth');
  }

  const dream = await getDreamById(dreamId);
  if (!dream) {
    return { message: "Dream not found or unauthorized.", error: "Dream not found." };
  }

  try {
    console.log(`interpretDream(${dreamId}) - Requesting AI interpretation for dream description: "${dream.description.substring(0, 50)}..."`);
    const aiResponse: InterpretDreamOutput | null = await runAIInterpretationFlow({ dreamText: dream.description });
    
    if (!aiResponse || !aiResponse.overallMeaning) {
        console.error(`interpretDream(${dreamId}) - AI interpretation flow did not return a valid output.`);
        throw new Error('AI analysis failed to produce a result. The model might not have been able to interpret the dream in the expected format.');
    }

    const interpretation: AIInterpretation = {
      overallMeaning: aiResponse.overallMeaning,
      symbols: aiResponse.symbols,
      emotionalTone: aiResponse.emotionalTone,
    };

    console.log(`interpretDream(${dreamId}) - AI interpretation received, attempting to save.`);
    const { error: updateError } = await supabase
      .from("dreams")
      .update({
        ai_interpretation: interpretation,
        updated_at: new Date().toISOString()
      })
      .eq("id", dreamId)
      .eq("user_id", user.id);

    if (updateError) {
      console.error(`interpretDream(${dreamId}) - Error saving AI interpretation:`, JSON.stringify(updateError, null, 2));
      return { interpretation, message: "Successfully interpreted, but failed to save interpretation.", error: updateError.message };
    }

    console.log(`interpretDream(${dreamId}) - Dream interpreted and saved successfully.`);
    revalidatePath(`/dreams/${dreamId}`);
    return { interpretation, message: "Dream interpreted and saved successfully." };

  } catch (error) {
    console.error(`interpretDream(${dreamId}) - AI interpretation flow error:`, error);
    return { message: `Failed to interpret dream: ${(error as Error).message}`, error: (error as Error).message };
  }
}

export async function generateDreamImage(dreamId: string): Promise<{ imageDataUri?: string, message: string, error?: string }> {
  const supabase = createSupabaseServerClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.error(`generateDreamImage(${dreamId}) - Error fetching user:`, userError.message);
    return { message: "User not authenticated.", error: "User not authenticated." };
  }
  if (!user) {
    console.warn(`generateDreamImage(${dreamId}) - No user session found.`);
    redirect('/auth');
  }

  const dream = await getDreamById(dreamId);
  if (!dream) {
    return { message: "Dream not found or unauthorized.", error: "Dream not found." };
  }
  if (!dream.description || dream.description.trim().length < 10) {
    return { message: "Dream description is too short to generate an image.", error: "Dream description too short."};
  }

  try {
    console.log(`generateDreamImage(${dreamId}) - Requesting AI image generation for dream: "${dream.title}"`);
    const aiResponse: GenerateImageFromDreamOutput = await runDreamToImageFlow({ dreamText: dream.description });
    
    if (!aiResponse || !aiResponse.imageDataUri) {
        console.error(`generateDreamImage(${dreamId}) - AI image generation flow did not return a valid image URI.`);
        throw new Error('AI image generation failed. The model might not have produced an image.');
    }
    
    console.log(`generateDreamImage(${dreamId}) - Dream image generated, attempting to save URI to database.`);
    const { error: updateError } = await supabase
      .from("dreams")
      .update({
        generated_image_url: aiResponse.imageDataUri,
        updated_at: new Date().toISOString()
      })
      .eq("id", dreamId)
      .eq("user_id", user.id);

    if (updateError) {
      console.error(`generateDreamImage(${dreamId}) - Error saving generated image URL:`, JSON.stringify(updateError, null, 2));
      return { imageDataUri: aiResponse.imageDataUri, message: "Successfully generated image, but failed to save it.", error: updateError.message };
    }

    console.log(`generateDreamImage(${dreamId}) - Dream image generated and saved successfully.`);
    revalidatePath(`/dreams/${dreamId}`);
    return { imageDataUri: aiResponse.imageDataUri, message: "Dream image generated and saved successfully." };

  } catch (error) {
    console.error(`generateDreamImage(${dreamId}) - AI image generation flow error:`, error);
    return { message: `Failed to generate dream image: ${(error as Error).message}`, error: (error as Error).message };
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
    console.error("loginUser - Error:", error.message);
    return { success: false, message: error.message };
  }
  revalidatePath('/', 'layout');
  redirect('/dashboard');
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
    },
  });

  if (error) {
    console.error("registerUser - Error:", error.message);
    return { success: false, message: error.message };
  }
  if (signUpData.user && signUpData.user.identities && signUpData.user.identities.length === 0) {
    console.warn("registerUser - User already exists or an issue occurred (no new identity).");
    return { success: false, message: "User with this email already exists." };
  }

  let message = "Registration successful! ";
  if (signUpData.session === null && signUpData.user?.email_confirmed_at === null ) {
     message += "Please check your email to confirm your account.";
     console.log(`registerUser - User ${data.email} registered, email confirmation pending.`);
  } else {
     message += "You are now logged in.";
     revalidatePath('/', 'layout');
     console.log(`registerUser - User ${data.email} registered and logged in.`);
  }

  return { success: true, message };
}

export async function logoutUser() {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("logoutUser - Error:", error.message);
    return { success: false, message: `Logout failed: ${error.message}` };
  }
  revalidatePath('/', 'layout');
  console.log("logoutUser - User logged out successfully.");
  return { success: true, message: "Logged out successfully." };
}

export async function getCurrentUser(): Promise<User | null> {
  const supabase = createSupabaseServerClient();
  const { data: { user } , error } = await supabase.auth.getUser();

  if (error) {
    console.error("getCurrentUser - Error fetching user:", error.message);
    return null;
  }
  if (user) {
    const userMetadata = user.user_metadata as UserMetadata;
    // console.log(`getCurrentUser - User found: ${user.id} (email: ${user.email})`);
    return {
      id: user.id,
      email: user.email || "",
      username: userMetadata?.username || user.email?.split('@')[0] || "User",
      createdAt: new Date(user.created_at),
    };
  }
  // console.log("getCurrentUser - No user session found.");
  return null;
}

export async function updateUserProfile(data: { username?: string; email?: string }) {
  const supabase = createSupabaseServerClient();
  const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.error("updateUserProfile - Error fetching current user:", userError.message);
    return { success: false, message: "Authentication error." };
  }
  if (!currentUser) {
    console.warn("updateUserProfile - No current user session found.");
    return { success: false, message: "User not authenticated." };
  }

  const updates: { email?: string; data?: UserMetadata } = {};
  if (data.email && data.email !== currentUser.email) {
    updates.email = data.email;
  }
  if (data.username) {
    const currentMetaData = currentUser.user_metadata || {};
    updates.data = { ...currentMetaData, username: data.username };
  }

  if (Object.keys(updates).length === 0) {
    console.log("updateUserProfile - No changes to update.");
    return { success: true, message: "No changes to update." };
  }

  console.log(`updateUserProfile - Attempting to update profile for user ${currentUser.id}:`, updates);
  const { error } = await supabase.auth.updateUser(updates);

  if (error) {
    console.error("updateUserProfile - Profile update failed:", error.message);
    return { success: false, message: `Profile update failed: ${error.message}` };
  }

  console.log(`updateUserProfile - Profile updated successfully for user ${currentUser.id}.`);
  revalidatePath('/profile');
  revalidatePath('/dashboard');
  return { success: true, message: "Profile updated successfully." };
}

export async function signInWithGoogle() {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: 'http://localhost:9002/auth/callback',
    },
  });

  if (error) {
    console.error("signInWithGoogle - Error:", error.message);
    return redirect(`/auth?error=${encodeURIComponent(error.message)}`);
  }

  if (data.url) {
    redirect(data.url);
  }

  return redirect(`/auth?error=${encodeURIComponent("Could not get Google sign-in URL.")}`);
}
