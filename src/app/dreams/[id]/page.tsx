// app/dreams/[id]/page.tsx
import { AppShell } from "@/components/layout/app-shell";
import { getDreamById } from "@/lib/actions";
import { notFound } from "next/navigation";
import { DreamViewClient } from "@/components/dreams/dream-view-client";

// Define the type for the component's props
interface DreamViewPageProps {
  params: {
    id: string;
  };
}

export default async function DreamViewPage({ params }: DreamViewPageProps) {
  let dream;
  try {
    dream = await getDreamById(params.id);
  } catch (error) {
    console.error(`Error fetching dream with ID ${params.id}:`, error);
    notFound(); // Treat any fetch error as "not found"
  }

  if (!dream) {
    notFound(); // If the dream truly doesn't exist
  }

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-4 py-8 md:px-6"> {/* Added padding */}
        {/* Pass the fetched dream to the client component */}
        <DreamViewClient initialDream={dream} />
      </div>
    </AppShell>
  );
}
