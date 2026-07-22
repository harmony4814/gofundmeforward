"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { MapPin, Users, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProgressBar } from "@/components/shared/ProgressBar"
import { formatCurrency, calculateProgress, getDaysRemaining } from "@/lib/utils"
import type { CampaignData } from "@/lib/data"

interface CampaignCardProps {
 campaign: CampaignData
 index?: number
}

export function CampaignCard({ campaign, index = 0 }: CampaignCardProps) {
 const progress = calculateProgress(campaign.raised, campaign.goal)
 const daysLeft = getDaysRemaining(campaign.deadline)

 return (
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.4, delay: index * 0.05 }}
 >
 <Link href={`/campaigns/${campaign.slug}`}>
 <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
    <div className="relative aspect-[16/10] overflow-hidden">
    <img
     src={campaign.coverImage}
     alt={campaign.title}
     className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
    />
 <div className="absolute left-3 top-3">
 <Badge className="bg-[#22c55e] text-white hover:bg-[#16a34a]">
 {campaign.category}
 </Badge>
 </div>
 {campaign.trending && (
 <div className="absolute right-3 top-3">
 <Badge className="bg-orange-500 text-white hover:bg-orange-600">
 Trending
 </Badge>
 </div>
 )}
 </div>
 <CardContent className="space-y-3 p-4">
 <h3 className="line-clamp-2 text-base font-semibold transition-colors group-hover:text-[#22c55e]">
 {campaign.title}
 </h3>
 <p className="line-clamp-2 text-sm text-gray-500">
 {campaign.shortDescription}
 </p>
 <ProgressBar value={progress} size="sm" />
 <div className="flex items-center justify-between text-sm">
 <div>
 <span className="font-semibold text-[#22c55e]">
 {formatCurrency(campaign.raised)}
 </span>
 <span className="text-gray-500">
 {" "}of {formatCurrency(campaign.goal)}
 </span>
 </div>
 <span className="font-medium text-[#22c55e]">{progress}%</span>
 </div>
 <div className="flex items-center justify-between text-xs text-gray-500">
 <div className="flex items-center gap-1">
 <Users className="h-3.5 w-3.5" />
 <span>{campaign.donorCount} donors</span>
 </div>
 <div className="flex items-center gap-1">
 <MapPin className="h-3.5 w-3.5" />
 <span>{campaign.country}</span>
 </div>
 <div className="flex items-center gap-1">
 <Clock className="h-3.5 w-3.5" />
 <span>{daysLeft}d left</span>
 </div>
 </div>
 </CardContent>
 </Card>
 </Link>
 </motion.div>
 )
}
