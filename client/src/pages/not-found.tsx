import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Gift, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mx-auto mb-4">
          <Gift className="w-6 h-6 text-muted-foreground" />
        </div>
        <h1 className="font-semibold text-lg mb-1">Page not found</h1>
        <p className="text-sm text-muted-foreground mb-4">
          The page you're looking for doesn't exist.
        </p>
        <Button variant="outline" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
            Back to home
          </Link>
        </Button>
      </div>
    </div>
  );
}
