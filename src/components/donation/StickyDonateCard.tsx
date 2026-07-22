"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ShareButtons } from "@/components/shared/ShareButtons"
import { ProgressBar } from "@/components/shared/ProgressBar"
import {
  cn,
  formatCurrency,
  calculateProgress,
  getDaysRemaining,
} from "@/lib/utils"
import {
  Users,
  Clock,
  Heart,
  Share2,
  ChevronUp,
} from "lucide-react"

interface StickyDonateCardProps {
  campaign: {
    title: string
    goal: number
    raised: number
    donorCount: number
    deadline: string
    slug: string
    currency?: string
    coverImage?: string
  }
  onDonate?: () => void
}

export function StickyDonateCard({ campaign, onDonate }: StickyDonateCardProps) {
  const [showShare, setShowShare] = useState(false)
  const [isSticky, setIsSticky] = useState(false)

  const currency = campaign.currency || "USD"
  const progress = calculateProgress(campaign.raised, campaign.goal)
  const daysLeft = getDaysRemaining(campaign.deadline)
  const campaignUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/campaign/${campaign.slug}`
      : ""

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 300)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      {/* Desktop Sticky */}
      <div className="hidden lg:block">
        <div className="sticky top-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="overflow-hidden">
              {campaign.coverImage && (
                <div className="relative h-32 w-full">
                  <img
                    src={campaign.coverImage}
                    alt={campaign.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
              )}

              <div className="p-5 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold text-green-600">
                      {formatCurrency(campaign.raised, currency)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      of {formatCurrency(campaign.goal, currency)}
                    </span>
                  </div>
                  <ProgressBar value={progress} size="md" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">
                      {progress}% funded
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-2.5">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Donors</p>
                      <p className="text-sm font-semibold">{campaign.donorCount}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-2.5">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Days Left</p>
                      <p className="text-sm font-semibold">{daysLeft}</p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={onDonate}
                  size="lg"
                  className="w-full h-12 bg-green-600 hover:bg-green-700 text-white text-base font-semibold gap-2"
                >
                  <Heart className="h-5 w-5" />
                  Donate Now
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2"
                  onClick={() => setShowShare(!showShare)}
                >
                  <Share2 className="h-4 w-4" />
                  Share Campaign
                  <ChevronUp
                    className={cn(
                      "h-3 w-3 transition-transform",
                      showShare ? "" : "rotate-180"
                    )}
                  />
                </Button>

                {showShare && campaignUrl && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ShareButtons
                      url={campaignUrl}
                      title={campaign.title}
                      variant="compact"
                    />
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Mobile Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex items-center gap-3 px-4 py-3 max-w-lg">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-green-600 truncate">
              {formatCurrency(campaign.raised, currency)}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              of {formatCurrency(campaign.goal, currency)} &middot; {daysLeft}d left
            </p>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <Button
            onClick={onDonate}
            className="shrink-0 bg-green-600 hover:bg-green-700 text-white h-11 px-6 gap-2"
          >
            <Heart className="h-4 w-4" />
            Donate
          </Button>
        </div>
      </div>
    </>
  )
}
