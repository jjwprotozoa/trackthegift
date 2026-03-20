import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { useTheme } from "@/lib/theme";
import { PerplexityAttribution } from "@/components/PerplexityAttribution";
import {
  Gift, Egg, TreePine, Cake, Heart, Baby,
  Package, Globe, Palette, Shield, Zap, Users,
  Sun, Moon, Check, ArrowRight, Sparkles, MapPin
} from "lucide-react";

const occasions = [
  { icon: Egg, name: "Easter", color: "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400", desc: "Easter Bunny delivers" },
  { icon: TreePine, name: "Christmas", color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400", desc: "Santa's on his way" },
  { icon: Cake, name: "Birthday", color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400", desc: "Surprise incoming" },
  { icon: Heart, name: "Valentine's", color: "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400", desc: "Love is on its way" },
  { icon: Baby, name: "Baby Shower", color: "bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400", desc: "Special delivery" },
  { icon: Gift, name: "Any Occasion", color: "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400", desc: "Make it magical" },
];

const features = [
  { icon: Package, title: "Real Parcel Tracking", desc: "Connect any waybill from DHL, FedEx, UPS, and more. Real-time status updates." },
  { icon: Palette, title: "Themed Experience", desc: "Easter bunnies, Santa's sleigh, birthday confetti. Each tracker gets a magical skin." },
  { icon: Globe, title: "Shareable Link", desc: "One unique URL per tracker. Share with kids, family, or friends. No app required." },
  { icon: Shield, title: "Private & Secure", desc: "Waybill numbers stay hidden. Recipients only see the magical tracking page." },
];

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    interval: "forever",
    trackLimit: "2 active trackers",
    features: ["All themes included", "Basic tracking page", "Email notifications"],
    cta: "Get Started Free",
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$4.99",
    interval: "/month",
    trackLimit: "10 active trackers",
    features: ["All themes included", "Custom branding", "Priority support", "Analytics dashboard"],
    cta: "Start Pro Trial",
    popular: true,
  },
  {
    id: "business",
    name: "Business",
    price: "$14.99",
    interval: "/month",
    trackLimit: "Unlimited trackers",
    features: ["All themes included", "Custom branding", "White-label option", "API access", "Dedicated support"],
    cta: "Contact Sales",
    popular: false,
  },
];

function Logo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-label="Track The Gift logo" className="shrink-0">
      <rect x="4" y="8" width="24" height="18" rx="3" stroke="currentColor" strokeWidth="2" className="text-primary" />
      <path d="M4 14h24" stroke="currentColor" strokeWidth="2" className="text-primary" />
      <path d="M16 8v18" stroke="currentColor" strokeWidth="2" className="text-primary" />
      <path d="M16 4l-3 4h6l-3-4z" fill="currentColor" className="text-primary" />
      <circle cx="16" cy="14" r="2.5" fill="currentColor" className="text-primary" />
    </svg>
  );
}

export default function Landing() {
  const [, navigate] = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="font-semibold text-base tracking-tight" style={{ fontFamily: "'Cabinet Grotesk', var(--font-sans)" }}>
              Track The Gift
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-muted transition-colors"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              data-testid="button-theme-toggle"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/login")} data-testid="button-login">
              Log in
            </Button>
            <Button size="sm" onClick={() => navigate("/register")} data-testid="button-signup">
              Sign up
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div className="max-w-2xl">
            <Badge variant="secondary" className="mb-4 text-xs font-medium gap-1.5">
              <Sparkles className="w-3 h-3" /> Now tracking for every occasion
            </Badge>
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] mb-4"
              style={{ fontFamily: "'Cabinet Grotesk', var(--font-sans)" }}
            >
              Turn parcel tracking into
              <span className="text-primary block">a magical experience</span>
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-lg mb-8 leading-relaxed">
              Create themed, kid-friendly tracking pages for your parcels. Easter bunnies, Santa's sleigh, birthday surprises. Share a link, spread the joy.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" onClick={() => navigate("/register")} className="gap-2" data-testid="button-hero-signup">
                Start tracking free <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
                }}
                data-testid="button-hero-pricing"
              >
                View pricing
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Occasions */}
      <section className="py-16 sm:py-20 border-t border-border/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-lg mb-10">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-2" style={{ fontFamily: "'Cabinet Grotesk', var(--font-sans)" }}>
              A theme for every occasion
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Each tracker gets its own themed page. Pick the occasion and we handle the magic.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {occasions.map((occ) => (
              <div
                key={occ.name}
                className="group flex flex-col items-center text-center p-4 rounded-lg border border-border/50 bg-card hover:border-primary/30 transition-colors"
              >
                <div className={`w-10 h-10 rounded-md flex items-center justify-center mb-3 ${occ.color}`}>
                  <occ.icon className="w-5 h-5" />
                </div>
                <span className="font-medium text-sm mb-0.5">{occ.name}</span>
                <span className="text-muted-foreground text-xs">{occ.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 sm:py-20 bg-muted/30 border-t border-border/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-lg mb-10">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-2" style={{ fontFamily: "'Cabinet Grotesk', var(--font-sans)" }}>
              Three steps to magic
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              From waybill to wonder in under a minute.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Enter your waybill", desc: "Paste the tracking number from any supported carrier. DHL, FedEx, UPS, and more." },
              { step: "2", title: "Pick a theme", desc: "Choose Easter, Christmas, Birthday, or any occasion. Add a recipient name for a personal touch." },
              { step: "3", title: "Share the magic", desc: "Get a unique link. Send it to your kids, family, or friends. They track the gift without seeing the waybill." },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-20 border-t border-border/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-lg mb-10">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-2" style={{ fontFamily: "'Cabinet Grotesk', var(--font-sans)" }}>
              Built for delight
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Every feature designed to make gift-giving more exciting.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((feat) => (
              <Card key={feat.title} className="border-border/50">
                <CardContent className="p-5 flex gap-4">
                  <div className="shrink-0 w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                    <feat.icon className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">{feat.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feat.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pay-per-track callout */}
      <section className="py-12 sm:py-16 bg-muted/30 border-t border-border/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-lg border border-primary/20 bg-primary/5">
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center text-primary mt-0.5">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-0.5">Just need one track?</h3>
                <p className="text-muted-foreground text-sm">
                  No subscription needed. Pay $2.99 per tracker for one-off occasions. Active for 30 days.
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="shrink-0" onClick={() => navigate("/register")} data-testid="button-single-track">
              Try a single track
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 sm:py-20 border-t border-border/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-lg mb-10">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-2" style={{ fontFamily: "'Cabinet Grotesk', var(--font-sans)" }}>
              Simple pricing
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Start free, upgrade when you need more. Or pay per track.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative border-border/50 ${plan.popular ? "ring-2 ring-primary border-primary/30" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-2.5 left-4">
                    <Badge className="text-xs">Most popular</Badge>
                  </div>
                )}
                <CardContent className="p-5 pt-6">
                  <div className="mb-4">
                    <h3 className="font-semibold text-base mb-1">{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold tracking-tight" style={{ fontFamily: "'Cabinet Grotesk', var(--font-sans)" }}>
                        {plan.price}
                      </span>
                      <span className="text-muted-foreground text-sm">{plan.interval}</span>
                    </div>
                    <p className="text-muted-foreground text-xs mt-1">{plan.trackLimit}</p>
                  </div>
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
                    variant={plan.popular ? "default" : "outline"}
                    size="sm"
                    onClick={() => navigate("/register")}
                    data-testid={`button-plan-${plan.id}`}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Logo />
            <span>Track The Gift</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <PerplexityAttribution />
          </div>
        </div>
      </footer>
    </div>
  );
}
