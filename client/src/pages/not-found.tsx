import { Link } from "wouter";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8">
        <div className="flex justify-center">
          <AlertCircle className="h-24 w-24 text-destructive/20" />
        </div>
        <h1 className="text-4xl font-display font-bold text-foreground">404 Page Not Found</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          The destination you are looking for seems to be off the map.
        </p>
        <Link href="/" className="inline-block px-8 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
          Return Home
        </Link>
      </div>
    </div>
  );
}
