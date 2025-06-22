
import { Card, CardContent } from "@/components/ui/card";

export function TestimonialsSection() {
  return (
    <section className="py-20 md:py-32 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-card">
              <CardContent className="pt-6">
                  <p className="text-lg italic mb-4">"Feels like I’ve visualized my thoughts for the first time.”</p>
                  <p className="font-semibold text-right text-primary">– Priya, India</p>
              </CardContent>
          </Card>
          <Card className="bg-card">
              <CardContent className="pt-6">
                  <p className="text-lg italic mb-4">“The family tree feature will be a blessing for our legacy.”</p>
                  <p className="font-semibold text-right text-primary">– James, USA</p>
              </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
