import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { supabase, type DbUser } from "./supabase";
import type { Session } from "@supabase/supabase-js";

interface AuthUser {
  id: string;
  username: string;
  email: string;
  plan: string;
  trackCredits: number;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

async function fetchProfile(userId: string): Promise<AuthUser | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) return null;
  const profile = data as DbUser;
  return {
    id: profile.id,
    username: profile.username,
    email: profile.email,
    plan: profile.plan,
    trackCredits: profile.track_credits,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      setSession(s);
      if (s?.user) {
        const profile = await fetchProfile(s.user.id);
        setUser(profile);
      }
      setIsLoading(false);
    });

    // Listen for auth changes (e.g. token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, s) => {
        setSession(s);
        if (s?.user) {
          const profile = await fetchProfile(s.user.id);
          setUser(profile);
        } else {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);

    // Immediately fetch profile and set user state before returning
    // This prevents the race condition where navigate("/dashboard") fires
    // before onAuthStateChange has time to load the profile
    if (data.user) {
      setSession(data.session);
      const profile = await fetchProfile(data.user.id);
      setUser(profile);
    }
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });
    if (error) throw new Error(error.message);

    // Create user profile row and set state immediately
    if (data.user) {
      const { error: profileError } = await supabase.from("users").insert({
        id: data.user.id,
        username,
        email,
        plan: "free",
        track_credits: 2,
      });
      if (profileError) {
        console.error("Profile creation error:", profileError);
      }

      setSession(data.session);
      const profile = await fetchProfile(data.user.id);
      setUser(profile);
    }
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        login,
        register,
        logout,
        isAuthenticated: !!user && !!session,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
