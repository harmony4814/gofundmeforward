import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark" | "system";

interface UIState {
  theme: Theme;
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  searchOpen: boolean;
  donationModalOpen: boolean;
  selectedCampaignId: string | null;
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  toggleSearch: () => void;
  setSearchOpen: (open: boolean) => void;
  openDonationModal: (campaignId: string) => void;
  closeDonationModal: () => void;
  closeAllModals: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: "system",
      sidebarOpen: false,
      mobileMenuOpen: false,
      searchOpen: false,
      donationModalOpen: false,
      selectedCampaignId: null,

      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleMobileMenu: () =>
        set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
      toggleSearch: () => set((state) => ({ searchOpen: !state.searchOpen })),
      setSearchOpen: (open) => set({ searchOpen: open }),
      openDonationModal: (campaignId) =>
        set({ donationModalOpen: true, selectedCampaignId: campaignId }),
      closeDonationModal: () =>
        set({ donationModalOpen: false, selectedCampaignId: null }),
      closeAllModals: () =>
        set({
          donationModalOpen: false,
          selectedCampaignId: null,
          searchOpen: false,
          mobileMenuOpen: false,
        }),
    }),
    {
      name: "ui-storage",
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
