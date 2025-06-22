
// app/edit/[id]/page.tsx
import { AppShell } from "@/components/layout/app-shell";
import { DreamEditorForm } from "@/components/dreams/dream-editor-form";
import { getDreamById } from "@/lib/actions";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

// Define the type for the component's props
interface EditDreamPageProps {
  params: {
    id: string;
  };
}

export default async function EditDreamPage({ params }: EditDreamPageProps) {
  let dream;
  try {
    dream = await getDreamById(params.id);
  } catch (error) {
    console.error(`Error fetching dream with ID ${params.id}:`, error);
    // In a real application, you might log this error to an external service
    // and/or show a more specific error message to the user.
    notFound(); // Treat any fetch error as "not found" for simplicity here
  }

  if (!dream) {
    notFound(); // If the dream truly doesn't exist
  }

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-4 py-8 md:px-6"> {/* Added padding */}
        <div className="mb-6 flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/dreams/${params.id}`} aria-label="Back to Dream View">
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="font-headline text-3xl md:text-4xl font-bold">Edit Dream</h1>
        </div>
        <Separator className="my-6" />
        {/* Pass the fetched dream to the client component */}
        <DreamEditorForm dream={dream} />
      </div>
    </AppShell>
  );
}
