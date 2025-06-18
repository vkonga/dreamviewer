
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { createDream, updateDream } from "@/lib/actions";
import type { Dream, DreamFormValues, PREDEFINED_EMOTIONS as PredefinedEmotionsType } from "@/lib/definitions";
import { PREDEFINED_EMOTIONS } from "@/lib/definitions";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, Loader2, Save, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import React from "react";

const DreamFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.date({ required_error: "Date is required" }),
  description: z.string().min(1, "Description is required"),
  tags: z.string().optional(), // Comma-separated tags
  emotions: z.array(z.string()).optional(),
});

interface DreamEditorFormProps {
  dream?: Dream; // For editing existing dream
  onFormSubmit?: (dreamId: string) => void; // Optional: callback after submission
}

export function DreamEditorForm({ dream, onFormSubmit }: DreamEditorFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const defaultValues: Partial<DreamFormValues> = dream
    ? {
        title: dream.title,
        date: new Date(dream.date),
        description: dream.description,
        tags: dream.tags.join(", "),
        emotions: dream.emotions,
      }
    : {
        date: new Date(),
        emotions: [],
        tags: "",
      };

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<DreamFormValues>({
    resolver: zodResolver(DreamFormSchema),
    defaultValues,
  });

  const selectedEmotions = watch("emotions", dream?.emotions || []);

  const onSubmit = async (data: DreamFormValues) => {
    setIsSubmitting(true);
    try {
      if (dream) {
        const result = await updateDream(dream.id, data);
        if (result.message.includes("successfully")) {
          toast({ title: "Dream Updated", description: result.message });
          if (onFormSubmit) onFormSubmit(dream.id); else router.push(`/dreams/${dream.id}`);
        } else {
          toast({ title: "Update Failed", description: result.message, variant: "destructive" });
        }
      } else {
        const result = await createDream(data);
        if (result.message.includes("successfully") && result.dreamId) {
          toast({ title: "Dream Saved", description: result.message });
          if (onFormSubmit) onFormSubmit(result.dreamId); else router.push(`/dreams/${result.dreamId}`);
        } else {
          toast({ title: "Save Failed", description: result.message || "An unknown error occurred.", variant: "destructive" });
        }
      }
    } catch (error) {
      toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-card/90 shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">{dream ? "Edit Dream" : "Log a New Dream"}</CardTitle>
        <CardDescription>Capture the details of your dream.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register("title")} placeholder="e.g., Flying over the city" />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-popover">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.date && <p className="text-sm text-destructive">{errors.date.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Dream Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Describe your dream in as much detail as possible..."
              rows={8}
              className="min-h-[150px]"
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input id="tags" {...register("tags")} placeholder="e.g., flying, work, lucid dream" />
          </div>

          <div className="space-y-2">
            <Label>Emotions</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 p-3 border rounded-md bg-background/50">
              {(PREDEFINED_EMOTIONS as unknown as PredefinedEmotionsType[]).map((emotion) => (
                <div key={emotion} className="flex items-center space-x-2">
                  <Checkbox
                    id={`emotion-${emotion}`}
                    checked={selectedEmotions.includes(emotion)}
                    onCheckedChange={(checked) => {
                      const currentEmotions = selectedEmotions;
                      if (checked) {
                        setValue("emotions", [...currentEmotions, emotion]);
                      } else {
                        setValue("emotions", currentEmotions.filter((e) => e !== emotion));
                      }
                    }}
                  />
                  <Label htmlFor={`emotion-${emotion}`} className="font-normal text-sm text-foreground/90">{emotion}</Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3">
          {dream && (
            <Button type="button" variant="destructive" onClick={() => { /* Implement delete logic */ }} disabled={isSubmitting}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" /> }
            {dream ? "Save Changes" : "Save Dream"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
