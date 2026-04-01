import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-foreground">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">
            Page not found
          </h2>
        </div>

        <p className="text-muted-foreground">
          Sorry, the page you&apos;re looking for doesn&apos;t exist. It might have
          been moved or deleted.
        </p>

        <div className="flex gap-4 justify-center pt-4">
          <Button
            asChild
            variant="outline"
            className="border-border hover:bg-secondary gap-2"
          >
            <Link href="/">
              <ArrowLeft className="w-4 h-4" />
              Go back
            </Link>
          </Button>
          <Button
            asChild
            className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
          >
            <Link href="/">
              <Home className="w-4 h-4" />
              Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
