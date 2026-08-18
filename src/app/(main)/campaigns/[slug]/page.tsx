"use client"

import { use, useMemo, useState, useCallback, useEffect } from "react"
import { motion } from "framer-motion"
import { notFound } from "next/navigation"
import {
  CampaignHero,
  CampaignStory,
  CampaignUpdates,
  CampaignComments,
  CampaignDonationsSection,
  CampaignSummaryCard,
  StickySummaryCard,
  StickyDonateCard,
  RelatedCampaigns,
  type DonationItem,
} from "@/components/shared/CampaignDetailComponents"
import { DonateModal } from "@/components/donation/DonateModal"
import { mockCampaigns } from "@/lib/data"
import { useCampaignStore } from "@/store/campaign-store"

export default function CampaignDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const userCampaigns = useCampaignStore((s) => s.userCampaigns)
  const fetchCampaignBySlug = useCampaignStore((s) => s.fetchCampaignBySlug)
  const fetchCampaigns = useCampaignStore((s) => s.fetchCampaigns)
  const [dbCampaign, setDbCampaign] = useState<typeof mockCampaigns[number] | null>(null)

  useEffect(() => {
    fetchCampaigns()
    if (mockCampaigns.some((c) => c.slug === slug)) return
    fetchCampaignBySlug(slug).then((c) => {
      if (c) setDbCampaign(c)
    })
  }, [slug, fetchCampaignBySlug, fetchCampaigns])

  const campaign = useMemo(() => {
    return (
      mockCampaigns.find((c) => c.slug === slug) ??
      userCampaigns.find((c) => c.slug === slug) ??
      dbCampaign
    )
  }, [slug, userCampaigns, dbCampaign])

  if (!campaign) {
    notFound()
  }

  const [donateModalOpen, setDonateModalOpen] = useState(false)
  const [raised, setRaised] = useState(campaign.raised)
  const [donorCount, setDonorCount] = useState(campaign.donorCount)
  const [donations, setDonations] = useState<DonationItem[]>([
    {
      id: "mock-1",
      donorName: "Sarah M.",
      amount: 150,
      currency: "USD",
      message: "Sending love and prayers. You got this!",
      anonymous: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "mock-2",
      donorName: null,
      amount: 50,
      currency: "USD",
      message: "Keep fighting!",
      anonymous: true,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "mock-3",
      donorName: "James Wilson",
      amount: 200,
      currency: "USD",
      message: "Happy to help. Stay strong!",
      anonymous: false,
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "mock-4",
      donorName: "Emily Chen",
      amount: 75,
      currency: "USD",
      message: null,
      anonymous: false,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "mock-5",
      donorName: null,
      amount: 500,
      currency: "USD",
      message: "Praying for a full recovery.",
      anonymous: true,
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    },
  ])

  const handleDonationSuccess = useCallback(
    (donation: DonationItem) => {
      setRaised((prev) => prev + donation.amount)
      setDonorCount((prev) => prev + 1)
      setDonations((prev) => [donation, ...prev])
    },
    []
  )

  const allCampaigns = useCampaignStore((s) => s.allCampaigns)
  const allStoreCampaigns = useMemo(
    () => [...mockCampaigns, ...userCampaigns, ...allCampaigns],
    [userCampaigns, allCampaigns]
  )

  const relatedCampaigns = useMemo(
    () =>
      allStoreCampaigns
        .filter((c) => c.categorySlug === campaign.categorySlug && c.id !== campaign.id)
        .slice(0, 3),
    [allStoreCampaigns, campaign]
  )

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      <CampaignHero campaign={campaign} />

      {/* Small curved white divider - subtle arc transition below the title */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
        className="relative z-10 -mt-4 w-full"
      >
        <svg
          viewBox="0 0 1440 24"
          preserveAspectRatio="none"
          focusable="false"
          fill="#ffffff"
          className="pointer-events-none block h-5 w-full"
        >
          <path d="M0,20 C360,-4 1080,-4 1440,20 L1440,24 L0,24 Z" />
        </svg>
      </motion.div>

      {/* Fundraising Summary - immediately below the curve */}
      <StickySummaryCard>
        <CampaignSummaryCard
          campaign={campaign}
          raised={raised}
          donorCount={donorCount}
          latestDonation={donations[0]}
          onDonate={() => setDonateModalOpen(true)}
        />
      </StickySummaryCard>

      {/* Our Story + Content */}
      <div className="relative z-10 mx-auto mt-8 max-w-7xl px-4 sm:mt-10 sm:px-6 lg:mt-10 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <div className="space-y-8">
            <CampaignStory campaign={campaign} />
            <CampaignDonationsSection donations={donations} currency={campaign.currency} />
            <CampaignUpdates />
            <CampaignComments />
          </div>
          <div>
            <StickyDonateCard
              campaign={campaign}
              raised={raised}
              donorCount={donorCount}
              onDonate={() => setDonateModalOpen(true)}
            />
          </div>
        </div>

        <RelatedCampaigns campaigns={relatedCampaigns} />
      </div>

      <DonateModal
        isOpen={donateModalOpen}
        onClose={() => setDonateModalOpen(false)}
        campaign={{
          id: campaign.id,
          title: campaign.title,
          slug: campaign.slug,
          goal: campaign.goal,
          raised,
          currency: campaign.currency,
          coverImage: campaign.coverImage,
        }}
        onSuccess={handleDonationSuccess}
      />
    </div>
  )
}
