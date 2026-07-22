"use client"

import { create } from "zustand"
import { createClient } from "@/lib/supabase/client"
import type { CampaignData } from "@/lib/data"

interface CampaignStoreState {
  userCampaigns: CampaignData[]
  allCampaigns: CampaignData[]
  isLoading: boolean
  addUserCampaign: (campaign: CampaignData) => void
  updateUserCampaign: (id: string, updates: Partial<CampaignData>) => void
  deleteUserCampaign: (id: string) => void
  fetchCampaigns: () => Promise<void>
  fetchUserCampaigns: (userId: string) => Promise<void>
}

function mapDbCampaign(row: any): CampaignData {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    shortDescription: row.description || "",
    fullStory: row.full_story || "",
    goal: Number(row.goal),
    raised: Number(row.raised),
    currency: "USD",
    category: row.category || "",
    categorySlug: (row.category || "").toLowerCase().replace(/\s+/g, "-"),
    country: row.country || "",
    beneficiaryName: row.creator_name || "",
    coverImage: row.cover_image || "",
    galleryImages: row.gallery || [],
    videoUrl: row.video_url || null,
    deadline: row.deadline || "",
    status: row.status || "pending",
    tags: [],
    donorCount: row.donors || 0,
    viewCount: 0,
    shareCount: 0,
    featured: row.featured || false,
    trending: false,
    creatorName: row.creator_name || "",
    creatorAvatar: "",
    createdAt: row.created_at,
  }
}

export const useCampaignStore = create<CampaignStoreState>()(
  (set, get) => ({
    userCampaigns: [],
    allCampaigns: [],
    isLoading: false,

    fetchCampaigns: async () => {
      set({ isLoading: true })
      const supabase = createClient()
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false })

      if (!error && data) {
        set({ allCampaigns: data.map(mapDbCampaign), isLoading: false })
      } else {
        set({ isLoading: false })
      }
    },

    fetchUserCampaigns: async (userId: string) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .eq("creator_id", userId)
        .order("created_at", { ascending: false })

      if (!error && data) {
        set({ userCampaigns: data.map(mapDbCampaign) })
      }
    },

    addUserCampaign: (campaign) =>
      set((state) => ({
        userCampaigns: [campaign, ...state.userCampaigns],
      })),

    updateUserCampaign: (id, updates) =>
      set((state) => ({
        userCampaigns: state.userCampaigns.map((c) =>
          c.id === id ? { ...c, ...updates } : c
        ),
      })),

    deleteUserCampaign: (id) =>
      set((state) => ({
        userCampaigns: state.userCampaigns.filter((c) => c.id !== id),
      })),
  })
)
