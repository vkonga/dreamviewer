
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AlertTriangle } from 'lucide-react';

const dreamViewFaviconSvgDataUri = "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 32 32%22><rect width=%2232%22 height=%2232%22 fill=%22%230f172a%22/><path d=%22M21 7 A10 10 0 1 0 21 25 A7 7 0 1 1 21 7 Z%22 fill=%22%23d1c4e9%22/><path d=%22M23 7 L23 9 M22 8 L24 8%22 stroke=%22%23a0d8ef%22 stroke-width=%221.5%22 stroke-linecap=%22round%22/></svg>";

export const metadata: Metadata = {
  title: 'Dream View - Your Dreams, Visualized.',
  description: 'Imagine, Create, and Connect — with the power of AI and a touch of magic.',
  icons: {
    icon: [
      { url: dreamViewFaviconSvgDataUri, type: 'image/svg+xml', sizes: 'any' }
    ],
  },
};

function MissingEnvVarsError() {
  return (
    <html lang="en" className="dark">
      <head>
        <title>Configuration Error - DreamView</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col bg-background text-foreground">
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <AlertTriangle className="w-16 h-16 text-destructive mb-6" />
          <h1 className="text-3xl font-bold text-destructive mb-4">Server Configuration Error</h1>
          <p className="text-lg mb-2">The application is missing essential or invalid Supabase configuration.</p>
          <p className="text-muted-foreground mb-6 max-w-md">
            For this application to work, you must set the following environment variables in your hosting provider's settings (e.g., Google Cloud Secret Manager for Firebase App Hosting). Ensure the URL is a valid, full URL.
          </p>
          <div className="bg-muted p-4 rounded-md text-left text-sm inline-block mb-6">
            <pre><code>
              NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co<br/>
              NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
            </code></pre>
          </div>
          <p className="text-muted-foreground">
            You can find these values in your Supabase project dashboard under Project Settings &gt; API.
            After setting the secrets, you must **redeploy** your application.
          </p>
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Go to Supabase Dashboard
          </a>
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
  let isValidSupabaseConfig = false;
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseUrl.trim() !== '' && supabaseAnonKey && supabaseAnonKey.trim() !== '') {
      // Try to construct a URL object to validate the URL format.
      // This will throw a TypeError if the URL is not valid.
      new URL(supabaseUrl);
      isValidSupabaseConfig = true;
    }
  } catch (error) {
    // If new URL() fails, the config is invalid.
    console.error("RootLayout Supabase config validation failed:", error);
    isValidSupabaseConfig = false;
  }

  if (!isValidSupabaseConfig) {
    return <MissingEnvVarsError />;
  }

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
