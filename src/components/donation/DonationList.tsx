"use client"

import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatCurrency, formatRelativeTime, getInitials } from "@/lib/utils"
import { Heart, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

interface Donation {
 id: string
 donorName: string | null
 donorAvatar?: string | null
 amount: number
 currency?: string
 message?: string | null
 createdAt: string
 anonymous?: boolean
}

interface DonationListProps {
 donations: Donation[]
 className?: string
 currency?: string
}

const containerVariants = {
 hidden: { opacity: 0 },
 visible: {
 opacity: 1,
 transition: {
 staggerChildren: 0.08,
 },
 },
}

const itemVariants = {
 hidden: { opacity: 0, x: -20 },
 visible: {
 opacity: 1,
 x: 0,
 transition: { duration: 0.3, ease: "easeOut" as const },
 },
}

export function DonationList({
 donations,
 className,
 currency = "USD",
}: DonationListProps) {
 const sorted = [...donations].sort(
 (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
 )

 if (sorted.length === 0) {
 return (
 <div className={cn("text-center py-12", className)}>
 <Heart className="mx-auto h-10 w-10 text-muted-foreground/30 mb-3" />
 <p className="text-sm text-muted-foreground">
 Be the first to donate to this campaign!
 </p>
 </div>
 )
 }

 return (
 <motion.div
 className={cn("space-y-1", className)}
 variants={containerVariants}
 initial="hidden"
 animate="visible"
 >
 {sorted.map((donation) => {
 const isAnonymous = donation.anonymous || !donation.donorName
 const displayName = isAnonymous
 ? "Anonymous Donor"
 : donation.donorName
 const initials = isAnonymous ? "?" : getInitials(donation.donorName || "")

 return (
 <motion.div
 key={donation.id}
 variants={itemVariants}
 className="group flex gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50"
 >
 <Avatar size="sm">
 {!isAnonymous && donation.donorAvatar && (
 <AvatarImage src={donation.donorAvatar} alt={displayName || ""} />
 )}
 <AvatarFallback
 className={cn(
 "text-xs font-medium",
 isAnonymous
 ? "bg-muted text-muted-foreground"
 : "bg-[#CDF88D] text-[#CDF88D]"
 )}
 >
 {initials}
 </AvatarFallback>
 </Avatar>

 <div className="flex-1 min-w-0">
 <div className="flex items-baseline gap-2 flex-wrap">
 <span className="text-sm font-medium truncate">
 {displayName}
 </span>
 <span className="text-xs text-muted-foreground">
 {formatRelativeTime(donation.createdAt)}
 </span>
 </div>

 <p className="text-sm font-bold text-[#CDF88D] mt-0.5">
 {formatCurrency(donation.amount, donation.currency || currency)}
 </p>

 {donation.message && (
 <div className="mt-2 flex items-start gap-1.5 rounded-md bg-muted/50 px-2.5 py-2">
 <MessageSquare className="h-3 w-3 mt-0.5 text-muted-foreground shrink-0" />
 <p className="text-xs text-muted-foreground leading-relaxed">
 {donation.message}
 </p>
 </div>
 )}
 </div>
 </motion.div>
 )
 })}
 </motion.div>
 )
}
