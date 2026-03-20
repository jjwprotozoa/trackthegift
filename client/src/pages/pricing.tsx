import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import { useLocation, Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { PerplexityAttribution } from "@/components/PerplexityAttribution";
import { Gift, Check, ArrowLeft, Sun, Moon, Zap, Crown, Building2 } from "lucide-react";

interface Plan {
  id: string;
  name: string;
  price: number;
  interval?: string;
  trackLimit: number;
  features: string[];
}

const planIcons: Record<string, typeof Gift> = {
  free: Gift,
  pro: Crown,
  business: Building2,
  single: Zap,
};

export default function Pricing() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const { data: plans, isLoading } = useQuery<Plan[]>({
    queryKey: ["/api/plans"],
  });

  function handleSelectPlan(planId: string) {
    if (!user) {
      navigate("/register");
      return;
    }
    // Stripe integration placeholder
    toast({
      title: "Coming soon",
      description: "Stripe checkout will be integrated here. For now, enjoy the free plan.",
    });
  }

  const subscriptionPlans = plans?.filter((p) => p.id !== "single") || [];
  const singlePlan = plans?.find((p) => p.id === "single");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Gift className="w-5 h-5 text-primary" />
            <span className="font-semibold text-sm" style={{ fontFamily: "'Cabinet Grotesk', var(--font-sans)" }}>
              Track The Gift
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-muted transition-colors"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              data-testid="button-pricing-theme-toggle"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            {user ? (
              <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} data-testid="button-back-dashboard">
                Dashboard
              </Button>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => navigate("/login")} data-testid="button-login-pricing">
                Log in
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-lg mb-10">
          <Link href="/" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="w-3 h-3" /> Back to home
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2" style={{ fontFamily: "'Cabinet Grotesk', var(--font-sans)" }}>
            Choose your plan
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Start free with 2 trackers. Upgrade anytime, or pay per track.
          </p>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-border/50">
                <CardContent className="p-5 space-y-3">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-4 w-32" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                  <Skeleton className="h-9 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {/* Subscription plans */}
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              {subscriptionPlans.map((plan) => {
                const isPopular = plan.id === "pro";
                const isCurrent = user?.plan === plan.id;
                const PlanIcon = planIcons[plan.id] || Gift;

                return (
                  <Card
                    key={plan.id}
                    className={`relative border-border/50 ${isPopular ? "ring-2 ring-primary border-primary/30" : ""}`}
                  >
                    {isPopular && (
                      <div className="absolute -top-2.5 left-4">
                        <Badge className="text-xs">Most popular</Badge>
                      </div>
                    )}
                    <CardContent className="p-5 pt-6">
                      <div className="flex items-center gap-2 mb-3">
                        <PlanIcon className="w-4 h-4 text-primary" />
                        <h3 className="font-semibold text-base">{plan.name}</h3>
                      </div>
                      <div className="flex items-baseline gap-1 mb-1">
                        <span className="text-3xl font-bold tracking-tight" style={{ fontFamily: "'Cabinet Grotesk', var(--font-sans)" }}>
                          ${plan.price}
                        </span>
                        {plan.interval && (
                          <span className="text-muted-foreground text-sm">/{plan.interval}</span>
                        )}
                      </div>
                      <p className="text-muted-foreground text-xs mb-4">
                        {plan.trackLimit === -1 ? "Unlimited trackers" : `${plan.trackLimit} active trackers`}
                      </p>
                      <ul className="space-y-2 mb-5">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-center gap-2 text-sm">
                            <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        className="w-full"
                        variant={isPopular ? "default" : "outline"}
                        size="sm"
                        disabled={isCurrent}
                        onClick={() => handleSelectPlan(plan.id)}
                        data-testid={`button-select-plan-${plan.id}`}
                      >
                        {isCurrent ? "Current plan" : plan.price === 0 ? "Get started" : "Subscribe"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Single track option */}
            {singlePlan && (
              <div className="p-5 rounded-lg border border-primary/20 bg-primary/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center text-primary mt-0.5">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-0.5">
                      Single Track — ${singlePlan.price}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      No subscription needed. Pay once for a single tracking page. Active for 30 days.
                    </p>
                    <ul className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                      {singlePlan.features.map((f) => (
                        <li key={f} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Check className="w-3 h-3 text-primary" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0"
                  onClick={() => handleSelectPlan("single")}
                  data-testid="button-select-single"
                >
                  Buy single track
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="border-t border-border/40 py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-center">
          <PerplexityAttribution />
        </div>
      </footer>
    </div>
  );
}
