
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AlertTriangle } from 'lucide-react';
import { Literata } from 'next/font/google';

const literata = Literata({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

const dreamViewFaviconSvgDataUri = "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 32 32%22><rect width=%2232%22 height=%2232%22 fill=%22%23283593%22/><path d=%22M21 7 A10 10 0 1 0 21 25 A7 7 0 1 1 21 7 Z%22 fill=%22%23D1C4E9%22/><path d=%22M23 7 L23 9 M22 8 L24 8%22 stroke=%22%23B3E5FC%22 stroke-width=%221.5%22 stroke-linecap=%22round%22/></svg>";

export const metadata: Metadata = {
  title: 'DreamWeaver - Your Personal Dream Journal',
  description: 'AI-powered dream interpretations and a private journal to explore your subconscious.',
  icons: {
    icon: [
      { url: dreamViewFaviconSvgDataUri, type: 'image/svg+xml', sizes: 'any' }
    ],
  },
};

function MissingEnvVarsError() {
  return (
    <html lang="en" className={`${literata.variable} dark`}>
      <head>
        <title>Configuration Error - DreamWeaver</title>
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col bg-background text-foreground">
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <AlertTriangle className="w-16 h-16 text-destructive mb-6" />
          <h1 className="text-3xl font-bold text-destructive mb-4 font-headline">Server Configuration Error</h1>
          <p className="text-lg mb-2">The application is missing essential or invalid configuration.</p>
          <p className="text-muted-foreground mb-6 max-w-xl">
            For this application to work, you must set the following environment variables in your hosting provider's settings (e.g., Google Cloud Secret Manager for Firebase App Hosting).
          </p>
          <div className="bg-muted p-4 rounded-md text-left text-sm inline-block mb-6">
            <pre><code>
              NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co<br/>
              NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key<br/>
              GOOGLE_API_KEY=your-google-gemini-api-key
            </code></pre>
          </div>
           <p className="text-muted-foreground max-w-xl">
            You can find Supabase values in your project's API settings. The Google API key enables the AI Assistant and Image Generation features powered by Gemini. You can get your key from Google AI Studio. After setting the secrets, you must **redeploy** your application.
          </p>
           <div className="flex flex-col sm:flex-row gap-4 mt-6">
             <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Go to Supabase
            </a>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 border border-input text-base font-medium rounded-md shadow-sm text-foreground bg-background hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
            >
              Get Google Gemini Key
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let isValidConfig = false;
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const googleApiKey = process.env.GOOGLE_API_KEY;

    if (
      supabaseUrl && supabaseUrl.trim() !== '' &&
      supabaseAnonKey && supabaseAnonKey.trim() !== '' &&
      googleApiKey && googleApiKey.trim() !== ''
    ) {
      new URL(supabaseUrl);
      isValidConfig = true;
    }
  } catch (error) {
    console.error("RootLayout config validation failed:", error);
    isValidConfig = false;
  }

  if (!isValidConfig) {
    return <MissingEnvVarsError />;
  }

  return (
    <html lang="en" className={`${literata.variable} dark`}>
      <head />
      <body className="font-body antialiased min-h-screen flex flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
