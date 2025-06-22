
import { BrainCircuit, ImageIcon, MessagesSquare, CalendarClock } from "lucide-react";

export function AiAssistantSection() {
  return (
    <section id="ai-assistant" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-4">Meet Your Dream Assistant</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
          Your personal AI assistant helps you organize your dreams, generate stunning visuals, create guided memories, and assist with life planning.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="flex flex-col items-center">
            <BrainCircuit className="h-12 w-12 text-secondary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Smart Suggestions</h3>
          </div>
          <div className="flex flex-col items-center">
            <ImageIcon className="h-12 w-12 text-secondary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Dream-to-Image</h3>
          </div>
          <div className="flex flex-col items-center">
            <MessagesSquare className="h-12 w-12 text-secondary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Personalized Guidance</h3>
          </div>
          <div className="flex flex-col items-center">
            <CalendarClock className="h-12 w-12 text-secondary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Dream Planner</h3>
          </div>
        </div>
      </div>
    </section>
  );
}
