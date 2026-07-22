"use client"

import { useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Badge as BadgeComponent } from "@/components/ui/badge"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { categories, mockCampaigns } from "@/lib/data"
import { CampaignCard } from "@/components/shared/CampaignCard"

export default function CategoryDetailPage() {
  const params = useParams()
  const categorySlug = params.category as string
  const [sortBy, setSortBy] = useState("newest")

  const category = categories.find((c) => c.slug === categorySlug)

  const filteredCampaigns = useMemo(() => {
    const campaigns = mockCampaigns.filter((c) => c.categorySlug === categorySlug)
    switch (sortBy) {
      case "most_funded":
        return [...campaigns].sort((a, b) => b.raised - a.raised)
      case "ending_soon":
        return [...campaigns].sort(
          (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        )
      case "most_popular":
        return [...campaigns].sort((a, b) => b.donorCount - a.donorCount)
      default:
        return [...campaigns].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
    }
  }, [categorySlug, sortBy])

  if (!category) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Category Not Found</h1>
          <p className="mt-2 text-gray-500">The category you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    )
  }

  const Icon = category.icon

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-[#052e16] via-[#14532d] to-[#166534] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#22c55e]/20">
              <Icon className="h-8 w-8 text-[#22c55e]" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                {category.name}
              </h1>
              <p className="mt-1 text-gray-300">{category.description}</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {filteredCampaigns.length} campaign{filteredCampaigns.length !== 1 ? "s" : ""} found
            </p>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v ?? "newest")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="most_funded">Most Funded</SelectItem>
                <SelectItem value="ending_soon">Ending Soon</SelectItem>
                <SelectItem value="most_popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredCampaigns.length > 0 ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCampaigns.map((campaign, i) => (
                <CampaignCard key={campaign.id} campaign={campaign} index={i} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <Icon className="mx-auto h-12 w-12 text-gray-300" />
              <h2 className="mt-4 text-xl font-semibold">No campaigns yet</h2>
              <p className="mt-2 text-gray-500">
                Be the first to start a campaign in this category!
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
