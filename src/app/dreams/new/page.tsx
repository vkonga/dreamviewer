
import { AppShell } from "@/components/layout/app-shell";
import { DreamEditorForm } from "@/components/dreams/dream-editor-form";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NewDreamPage() {
  return (
    <AppShell>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dreams" aria-label="Back to Dream Journal">
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="font-headline text-3xl md:text-4xl font-bold">Log a New Dream</h1>
        </div>
        <Separator className="my-6" />
        <DreamEditorForm />
      </div>
    </AppShell>
  );
}
