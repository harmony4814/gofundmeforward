"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { CampaignData } from "@/lib/data"

interface CampaignStoreState {
  userCampaigns: CampaignData[]
  addUserCampaign: (campaign: CampaignData) => void
  updateUserCampaign: (id: string, updates: Partial<CampaignData>) => void
  deleteUserCampaign: (id: string) => void
}

export const useCampaignStore = create<CampaignStoreState>()(
  persist(
    (set) => ({
      userCampaigns: [],

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
    }),
    {
      name: "fundrise-campaigns",
      storage: createJSONStorage(() => {
        if (typeof window !== "undefined") return localStorage
        return { getItem: () => null, setItem: () => {}, removeItem: () => {} }
      }),
    }
  )
)
