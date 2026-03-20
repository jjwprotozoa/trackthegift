import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PerplexityAttribution } from "@/components/PerplexityAttribution";
import {
  Gift, Egg, TreePine, Cake, Heart, Baby,
  Package, Truck, MapPin, CheckCircle2, Sparkles
} from "lucide-react";

interface PublicTracker {
  name: string;
  theme: string;
  recipientName: string | null;
  status: string;
  statusMessage: string | null;
  origin: string | null;
  destination: string | null;
}

const themeConfig: Record<string, {
  icon: typeof Gift;
  bg: string;
  accent: string;
  title: string;
  emoji: string;
}> = {
  easter: {
    icon: Egg,
    bg: "from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30",
    accent: "text-pink-500",
    title: "The Easter Bunny is on the way",
    emoji: "hop hop hop",
  },
  christmas: {
    icon: TreePine,
    bg: "from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30",
    accent: "text-emerald-500",
    title: "Santa's sleigh is loaded",
    emoji: "ho ho ho",
  },
  birthday: {
    icon: Cake,
    bg: "from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30",
    accent: "text-amber-500",
    title: "A birthday surprise is coming",
    emoji: "surprise incoming",
  },
  valentines: {
    icon: Heart,
    bg: "from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30",
    accent: "text-rose-500",
    title: "Something special is on its way",
    emoji: "sent with love",
  },
  babyshower: {
    icon: Baby,
    bg: "from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/30",
    accent: "text-sky-500",
    title: "A special delivery is coming",
    emoji: "almost there",
  },
  generic: {
    icon: Gift,
    bg: "from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30",
    accent: "text-violet-500",
    title: "A gift is on its way",
    emoji: "it's coming",
  },
};

const stages = [
  { key: "created", label: "Gift prepared", icon: Package, desc: "Your gift has been wrapped and is ready to go" },
  { key: "in_transit", label: "On the move", icon: Truck, desc: "Your gift is traveling to you right now" },
  { key: "delivered", label: "Arrived", icon: CheckCircle2, desc: "Your gift has been delivered" },
];

export default function TrackerPublic() {
  const params = useParams<{ slug: string }>();

  const { data: tracker, isLoading, error } = useQuery<PublicTracker>({
    queryKey: [`/api/track/${params.slug}`],
    enabled: !!params.slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-border/50">
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-12 w-12 rounded-lg mx-auto" />
            <Skeleton className="h-6 w-48 mx-auto" />
            <Skeleton className="h-4 w-32 mx-auto" />
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !tracker) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mx-auto mb-4">
            <Gift className="w-6 h-6 text-muted-foreground" />
          </div>
          <h1 className="font-semibold text-lg mb-1">Tracker not found</h1>
          <p className="text-sm text-muted-foreground">This tracking link may have expired or doesn't exist.</p>
        </div>
      </div>
    );
  }

  const config = themeConfig[tracker.theme] || themeConfig.generic;
  const ThemeIcon = config.icon;
  const currentStageIndex = stages.findIndex((s) => s.key === tracker.status);

  return (
    <div className={`min-h-screen bg-gradient-to-b ${config.bg}`}>
      <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${config.accent} bg-white/80 dark:bg-white/10 shadow-sm mb-4`}>
            <ThemeIcon className="w-7 h-7" />
          </div>
          <h1
            className="text-xl sm:text-2xl font-bold tracking-tight mb-1"
            style={{ fontFamily: "'Cabinet Grotesk', var(--font-sans)" }}
            data-testid="text-tracker-title"
          >
            {config.title}
          </h1>
          {tracker.recipientName && (
            <p className="text-base font-medium mb-1" data-testid="text-recipient">
              {tracker.recipientName}
            </p>
          )}
          <p className={`text-sm ${config.accent} font-medium`}>{config.emoji}</p>
        </div>

        {/* Route info */}
        {(tracker.origin || tracker.destination) && (
          <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground mb-8">
            {tracker.origin && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {tracker.origin}
              </span>
            )}
            {tracker.origin && tracker.destination && (
              <span className="text-xs">to</span>
            )}
            {tracker.destination && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {tracker.destination}
              </span>
            )}
          </div>
        )}

        {/* Status stages */}
        <Card className="border-border/50 bg-white/60 dark:bg-white/5 backdrop-blur-sm">
          <CardContent className="p-5">
            <div className="space-y-0">
              {stages.map((stage, idx) => {
                const isCompleted = idx <= currentStageIndex;
                const isCurrent = idx === currentStageIndex;
                const StageIcon = stage.icon;
                const isLast = idx === stages.length - 1;

                return (
                  <div key={stage.key} className="flex gap-3">
                    {/* Timeline */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                          isCompleted
                            ? `bg-primary text-primary-foreground ${isCurrent ? "ring-2 ring-primary/30 ring-offset-2 ring-offset-background" : ""}`
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <StageIcon className="w-4 h-4" />
                      </div>
                      {!isLast && (
                        <div className={`w-0.5 h-8 my-1 ${idx < currentStageIndex ? "bg-primary" : "bg-border"}`} />
                      )}
                    </div>

                    {/* Content */}
                    <div className={`pb-4 ${!isLast ? "" : ""}`}>
                      <p className={`font-medium text-sm ${isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
                        {stage.label}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {isCurrent && tracker.statusMessage ? tracker.statusMessage : stage.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Powered by */}
        <div className="text-center mt-8 space-y-2">
          <p className="text-xs text-muted-foreground">
            Tracked with <Sparkles className="w-3 h-3 inline" /> by{" "}
            <span className="font-medium">Track The Gift</span>
          </p>
          <div className="flex justify-center">
            <PerplexityAttribution />
          </div>
        </div>
      </div>
    </div>
  );
}
