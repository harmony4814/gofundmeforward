import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, Profile } from "@/types";

interface StoredUser {
 id: string;
 email: string;
 password: string;
 name: string;
 role: "user" | "admin";
 createdAt: string;
}

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

const USERS_KEY = "ff_users";
const SESSION_KEY = "ff_session";

const DEFAULT_ADMIN: StoredUser = {
 id: "admin-001",
 email: "admin@gofundme.com",
 password: "Admin123!",
 name: "Admin",
 role: "admin",
 createdAt: "2024-01-01T00:00:00.000Z",
};

function getUsers(): StoredUser[] {
 if (typeof window === "undefined") return [DEFAULT_ADMIN];
 try {
  const raw = localStorage.getItem(USERS_KEY);
  const users: StoredUser[] = raw ? JSON.parse(raw) : [];
  if (!users.find((u) => u.email === DEFAULT_ADMIN.email)) {
   users.push(DEFAULT_ADMIN);
  }
  return users;
 } catch {
  return [DEFAULT_ADMIN];
 }
}

function saveUsers(users: StoredUser[]) {
 localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getSession(): StoredUser | null {
 if (typeof window === "undefined") return null;
 try {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
 } catch {
  return null;
 }
}

function setSession(user: StoredUser | null) {
 if (user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
 } else {
  localStorage.removeItem(SESSION_KEY);
 }
}

function toUser(u: StoredUser): User {
 return {
  id: u.id,
  email: u.email,
  name: u.name,
  avatar: null,
  bio: null,
  location: null,
  phone: null,
  role: u.role,
  emailVerified: true,
  twoFactorEnabled: false,
  createdAt: u.createdAt,
  updatedAt: u.createdAt,
 };
}

function toProfile(u: StoredUser): Profile {
 return {
  userId: u.id,
  displayName: u.name,
  avatar: null,
  bio: null,
  location: null,
  website: null,
  socialLinks: null,
  totalRaised: 0,
  totalDonated: 0,
  campaignCount: 0,
  donationCount: 0,
 };
}

export const useAuthStore = create<AuthState>()(
 persist(
  (set) => ({
   user: null,
   profile: null,
   isLoading: true,

   login: async (email, password) => {
    const users = getUsers();
    const found = users.find(
     (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) return { success: false, error: "Invalid email or password" };

    const user = toUser(found);
    const profile = toProfile(found);
    setSession(found);
    set({ user, profile, isLoading: false });
    return { success: true };
   },

   register: async (name, email, password) => {
    const users = getUsers();
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
     return { success: false, error: "An account with this email already exists" };
    }

    const newUser: StoredUser = {
     id: `user-${Date.now()}`,
     email,
     password,
     name,
     role: "user",
     createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    const user = toUser(newUser);
    const profile = toProfile(newUser);
    setSession(newUser);
    set({ user, profile, isLoading: false });
    return { success: true };
   },

   logout: async () => {
    setSession(null);
    set({ user: null, profile: null, isLoading: false });
   },

   loadUser: async () => {
    try {
     const session = getSession();
     if (!session) {
      set({ user: null, profile: null, isLoading: false });
      return;
     }
     const users = getUsers();
     const current = users.find((u) => u.id === session.id);
     if (!current) {
      setSession(null);
      set({ user: null, profile: null, isLoading: false });
      return;
     }
     set({ user: toUser(current), profile: toProfile(current), isLoading: false });
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
