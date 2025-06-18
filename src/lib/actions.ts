
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { Dream, DreamFormValues, AIInterpretation } from "./definitions";
import { interpretDream as runAIInterpretation, type InterpretDreamOutput } from "@/ai/flows/interpret-dream";

// Mock database
let dreams: Dream[] = [
  {
    id: "1",
    userId: "mockUser123",
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
  tags: z.string().optional(), // Comma-separated
  emotions: z.array(z.string()).optional(),
});

export async function getDreams(): Promise<Dream[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return dreams.sort((a,b) => b.date.getTime() - a.date.getTime());
}

export async function getDreamById(id: string): Promise<Dream | undefined> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return dreams.find((dream) => dream.id === id);
}

export async function createDream(values: DreamFormValues) {
  const validatedFields = DreamFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Failed to create dream. Please check your input.",
    };
  }

  const { title, date, description, tags, emotions } = validatedFields.data;

  const newDream: Dream = {
    id: String(Date.now()), // Simple ID generation
    userId: "mockUser123", // Mock user ID
    title,
    date,
    description,
    tags: tags ? tags.split(",").map((tag) => tag.trim()).filter(tag => tag) : [],
    emotions: emotions || [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  dreams.push(newDream);
  revalidatePath("/dreams");
  revalidatePath("/dashboard");
  return { message: "Dream created successfully.", dreamId: newDream.id, dream: newDream };
}

export async function updateDream(id: string, values: DreamFormValues) {
  const validatedFields = DreamFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Failed to update dream. Please check your input.",
    };
  }

  const { title, date, description, tags, emotions } = validatedFields.data;
  const dreamIndex = dreams.findIndex((dream) => dream.id === id);

  if (dreamIndex === -1) {
    return { message: "Dream not found." };
  }

  dreams[dreamIndex] = {
    ...dreams[dreamIndex],
    title,
    date,
    description,
    tags: tags ? tags.split(",").map((tag) => tag.trim()).filter(tag => tag) : [],
    emotions: emotions || [],
    updatedAt: new Date(),
  };

  revalidatePath(`/dreams`);
  revalidatePath(`/dreams/${id}`);
  revalidatePath(`/dreams/${id}/edit`);
  revalidatePath("/dashboard");
  return { message: "Dream updated successfully.", dream: dreams[dreamIndex] };
}

export async function deleteDream(id: string) {
  dreams = dreams.filter((dream) => dream.id !== id);
  revalidatePath("/dreams");
  revalidatePath("/dashboard");
  return { message: "Dream deleted successfully." };
}

export async function interpretDream(dreamId: string): Promise<{ interpretation?: AIInterpretation, message: string, error?: string }> {
  const dream = await getDreamById(dreamId);
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

    // Save interpretation to the dream
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

// Mock auth actions
export async function loginUser(data: { email: string; password_DO_NOT_USE: string }) {
  // In a real app, validate credentials, generate JWT, etc.
  // Here, we just simulate success.
  await new Promise(resolve => setTimeout(resolve, 500));
  if (data.email === "user@example.com" && data.password_DO_NOT_USE === "password123") {
    return { success: true, message: "Logged in successfully!", user: { id: "mockUser123", email: "user@example.com", username: "Dreamer" } };
  }
  return { success: false, message: "Invalid credentials." };
}

export async function registerUser(data: { email: string; password_DO_NOT_USE: string; username: string }) {
  await new Promise(resolve => setTimeout(resolve, 500));
  // Simulate registration
  return { success: true, message: "Registered successfully! Please log in.", user: { id: String(Date.now()), email: data.email, username: data.username } };
}
