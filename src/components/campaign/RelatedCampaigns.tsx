"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProgressBar } from "@/components/shared/ProgressBar"
import {
  cn,
  formatCurrency,
  calculateProgress,
  getDaysRemaining,
  truncate,
} from "@/lib/utils"
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Clock,
  Users,
} from "lucide-react"
import Link from "next/link"

interface RelatedCampaign {
  id: string
  title: string
  slug: string
  coverImage?: string
  goal: number
  raised: number
  donorCount: number
  deadline: string
  currency?: string
  category?: string
}

interface RelatedCampaignsProps {
  campaigns: RelatedCampaign[]
  className?: string
}

export function RelatedCampaigns({
  campaigns,
  className,
}: RelatedCampaignsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return
    const amount = 320
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    })
  }

  if (campaigns.length === 0) return null

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Related Campaigns</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {campaigns.map((campaign, index) => {
          const progress = calculateProgress(campaign.raised, campaign.goal)
          const daysLeft = getDaysRemaining(campaign.deadline)

          return (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="w-[280px] shrink-0 snap-start"
            >
              <Link href={`/campaign/${campaign.slug}`}>
                <Card className="group overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5 h-full">
                  <div className="relative h-40 w-full overflow-hidden bg-muted">
                    {campaign.coverImage ? (
                      <img
                        src={campaign.coverImage}
                        alt={campaign.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Heart className="h-8 w-8 text-muted-foreground/30" />
                      </div>
                    )}
                    {campaign.category && (
                      <Badge
                        variant="secondary"
                        className="absolute top-2 left-2 bg-black/50 text-white border-0 backdrop-blur-sm text-[10px]"
                      >
                        {campaign.category}
                      </Badge>
                    )}
                  </div>

                  <CardContent className="p-4 space-y-3">
                    <h3 className="font-semibold line-clamp-2 text-sm leading-snug group-hover:text-green-600 transition-colors">
                      {campaign.title}
                    </h3>

                    <div className="space-y-2">
                      <div className="flex items-baseline justify-between text-xs">
                        <span className="font-semibold text-green-600">
                          {formatCurrency(campaign.raised, campaign.currency || "USD")}
                        </span>
                        <span className="text-muted-foreground">
                          of {formatCurrency(campaign.goal, campaign.currency || "USD")}
                        </span>
                      </div>
                      <ProgressBar value={progress} size="sm" />
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{campaign.donorCount} donors</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{daysLeft}d left</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
