import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getDreams, getCurrentUser } from "@/lib/actions"; 
import Link from "next/link";
import { PlusCircle, ListChecks, Edit3, Sun, CalendarDays, Calendar, Layers } from "lucide-react";
import type { Dream } from "@/lib/definitions";
import { format, isToday, isSameWeek, isSameMonth, isSameYear } from 'date-fns';
import { redirect } from "next/navigation";
import dynamic from 'next/dynamic';
import { InsightsWidgetSkeleton } from "@/components/dashboard/insights-widget-skeleton";

const InsightsWidget = dynamic(() => import('@/components/dashboard/insights-widget').then(mod => mod.InsightsWidget), {
  loading: () => <InsightsWidgetSkeleton />,
});

async function DreamFeed({ dreams }: { dreams: Dream[] }) {
  const recentDreams = dreams.slice(0, 5); 

  if (recentDreams.length === 0) {
    return (
      <Card className="bg-card/80 shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Recent Dreams</CardTitle>
          <CardDescription>Your latest dream entries will appear here.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">You haven't logged any dreams yet.</p>
          <Button asChild className="mt-4">
            <Link href="/dreams/new"><PlusCircle className="mr-2 h-4 w-4" /> Log Your First Dream</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/80 shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">Recent Dreams</CardTitle>
        <CardDescription>A quick look at your latest dream entries.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {recentDreams.map((dream) => (
            <li key={dream.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <Link href={`/dreams/${dream.id}`} className="block">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-primary">{dream.title}</h3>
                  <span className="text-sm text-muted-foreground">{format(new Date(dream.date), "PPP")}</span>
                </div>
                <p className="text-sm text-foreground/80 truncate mt-1">{dream.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button variant="outline" asChild>
          <Link href="/dreams">View All Dreams</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}


async function DreamFrequencyWidget({ dreams }: { dreams: Dream[] }) {
  const now = new Date();

  const countToday = dreams.filter(dream => isToday(new Date(dream.date))).length;
  const countThisWeek = dreams.filter(dream => isSameWeek(new Date(dream.date), now, { weekStartsOn: 1 })).length; // Week starts on Monday
  const countThisMonth = dreams.filter(dream => isSameMonth(new Date(dream.date), now)).length;
  const countThisYear = dreams.filter(dream => isSameYear(new Date(dream.date), now)).length;

  const stats = [
    { label: "Today", count: countToday, icon: Sun, hint: "Dreams logged today" },
    { label: "This Week", count: countThisWeek, icon: CalendarDays, hint: "Dreams logged this week (Mon-Sun)" },
    { label: "This Month", count: countThisMonth, icon: Calendar, hint: "Dreams logged this calendar month" },
    { label: "This Year", count: countThisYear, icon: Layers, hint: "Dreams logged this calendar year" },
  ];

  if (dreams.length === 0) {
    return (
      <Card className="bg-card/80 shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Dream Frequency</CardTitle>
          <CardDescription>How often you're recording your dreams.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Log some dreams to see your dream frequency statistics.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/80 shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">Dream Frequency</CardTitle>
        <CardDescription>How often you're recording your dreams.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center justify-center p-4 bg-muted/30 rounded-lg shadow-md space-y-2 text-center h-full">
              <stat.icon className="w-10 h-10 text-accent mb-2" />
              <p className="text-3xl font-bold text-primary">{stat.count}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth');
  }
  
  const username = user.username || "Dreamer";
  const dreams = await getDreams(); // Fetch dreams once for the page

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="font-headline text-4xl font-bold">Welcome, {username}!</h1>
            <p className="text-lg text-muted-foreground">Ready to explore your dreams?</p>
          </div>
          <Button size="lg" asChild className="shadow-md hover:shadow-lg transition-shadow">
            <Link href="/dreams/new">
              <PlusCircle className="mr-2 h-5 w-5" /> Log a New Dream
            </Link>
          </Button>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <DreamFeed dreams={dreams} />
          <InsightsWidget dreams={dreams} />
        </div>

        <DreamFrequencyWidget dreams={dreams} />

        <Card className="bg-card/80 shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Button variant="outline" asChild className="justify-start text-left h-auto py-3">
              <Link href="/dreams">
                <ListChecks className="mr-3 h-6 w-6 text-accent" />
                <div>
                  <p className="font-semibold">View All Dreams</p>
                  <p className="text-xs text-muted-foreground">Browse your entire journal</p>
                </div>
              </Link>
            </Button>
            <Button variant="outline" asChild className="justify-start text-left h-auto py-3">
              <Link href="/profile">
                <Edit3 className="mr-3 h-6 w-6 text-accent" />
                <div>
                  <p className="font-semibold">Edit Profile</p>
                  <p className="text-xs text-muted-foreground">Update your account details</p>
                </div>
              </Link>
            </Button>
             <Button variant="outline" asChild className="justify-start text-left h-auto py-3">
              <Link href="/dreams/new">
                <PlusCircle className="mr-3 h-6 w-6 text-accent" />
                <div>
                  <p className="font-semibold">Log New Dream</p>
                  <p className="text-xs text-muted-foreground">Quickly add a new entry</p>
                </div>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
