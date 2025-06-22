
import { AppHeader } from "@/components/layout/header";
import { HeroSection } from "@/components/landing/hero-section";
import dynamic from 'next/dynamic';
import { Skeleton } from "@/components/ui/skeleton";

const SectionSkeleton = () => <div className="h-[50vh] w-full bg-background" />;

const AiAssistantSection = dynamic(() => import('@/components/landing/ai-assistant-section').then(mod => mod.AiAssistantSection), { loading: () => <SectionSkeleton /> });
const DashboardPeekSection = dynamic(() => import('@/components/landing/dashboard-peek-section').then(mod => mod.DashboardPeekSection), { loading: () => <SectionSkeleton /> });
const FamilyTreeSection = dynamic(() => import('@/components/landing/family-tree-section').then(mod => mod.FamilyTreeSection), { loading: () => <SectionSkeleton /> });
const SubscriptionSection = dynamic(() => import('@/components/landing/subscription-section').then(mod => mod.SubscriptionSection), { loading: () => <SectionSkeleton /> });
const TestimonialsSection = dynamic(() => import('@/components/landing/testimonials-section').then(mod => mod.TestimonialsSection), { loading: () => <SectionSkeleton /> });
const Footer = dynamic(() => import('@/components/landing/footer').then(mod => mod.Footer), { loading: () => <SectionSkeleton /> });


export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <AppHeader />
      <main className="flex-grow">
        <HeroSection />
        <AiAssistantSection />
        <DashboardPeekSection />
        <FamilyTreeSection />
        <SubscriptionSection />
        <TestimonialsSection />
        <Footer />
      </main>
    </div>
  );
}
