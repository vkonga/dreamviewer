
import { AppShell } from "@/components/layout/app-shell";
import { DreamEditorForm } from "@/components/dreams/dream-editor-form";
import { getDreamById } from "@/lib/actions";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default async function EditDreamPage({ params }: { params: { id: string } }) {
  const dream = await getDreamById(params.id);

  if (!dream) {
    notFound();
  }

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto">
         <div className="mb-6 flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/dreams/${params.id}`} aria-label="Back to Dream View">
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="font-headline text-3xl md:text-4xl font-bold">Edit Dream</h1>
        </div>
        <Separator className="my-6" />
        <DreamEditorForm dream={dream} />
      </div>
    </AppShell>
  );
}
