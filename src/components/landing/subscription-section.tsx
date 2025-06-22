
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

export function SubscriptionSection() {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <Card className="max-w-md mx-auto text-center bg-gradient-to-br from-secondary/20 to-primary/20 border-2 border-secondary/50 shadow-2xl shadow-secondary/10">
          <CardHeader>
            <CardTitle className="font-headline text-4xl">Unlock the Full Dream Experience</CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              <span className="text-4xl font-bold text-white">$4.99</span> / month
            </CardDescription>
          </CardHeader>
          <CardContent className="text-left space-y-3">
            <p className="flex items-center gap-2"><Star className="h-5 w-5 text-primary"/> Unlimited Image Generation</p>
            <p className="flex items-center gap-2"><Star className="h-5 w-5 text-primary"/> Access to Dream Assistant</p>
            <p className="flex items-center gap-2"><Star className="h-5 w-5 text-primary"/> Personalized Dashboard</p>
            <p className="flex items-center gap-2"><Star className="h-5 w-5 text-primary"/> Early Access to Family Tree</p>
            <p className="flex items-center gap-2"><Star className="h-5 w-5 text-primary"/> Cloud Memory Storage</p>
          </CardContent>
          <CardFooter>
             <Button size="lg" className="w-full text-lg mt-4 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-primary/40">Subscribe Now</Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
