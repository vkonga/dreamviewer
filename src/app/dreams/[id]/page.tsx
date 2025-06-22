import { AppShell } from "@/components/layout/app-shell";
import { getDreamById } from "@/lib/actions";
import { notFound } from "next/navigation";
import { DreamViewClient } from "@/components/dreams/dream-view-client";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function DreamViewPage({ params }: PageProps) {
  const dream = await getDreamById(params.id);

  if (!dream) {
    notFound();
  }

  return (
    <AppShell>
      <DreamViewClient initialDream={dream} />
    </AppShell>
  );
}
