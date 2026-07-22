import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, Profile } from "@/types";

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  mockLogin: (email: string, password: string) => { success: boolean; error?: string };
  mockLogout: () => void;
  login: (user: User, profile: Profile) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setProfile: (profile: Profile) => void;
  setLoading: (loading: boolean) => void;
}

const MOCK_USERS: Record<string, { password: string; user: User; profile: Profile }> = {
  "admin@fundrise.com": {
    password: "admin123",
    user: {
      id: "usr_admin_001",
      email: "admin@fundrise.com",
      name: "Admin User",
      avatar: null,
      bio: "Platform administrator",
      location: "New York, USA",
      phone: "+1234567890",
      role: "admin",
      emailVerified: true,
      twoFactorEnabled: false,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
    profile: {
      userId: "usr_admin_001",
      displayName: "Admin User",
      avatar: null,
      bio: "Platform administrator",
      location: "New York, USA",
      website: null,
      socialLinks: null,
      totalRaised: 0,
      totalDonated: 0,
      campaignCount: 0,
      donationCount: 0,
    },
  },
  "user@fundrise.com": {
    password: "user123",
    user: {
      id: "usr_user_001",
      email: "user@fundrise.com",
      name: "John Doe",
      avatar: null,
      bio: "Regular user",
      location: "London, UK",
      phone: "+4412345678",
      role: "user",
      emailVerified: true,
      twoFactorEnabled: false,
      createdAt: "2024-06-15T00:00:00Z",
      updatedAt: "2024-06-15T00:00:00Z",
    },
    profile: {
      userId: "usr_user_001",
      displayName: "John Doe",
      avatar: null,
      bio: "Regular user",
      location: "London, UK",
      website: null,
      socialLinks: null,
      totalRaised: 0,
      totalDonated: 150,
      campaignCount: 0,
      donationCount: 3,
    },
  },
};

function setAuthCookie(user: User) {
  const cookieValue = JSON.stringify({ id: user.id, email: user.email, role: user.role });
  document.cookie = `mock-auth=${encodeURIComponent(cookieValue)}; path=/; max-age=${60 * 60 * 24 * 7}`;
}

function clearAuthCookie() {
  document.cookie = "mock-auth=; path=/; max-age=0";
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      profile: null,
      isLoading: false,
      mockLogin: (email, password) => {
        const entry = MOCK_USERS[email.toLowerCase()];
        if (!entry) return { success: false, error: "No account found with this email" };
        if (entry.password !== password) return { success: false, error: "Incorrect password" };
        set({ user: entry.user, profile: entry.profile, isLoading: false });
        setAuthCookie(entry.user);
        return { success: true };
      },
      mockLogout: () => {
        set({ user: null, profile: null, isLoading: false });
        clearAuthCookie();
      },
      login: (user, profile) => set({ user, profile, isLoading: false }),
      logout: () => {
        set({ user: null, profile: null, isLoading: false });
        clearAuthCookie();
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
