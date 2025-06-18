
"use client";

import { use, useEffect, useState } from "react"; // Import use
import { AppShell } from "@/components/layout/app-shell";
import { DreamEditorForm } from "@/components/dreams/dream-editor-form";
import { getDreamById } from "@/lib/actions";
import type { Dream } from "@/lib/definitions";
import { notFound, useRouter } from "next/navigation";
import { Loader2, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function EditDreamPage({ params }: { params: { id: string } }) {
  const resolvedParams = use(params); // Unwrap params
  const [dream, setDream] = useState<Dream | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchDream() {
      const fetchedDream = await getDreamById(resolvedParams.id); // Use resolvedParams.id
      if (fetchedDream) {
        setDream(fetchedDream);
      } else {
        notFound();
      }
      setIsLoading(false);
    }
    fetchDream();
  }, [resolvedParams.id]); // Use resolvedParams.id in dependency array

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex justify-center items-center h-full">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </AppShell>
    );
  }

  if (!dream) {
    // Should be handled by notFound, but as a fallback
    return (
      <AppShell>
        <p>Dream not found.</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto">
         <div className="mb-6 flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            {/* Use resolvedParams.id for link construction */}
            <Link href={`/dreams/${resolvedParams.id}`} aria-label="Back to Dream View">
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="font-headline text-3xl md:text-4xl font-bold">Edit Dream</h1>
        </div>
        <Separator className="my-6" />
        {/* Pass resolvedParams.id if DreamEditorForm needed it, but it uses dream.id.
            The onFormSubmit callback uses resolvedParams.id for navigation. */}
        <DreamEditorForm dream={dream} onFormSubmit={() => router.push(`/dreams/${resolvedParams.id}`)} />
      </div>
    </AppShell>
  );
}
