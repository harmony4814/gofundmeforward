"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
 MapPin,
 Target,
 TrendingUp,
 Users,
 Calendar,
 Tag,
 Flag,
} from "lucide-react"
import {
 cn,
 formatCurrency,
 formatDate,
 formatNumber,
 calculateProgress,
 getInitials,
} from "@/lib/utils"
import { ProgressBar } from "@/components/shared/ProgressBar"

interface CampaignStoryProps {
 content: string
 organizer?: {
 name: string
 avatar?: string
 location?: string
 campaignsCount?: number
 bio?: string
 }
 beneficiary?: {
 name: string
 description?: string
 }
 details: {
 goal: number
 raised: number
 donorCount: number
 endDate: string
 currency?: string
 }
 tags?: string[]
 className?: string
}

export function CampaignStory({
 content,
 organizer,
 beneficiary,
 details,
 tags = [],
 className,
}: CampaignStoryProps) {
 const currency = details.currency || "USD"
 const progress = calculateProgress(details.raised, details.goal)

 return (
 <div className={cn("space-y-6", className)}>
 {/* Story Content */}
 <div>
 <h2 className="text-xl font-bold mb-4">About This Campaign</h2>
 <div
 className="prose prose-sm max-w-none text-muted-foreground leading-relaxed"
 dangerouslySetInnerHTML={{ __html: content }}
 />
 </div>

 <Separator />

 {/* Tags */}
 {tags.length > 0 && (
 <div className="flex flex-wrap gap-2">
 {tags.map((tag) => (
 <Badge
 key={tag}
 variant="secondary"
 className="gap-1 bg-muted/60"
 >
 <Tag className="h-3 w-3" />
 {tag}
 </Badge>
 ))}
 </div>
 )}

 <div className="grid gap-6 md:grid-cols-2">
 {/* Organizer Card */}
 {organizer && (
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.4 }}
 >
 <Card>
 <CardHeader>
 <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
 Campaign Organizer
 </CardTitle>
 </CardHeader>
 <CardContent>
 <div className="flex items-start gap-3">
 <Avatar size="lg">
 {organizer.avatar && (
 <AvatarImage src={organizer.avatar} alt={organizer.name} />
 )}
 <AvatarFallback className="bg-[#CDF88D] text-[#CDF88D] font-medium">
 {getInitials(organizer.name)}
 </AvatarFallback>
 </Avatar>
 <div className="flex-1 min-w-0">
 <p className="font-semibold">{organizer.name}</p>
 {organizer.location && (
 <p className="flex items-center gap-1 text-sm text-muted-foreground">
 <MapPin className="h-3 w-3" />
 {organizer.location}
 </p>
 )}
 {organizer.campaignsCount !== undefined && (
 <p className="text-sm text-muted-foreground mt-1">
 {organizer.campaignsCount} campaign{organizer.campaignsCount !== 1 ? "s" : ""} created
 </p>
 )}
 {organizer.bio && (
 <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
 {organizer.bio}
 </p>
 )}
 </div>
 </div>
 </CardContent>
 </Card>
 </motion.div>
 )}

 {/* Beneficiary Card */}
 {beneficiary && (
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.4, delay: 0.1 }}
 >
 <Card>
 <CardHeader>
 <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
 Beneficiary
 </CardTitle>
 </CardHeader>
 <CardContent>
 <p className="font-semibold">{beneficiary.name}</p>
 {beneficiary.description && (
 <p className="text-sm text-muted-foreground mt-1">
 {beneficiary.description}
 </p>
 )}
 </CardContent>
 </Card>
 </motion.div>
 )}
 </div>

 {/* Campaign Details */}
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.4, delay: 0.2 }}
 >
 <Card>
 <CardHeader>
 <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
 Campaign Details
 </CardTitle>
 </CardHeader>
 <CardContent className="space-y-4">
 <div className="space-y-2">
 <div className="flex items-baseline justify-between">
 <span className="text-2xl font-bold text-[#CDF88D]">
 {formatCurrency(details.raised, currency)}
 </span>
 <span className="text-sm text-muted-foreground">
 of {formatCurrency(details.goal, currency)} goal
 </span>
 </div>
 <ProgressBar value={progress} size="md" showLabel />
 </div>

 <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
 <div className="flex items-center gap-2.5 rounded-lg bg-muted/50 p-3">
 <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#CDF88D]">
 <Target className="h-4 w-4 text-[#CDF88D]" />
 </div>
 <div>
 <p className="text-xs text-muted-foreground">Goal</p>
 <p className="text-sm font-semibold">
 {formatCurrency(details.goal, currency)}
 </p>
 </div>
 </div>

 <div className="flex items-center gap-2.5 rounded-lg bg-muted/50 p-3">
 <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
 <TrendingUp className="h-4 w-4 text-blue-600" />
 </div>
 <div>
 <p className="text-xs text-muted-foreground">Raised</p>
 <p className="text-sm font-semibold">
 {formatCurrency(details.raised, currency)}
 </p>
 </div>
 </div>

 <div className="flex items-center gap-2.5 rounded-lg bg-muted/50 p-3">
 <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
 <Users className="h-4 w-4 text-purple-600" />
 </div>
 <div>
 <p className="text-xs text-muted-foreground">Donors</p>
 <p className="text-sm font-semibold">
 {formatNumber(details.donorCount)}
 </p>
 </div>
 </div>
 </div>

 <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3">
 <Calendar className="h-4 w-4 text-muted-foreground" />
 <div>
 <p className="text-xs text-muted-foreground">End Date</p>
 <p className="text-sm font-medium">
 {formatDate(details.endDate)}
 </p>
 </div>
 </div>

 <div className="flex items-center gap-2 rounded-lg bg-amber-50 p-3">
 <Flag className="h-4 w-4 text-amber-600" />
 <p className="text-xs text-amber-700">
 If this campaign doesn&apos;t reach its goal, all donations will be
 refunded.
 </p>
 </div>
 </CardContent>
 </Card>
 </motion.div>
 </div>
 )
}
