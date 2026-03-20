import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertTrackerSchema } from "@shared/schema";
import crypto from "crypto";

function generateSlug(): string {
  return crypto.randomBytes(4).toString("hex");
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const parsed = insertUserSchema.parse(req.body);
      const existing = await storage.getUserByEmail(parsed.email);
      if (existing) {
        return res.status(400).json({ error: "Email already registered" });
      }
      const user = await storage.createUser(parsed);
      return res.json({ user: { id: user.id, username: user.username, email: user.email, plan: user.plan, trackCredits: user.trackCredits } });
    } catch (e: any) {
      return res.status(400).json({ error: e.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      return res.json({ user: { id: user.id, username: user.username, email: user.email, plan: user.plan, trackCredits: user.trackCredits } });
    } catch (e: any) {
      return res.status(400).json({ error: e.message });
    }
  });

  // Tracker routes
  app.get("/api/trackers", async (req, res) => {
    const userId = parseInt(req.query.userId as string);
    if (!userId) return res.status(400).json({ error: "userId required" });
    const items = await storage.getTrackersByUser(userId);
    return res.json(items);
  });

  app.post("/api/trackers", async (req, res) => {
    try {
      const data = insertTrackerSchema.parse({
        ...req.body,
        slug: generateSlug(),
      });
      const tracker = await storage.createTracker(data);
      return res.json(tracker);
    } catch (e: any) {
      return res.status(400).json({ error: e.message });
    }
  });

  app.get("/api/trackers/:id", async (req, res) => {
    const tracker = await storage.getTracker(parseInt(req.params.id));
    if (!tracker) return res.status(404).json({ error: "Not found" });
    return res.json(tracker);
  });

  app.patch("/api/trackers/:id/status", async (req, res) => {
    const { status, message } = req.body;
    await storage.updateTrackerStatus(parseInt(req.params.id), status, message);
    return res.json({ success: true });
  });

  app.delete("/api/trackers/:id", async (req, res) => {
    await storage.deleteTracker(parseInt(req.params.id));
    return res.json({ success: true });
  });

  // Public tracker page
  app.get("/api/track/:slug", async (req, res) => {
    const tracker = await storage.getTrackerBySlug(req.params.slug);
    if (!tracker) return res.status(404).json({ error: "Tracker not found" });
    return res.json({
      name: tracker.name,
      theme: tracker.theme,
      recipientName: tracker.recipientName,
      status: tracker.status,
      statusMessage: tracker.statusMessage,
      origin: tracker.origin,
      destination: tracker.destination,
    });
  });

  // Subscription routes
  app.get("/api/subscription/:userId", async (req, res) => {
    const sub = await storage.getSubscription(parseInt(req.params.userId));
    return res.json(sub || { plan: "free", status: "active" });
  });

  app.post("/api/subscription", async (req, res) => {
    try {
      const sub = await storage.createSubscription(req.body);
      return res.json(sub);
    } catch (e: any) {
      return res.status(400).json({ error: e.message });
    }
  });

  // Plans info
  app.get("/api/plans", async (_req, res) => {
    return res.json([
      {
        id: "free",
        name: "Free",
        price: 0,
        trackLimit: 2,
        features: ["2 active trackers", "All themes", "Basic tracking page", "Email notifications"],
      },
      {
        id: "pro",
        name: "Pro",
        price: 4.99,
        interval: "month",
        trackLimit: 10,
        features: ["10 active trackers", "All themes", "Custom branding", "Priority support", "Analytics dashboard"],
      },
      {
        id: "business",
        name: "Business",
        price: 14.99,
        interval: "month",
        trackLimit: -1,
        features: ["Unlimited trackers", "All themes", "Custom branding", "White-label option", "API access", "Dedicated support"],
      },
      {
        id: "single",
        name: "Single Track",
        price: 2.99,
        interval: "one-time",
        trackLimit: 1,
        features: ["1 tracking page", "Any theme", "Active for 30 days", "Email notifications"],
      },
    ]);
  });

  return httpServer;
}
