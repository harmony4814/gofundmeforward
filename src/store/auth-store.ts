import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, Profile } from "@/types";
import { createClient } from "@/lib/supabase/client";

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
}

async function fetchProfile(supabase: ReturnType<typeof createClient>, userId: string): Promise<Profile | null> {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (!data) return null;

  const { count: campaignCount } = await supabase
    .from("campaigns")
    .select("*", { count: "exact", head: true })
    .eq("creator_id", userId);

  const { count: donationCount } = await supabase
    .from("donations")
    .select("*", { count: "exact", head: true })
    .eq("donor_email", data.email);

  const { data: raisedData } = await supabase
    .from("campaigns")
    .select("raised")
    .eq("creator_id", userId);

  const { data: donatedData } = await supabase
    .from("donations")
    .select("amount")
    .eq("donor_email", data.email);

  return {
    userId: data.id,
    displayName: data.full_name || "",
    avatar: data.avatar_url,
    bio: data.bio,
    location: null,
    website: null,
    socialLinks: null,
    totalRaised: raisedData?.reduce((sum, c) => sum + (Number(c.raised) || 0), 0) || 0,
    totalDonated: donatedData?.reduce((sum, d) => sum + (Number(d.amount) || 0), 0) || 0,
    campaignCount: campaignCount || 0,
    donationCount: donationCount || 0,
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      profile: null,
      isLoading: true,

      login: async (email, password) => {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) return { success: false, error: error.message };

        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();

        const user: User = {
          id: data.user.id,
          email: data.user.email || "",
          name: profileData?.full_name || data.user.email || "",
          avatar: profileData?.avatar_url || null,
          bio: profileData?.bio || null,
          location: null,
          phone: null,
          role: (profileData?.role as "user" | "admin") || "user",
          emailVerified: !!data.user.confirmed_at,
          twoFactorEnabled: false,
          createdAt: data.user.created_at,
          updatedAt: data.user.updated_at || data.user.created_at,
        };

        const profile = await fetchProfile(supabase, data.user.id);
        set({ user, profile, isLoading: false });
        return { success: true };
      },

      register: async (name, email, password) => {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
          },
        });

        if (error) return { success: false, error: error.message };

        if (data.user) {
          const user: User = {
            id: data.user.id,
            email: data.user.email || "",
            name,
            avatar: null,
            bio: null,
            location: null,
            phone: null,
            role: "user",
            emailVerified: false,
            twoFactorEnabled: false,
            createdAt: data.user.created_at,
            updatedAt: data.user.created_at,
          };
          set({ user, profile: null, isLoading: false });
        }

        return { success: true };
      },

      logout: async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        set({ user: null, profile: null, isLoading: false });
      },

      loadUser: async () => {
        try {
          const supabase = createClient();
          const { data: { user: sbUser } } = await supabase.auth.getUser();

          if (!sbUser) {
            set({ user: null, profile: null, isLoading: false });
            return;
          }

          const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", sbUser.id)
            .single();

          const user: User = {
            id: sbUser.id,
            email: sbUser.email || "",
            name: profileData?.full_name || sbUser.email || "",
            avatar: profileData?.avatar_url || null,
            bio: profileData?.bio || null,
            location: null,
            phone: null,
            role: (profileData?.role as "user" | "admin") || "user",
            emailVerified: !!sbUser.confirmed_at,
            twoFactorEnabled: false,
            createdAt: sbUser.created_at,
            updatedAt: sbUser.updated_at || sbUser.created_at,
          };

          const profile = await fetchProfile(supabase, sbUser.id);
          set({ user, profile, isLoading: false });
        } catch {
          set({ user: null, profile: null, isLoading: false });
        }
      },

      setUser: (user) => set({ user }),
      setProfile: (profile) => set({ profile }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
      }),
    }
  )
);
