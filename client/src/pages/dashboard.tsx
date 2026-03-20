import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { PerplexityAttribution } from "@/components/PerplexityAttribution";
import type { Tracker } from "@shared/schema";
import {
  Gift, Plus, ExternalLink, Trash2, Copy, Sun, Moon,
  LogOut, Package, Egg, TreePine, Cake, Heart, Baby,
  MapPin, Clock, CheckCircle2, Loader2, Sparkles
} from "lucide-react";

const themeOptions = [
  { value: "easter", label: "Easter", icon: Egg },
  { value: "christmas", label: "Christmas", icon: TreePine },
  { value: "birthday", label: "Birthday", icon: Cake },
  { value: "valentines", label: "Valentine's", icon: Heart },
  { value: "babyshower", label: "Baby Shower", icon: Baby },
  { value: "generic", label: "Generic Gift", icon: Gift },
];

const statusConfig: Record<string, { icon: typeof Package; color: string; label: string }> = {
  created: { icon: Package, color: "text-muted-foreground", label: "Created" },
  in_transit: { icon: MapPin, color: "text-amber-500", label: "In Transit" },
  delivered: { icon: CheckCircle2, color: "text-emerald-500", label: "Delivered" },
};

function TrackerCard({ tracker, onDelete }: { tracker: Tracker; onDelete: (id: number) => void }) {
  const { toast } = useToast();
  const status = statusConfig[tracker.status] || statusConfig.created;
  const StatusIcon = status.icon;
  const themeOpt = themeOptions.find((t) => t.value === tracker.theme);
  const ThemeIcon = themeOpt?.icon || Gift;

  function copyLink() {
    const url = `${window.location.origin}/#/t/${tracker.slug}`;
    navigator.clipboard.writeText(url).then(() => {
      toast({ title: "Link copied", description: "Tracking link copied to clipboard" });
    }).catch(() => {
      toast({ title: "Copy failed", description: url });
    });
  }

  return (
    <Card className="border-border/50 group">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="shrink-0 w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
              <ThemeIcon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-medium text-sm truncate" data-testid={`text-tracker-name-${tracker.id}`}>{tracker.name}</h3>
              {tracker.recipientName && (
                <p className="text-xs text-muted-foreground truncate">For {tracker.recipientName}</p>
              )}
            </div>
          </div>
          <Badge variant="secondary" className="shrink-0 gap-1 text-xs">
            <StatusIcon className={`w-3 h-3 ${status.color}`} />
            {status.label}
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
          {tracker.origin && (
            <span className="flex items-center gap-1 truncate">
              <MapPin className="w-3 h-3 shrink-0" /> {tracker.origin}
            </span>
          )}
          {tracker.destination && (
            <span className="flex items-center gap-1 truncate">
              to {tracker.destination}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs flex-1 gap-1.5"
            onClick={copyLink}
            data-testid={`button-copy-link-${tracker.id}`}
          >
            <Copy className="w-3 h-3" /> Copy link
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs gap-1.5"
            onClick={() => window.open(`/#/t/${tracker.slug}`, "_blank")}
            data-testid={`button-view-tracker-${tracker.id}`}
          >
            <ExternalLink className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(tracker.id)}
            data-testid={`button-delete-tracker-${tracker.id}`}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CreateTrackerDialog({ userId }: { userId: number }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [waybill, setWaybill] = useState("");
  const [carrier, setCarrier] = useState("dhl");
  const [theme, setTheme] = useState("easter");
  const [recipientName, setRecipientName] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const { toast } = useToast();

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/trackers", {
        userId,
        name,
        waybill,
        carrier,
        theme,
        recipientName: recipientName || null,
        origin: origin || null,
        destination: destination || null,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trackers"] });
      setOpen(false);
      setName("");
      setWaybill("");
      setRecipientName("");
      setOrigin("");
      setDestination("");
      toast({ title: "Tracker created", description: "Your magical tracking page is live." });
    },
    onError: (err: Error) => {
      toast({ title: "Failed to create tracker", description: err.message, variant: "destructive" });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5" data-testid="button-create-tracker">
          <Plus className="w-4 h-4" /> New tracker
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Create a tracker
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate();
          }}
          className="space-y-3 mt-2"
        >
          <div className="space-y-1.5">
            <Label className="text-sm">Tracker name</Label>
            <Input
              placeholder="Easter surprise for the kids"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              data-testid="input-tracker-name"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-sm">Waybill number</Label>
              <Input
                placeholder="4293808584"
                value={waybill}
                onChange={(e) => setWaybill(e.target.value)}
                required
                data-testid="input-waybill"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Carrier</Label>
              <Select value={carrier} onValueChange={setCarrier}>
                <SelectTrigger data-testid="select-carrier">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dhl">DHL</SelectItem>
                  <SelectItem value="fedex">FedEx</SelectItem>
                  <SelectItem value="ups">UPS</SelectItem>
                  <SelectItem value="usps">USPS</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm">Theme</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger data-testid="select-theme">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {themeOptions.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm">Recipient name (optional)</Label>
            <Input
              placeholder="Emma, Olivia, Sophia & Ava"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              data-testid="input-recipient"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-sm">Origin (optional)</Label>
              <Input
                placeholder="Cape Town, SA"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                data-testid="input-origin"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Destination (optional)</Label>
              <Input
                placeholder="Orlando, FL"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                data-testid="input-destination"
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={createMutation.isPending} data-testid="button-submit-tracker">
            {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create tracker"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  if (!user) {
    navigate("/login");
    return null;
  }

  const { data: trackersData, isLoading } = useQuery<Tracker[]>({
    queryKey: ["/api/trackers", `?userId=${user.id}`],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/trackers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trackers"] });
      toast({ title: "Tracker deleted" });
    },
  });

  const trackersList = trackersData || [];
  const activeCount = trackersList.filter((t) => t.isActive).length;

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
              data-testid="button-dashboard-theme-toggle"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Badge variant="outline" className="text-xs gap-1 hidden sm:flex">
              <Package className="w-3 h-3" />
              {user.plan === "free" ? "Free" : user.plan === "pro" ? "Pro" : "Business"}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground gap-1"
              onClick={() => { logout(); navigate("/"); }}
              data-testid="button-logout"
            >
              <LogOut className="w-3.5 h-3.5" /> Log out
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats row */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-lg font-bold tracking-tight" style={{ fontFamily: "'Cabinet Grotesk', var(--font-sans)" }}>
              Your trackers
            </h1>
            <p className="text-sm text-muted-foreground">
              {activeCount} active{user.plan === "free" ? ` of ${user.trackCredits} allowed` : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => navigate("/pricing")}
              data-testid="button-upgrade"
            >
              Upgrade plan
            </Button>
            <CreateTrackerDialog userId={user.id} />
          </div>
        </div>

        {/* Trackers grid */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-border/50">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-2.5">
                    <Skeleton className="w-8 h-8 rounded-md" />
                    <div className="space-y-1 flex-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-3 w-40" />
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : trackersList.length === 0 ? (
          <div className="flex flex-col items-center text-center py-16">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
              <Gift className="w-6 h-6" />
            </div>
            <h2 className="font-semibold mb-1">No trackers yet</h2>
            <p className="text-sm text-muted-foreground max-w-xs mb-4">
              Create your first tracker to start sharing magical tracking pages with your loved ones.
            </p>
            <CreateTrackerDialog userId={user.id} />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trackersList.map((tracker) => (
              <TrackerCard
                key={tracker.id}
                tracker={tracker}
                onDelete={(id) => deleteMutation.mutate(id)}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-border/40 py-6 mt-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-center">
          <PerplexityAttribution />
        </div>
      </footer>
    </div>
  );
}
