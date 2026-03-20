import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from "react";
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
    .maybeSingle();

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
  // Flag to suppress onAuthStateChange during manual login/register
  const manualAuthRef = useRef(false);

  useEffect(() => {
    // Get initial session (page refresh / returning user)
    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      setSession(s);
      if (s?.user) {
        const profile = await fetchProfile(s.user.id);
        setUser(profile);
      }
      setIsLoading(false);
    });

    // Listen for auth changes (token refresh, sign out from another tab)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, s) => {
        // Skip if login/register is handling state manually
        if (manualAuthRef.current) return;

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
    manualAuthRef.current = true;
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);

      if (data.user && data.session) {
        setSession(data.session);
        const profile = await fetchProfile(data.user.id);
        setUser(profile);
      }
    } finally {
      manualAuthRef.current = false;
    }
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    manualAuthRef.current = true;
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } },
      });
      if (error) throw new Error(error.message);

      if (data.user) {
        // Create user profile row first
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

        // Now fetch the profile and set state
        setSession(data.session);
        const profile = await fetchProfile(data.user.id);
        setUser(profile);
      }
    } finally {
      manualAuthRef.current = false;
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
