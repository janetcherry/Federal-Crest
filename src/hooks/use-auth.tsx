import { createContext, useContext, useEffect, useState, useRef } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/supabaseClient";

interface Profile {
  id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  is_admin?: boolean;
  country?: string;
  frozen?: boolean;
  email_notifications?: boolean;
  push_notifications?: boolean;
  sms_notifications?: boolean;
  alert_large_deposits?: boolean;
  alert_large_withdrawals?: boolean;
  alert_international?: boolean;
  language?: string;
  timezone?: string;
  email?: string;
  account_type?: string;
  co_owner_name?: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fetchingProfile = useRef(false);

  const fetchProfile = async (userId: string, userMetadata?: any) => {
    if (fetchingProfile.current) return;
    fetchingProfile.current = true;

    try {
      // First, try to get existing profile
      const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile(data as Profile);
        return;
      }

      // Profile doesn't exist – upsert from metadata
      console.log("Profile not found, upserting from metadata...");
      const metadata = userMetadata || {};
      const newProfile = {
        id: userId,
        first_name: metadata.first_name || "",
        last_name: metadata.last_name || "",
        phone: metadata.phone || "",
        email: metadata.email || "",
        street: metadata.address?.street || "",
        city: metadata.address?.city || "",
        state: metadata.address?.state || "",
        zip: metadata.address?.zip || "",
        country: metadata.address?.country || "",
        account_type: metadata.account_type || "single",
        co_owner_name: metadata.co_owner_name || null,
      };

      // ✅ Use upsert with onConflict to avoid 409 errors
      const { error: upsertError } = await supabase
          .from("profiles")
          .upsert(newProfile, { onConflict: "id" });

      if (upsertError) {
        console.error("Failed to upsert profile:", upsertError);
      } else {
        setProfile(newProfile as Profile);
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
    } finally {
      fetchingProfile.current = false;
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id, session.user.user_metadata);
      }
      setIsLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      // Only fetch profile if session exists and event is not a token refresh
      if (session?.user && event !== 'TOKEN_REFRESHED') {
        fetchProfile(session.user.id, session.user.user_metadata);
      } else if (!session) {
        setProfile(null);
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  const value = {
    session,
    user,
    profile,
    isLoading,
    isAuthenticated: !!user,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}