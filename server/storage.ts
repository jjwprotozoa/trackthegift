import {
  type User, type InsertUser, users,
  type Tracker, type InsertTracker, trackers,
  type Subscription, type InsertSubscription, subscriptions,
} from "@shared/schema";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { eq, and } from "drizzle-orm";

const sqlite = new Database("data.db");
sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite);

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPlan(id: number, plan: string, credits: number): Promise<void>;

  // Trackers
  getTracker(id: number): Promise<Tracker | undefined>;
  getTrackerBySlug(slug: string): Promise<Tracker | undefined>;
  getTrackersByUser(userId: number): Promise<Tracker[]>;
  createTracker(tracker: InsertTracker): Promise<Tracker>;
  updateTrackerStatus(id: number, status: string, message: string): Promise<void>;
  deleteTracker(id: number): Promise<void>;

  // Subscriptions
  getSubscription(userId: number): Promise<Subscription | undefined>;
  createSubscription(sub: InsertSubscription): Promise<Subscription>;
  updateSubscription(id: number, plan: string, status: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    return db.select().from(users).where(eq(users.id, id)).get();
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return db.select().from(users).where(eq(users.username, username)).get();
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return db.select().from(users).where(eq(users.email, email)).get();
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    return db.insert(users).values(insertUser).returning().get();
  }

  async updateUserPlan(id: number, plan: string, credits: number): Promise<void> {
    db.update(users).set({ plan, trackCredits: credits }).where(eq(users.id, id)).run();
  }

  async getTracker(id: number): Promise<Tracker | undefined> {
    return db.select().from(trackers).where(eq(trackers.id, id)).get();
  }

  async getTrackerBySlug(slug: string): Promise<Tracker | undefined> {
    return db.select().from(trackers).where(eq(trackers.slug, slug)).get();
  }

  async getTrackersByUser(userId: number): Promise<Tracker[]> {
    return db.select().from(trackers).where(eq(trackers.userId, userId)).all();
  }

  async createTracker(tracker: InsertTracker): Promise<Tracker> {
    return db.insert(trackers).values({
      ...tracker,
      status: "created",
      isActive: true,
      createdAt: new Date().toISOString(),
    }).returning().get();
  }

  async updateTrackerStatus(id: number, status: string, message: string): Promise<void> {
    db.update(trackers).set({ status, statusMessage: message }).where(eq(trackers.id, id)).run();
  }

  async deleteTracker(id: number): Promise<void> {
    db.delete(trackers).where(eq(trackers.id, id)).run();
  }

  async getSubscription(userId: number): Promise<Subscription | undefined> {
    return db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).get();
  }

  async createSubscription(sub: InsertSubscription): Promise<Subscription> {
    return db.insert(subscriptions).values(sub).returning().get();
  }

  async updateSubscription(id: number, plan: string, status: string): Promise<void> {
    db.update(subscriptions).set({ plan, status }).where(eq(subscriptions.id, id)).run();
  }
}

export const storage = new DatabaseStorage();
