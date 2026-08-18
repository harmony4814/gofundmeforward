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
  fetchCampaignBySlug: (slug: string) => Promise<CampaignData | null>
}

const CAMPAIGN_SELECT =
  "*, category:categories(name, slug, icon), user:profiles!campaigns_user_id_fkey(display_name, avatar)"

function mapDbCampaign(row: any): CampaignData {
  const categoryName =
    typeof row.category === "object" && row.category ? row.category.name : row.category || ""
  const categorySlug =
    typeof row.category === "object" && row.category
      ? row.category.slug
      : String(categoryName).toLowerCase().replace(/\s+/g, "-")
  const creatorName =
    typeof row.user === "object" && row.user
      ? row.user.display_name || ""
      : row.creator_name || ""
  const creatorAvatar =
    typeof row.user === "object" && row.user ? row.user.avatar : ""

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    shortDescription: row.short_description || row.description || "",
    fullStory: row.full_story || "",
    goal: Number(row.goal),
    raised: Number(row.raised),
    currency: row.currency || "USD",
    category: categoryName,
    categorySlug,
    country: row.country || "",
    beneficiaryName: row.beneficiary_name || creatorName,
    coverImage: row.cover_image || "",
    galleryImages: Array.isArray(row.gallery_images) ? row.gallery_images : row.gallery || [],
    videoUrl: row.video_url || null,
    deadline: row.deadline || "",
    status: row.status || "pending",
    tags: Array.isArray(row.tags) ? row.tags : [],
    donorCount: row.donor_count || 0,
    viewCount: row.view_count || 0,
    shareCount: 0,
    featured: row.featured || false,
    trending: false,
    creatorName,
    creatorAvatar,
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
        .select(CAMPAIGN_SELECT)
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
        .select(CAMPAIGN_SELECT)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (!error && data) {
        set({ userCampaigns: data.map(mapDbCampaign) })
      }
    },

    fetchCampaignBySlug: async (slug: string) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("campaigns")
        .select(CAMPAIGN_SELECT)
        .eq("slug", slug)
        .single()

      if (error || !data) {
        return null
      }
      return mapDbCampaign(data)
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