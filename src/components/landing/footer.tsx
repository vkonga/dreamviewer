
import Link from "next/link";
import { Twitter, Instagram, Youtube, Languages } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border/50 py-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
            <div className="flex justify-center gap-6 mb-6">
                <Link href="#" className="hover:text-primary">About</Link>
                <Link href="#" className="hover:text-primary">Terms</Link>
                <Link href="#" className="hover:text-primary">Privacy</Link>
            </div>
            <div className="flex justify-center gap-6 mb-8">
                <Link href="#" aria-label="Instagram"><Instagram className="h-6 w-6 hover:text-primary"/></Link>
                <Link href="#" aria-label="Twitter"><Twitter className="h-6 w-6 hover:text-primary"/></Link>
                <Link href="#" aria-label="Youtube"><Youtube className="h-6 w-6 hover:text-primary"/></Link>
            </div>
            <div className="flex justify-center items-center gap-2 mb-8">
                <Languages className="h-5 w-5"/>
                <select className="bg-transparent border-none text-muted-foreground hover:text-primary focus:ring-0">
                    <option>English</option>
                    <option>Español</option>
                    <option>Français</option>
                </select>
            </div>
            <p>© Dream View, 2025</p>
        </div>
    </footer>
  );
}
