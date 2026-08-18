"use client"

import { useState, useEffect, useCallback, useRef, type ReactNode } from "react"
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion"
import {
  Users,
  Clock,
  Heart,
  Share2,
  Flag,
  Calendar,
  Tag,
  MessageSquare,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Bookmark,
  BookmarkCheck,
  Maximize2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ProgressBar } from "@/components/shared/ProgressBar"
import { ShareButtons } from "@/components/shared/ShareButtons"
import {
 cn,
 formatCurrency,
 calculateProgress,
 getDaysRemaining,
 formatDate,
 formatRelativeTime,
 getInitials,
} from "@/lib/utils"
import type { CampaignData } from "@/lib/data"

export interface DonationItem {
 id: string
 donorName: string | null
 donorAvatar?: string
 amount: number
 currency?: string
 message?: string | null
 anonymous: boolean
 createdAt: string
}

// ─── Image Lightbox ──────────────────────────────────────────────────────────

interface ImageLightboxProps {
 images: string[]
 initialIndex?: number
 isOpen: boolean
 onClose: () => void
}

export function ImageLightbox({ images, initialIndex = 0, isOpen, onClose }: ImageLightboxProps) {
 const [currentIndex, setCurrentIndex] = useState(initialIndex)

 useEffect(() => {
 setCurrentIndex(initialIndex)
 }, [initialIndex, isOpen])

 const goNext = useCallback(() => {
 setCurrentIndex((prev) => (prev + 1) % images.length)
 }, [images.length])

 const goPrev = useCallback(() => {
 setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
 }, [images.length])

 useEffect(() => {
 if (!isOpen) return

 const handleKeyDown = (e: KeyboardEvent) => {
 if (e.key === "Escape") onClose()
 if (e.key === "ArrowRight") goNext()
 if (e.key === "ArrowLeft") goPrev()
 }

 window.addEventListener("keydown", handleKeyDown)
 return () => window.removeEventListener("keydown", handleKeyDown)
 }, [isOpen, onClose, goNext, goPrev])

 useEffect(() => {
 if (isOpen) {
 document.body.style.overflow = "hidden"
 } else {
 document.body.style.overflow = ""
 }
 return () => {
 document.body.style.overflow = ""
 }
 }, [isOpen])

 return (
 <AnimatePresence>
 {isOpen && (
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 transition={{ duration: 0.2 }}
 className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90"
 onClick={onClose}
 >
 {/* Close Button */}
 <button
 onClick={onClose}
 className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
 >
 <X className="h-5 w-5" />
 </button>

 {/* Counter */}
 <div className="absolute top-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
 {currentIndex + 1} / {images.length}
 </div>

 {/* Previous Arrow */}
 {images.length > 1 && (
 <button
 onClick={(e) => {
 e.stopPropagation()
 goPrev()
 }}
 className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
 >
 <ChevronLeft className="h-6 w-6" />
 </button>
 )}

 {/* Next Arrow */}
 {images.length > 1 && (
 <button
 onClick={(e) => {
 e.stopPropagation()
 goNext()
 }}
 className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
 >
 <ChevronRight className="h-6 w-6" />
 </button>
 )}

 {/* Image */}
 <div
 className="relative h-[80vh] w-[90vw] max-w-[1200px]"
 onClick={(e) => e.stopPropagation()}
 >
 <AnimatePresence mode="wait">
 <motion.img
 key={currentIndex}
 src={images[currentIndex]}
 alt={`Image ${currentIndex + 1}`}
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.95 }}
 transition={{ duration: 0.2 }}
 className="h-full w-full rounded-lg object-contain"
 />
 </AnimatePresence>
 </div>

 {/* Thumbnail Strip */}
 {images.length > 1 && (
 <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2 rounded-lg bg-black/50 p-2 backdrop-blur-sm">
 {images.map((img, i) => (
 <button
 key={i}
 onClick={(e) => {
 e.stopPropagation()
 setCurrentIndex(i)
 }}
 className={cn(
 "relative h-12 w-16 overflow-hidden rounded-md transition-all",
 i === currentIndex
 ? "ring-2 ring-[#CDF88D] ring-offset-1 ring-offset-black/50 opacity-100"
 : "opacity-50 hover:opacity-80"
 )}
 >
 <img src={img} alt="" className="h-full w-full object-cover" />
 </button>
 ))}
 </div>
 )}
 </motion.div>
 )}
 </AnimatePresence>
 )
}

// ─── Circular Progress ───────────────────────────────────────────────────────

interface CircularProgressProps {
 value: number
 size?: number
 strokeWidth?: number
 label?: string
}

export function CircularProgress({
 value,
 size = 80,
 strokeWidth = 6,
 label,
}: CircularProgressProps) {
 const clampedValue = Math.min(Math.max(value, 0), 100)
 const radius = (size - strokeWidth) / 2
 const circumference = 2 * Math.PI * radius
 const strokeDashoffset = circumference - (clampedValue / 100) * circumference

 return (
 <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
 <svg
 width={size}
 height={size}
 className="rotate-[-90deg]"
 >
 {/* Background circle */}
 <circle
 cx={size / 2}
 cy={size / 2}
 r={radius}
 fill="none"
 stroke="currentColor"
 strokeWidth={strokeWidth}
 className="text-gray-200"
 />
 {/* Progress circle */}
 <circle
 cx={size / 2}
 cy={size / 2}
 r={radius}
 fill="none"
 stroke="currentColor"
 strokeWidth={strokeWidth}
 strokeDasharray={circumference}
 strokeDashoffset={strokeDashoffset}
 strokeLinecap="round"
 className="text-[#CDF88D]"
 style={{
 transition: "stroke-dashoffset 1s ease-out",
 }}
 />
 </svg>
   <div className="absolute inset-0 flex flex-col items-center justify-center">
   <span className="text-sm font-bold text-gray-900">{Math.round(clampedValue)}%</span>
   {label && <span className="text-[9px] text-muted-foreground">{label}</span>}
   </div>
  </div>
  )
}

// ─── Campaign Summary Card ───────────────────────────────────────────────────

export function CampaignSummaryCard({
  campaign,
  raised,
  donorCount,
  latestDonation,
  onDonate,
}: {
  campaign: CampaignData
  raised: number
  donorCount: number
  latestDonation?: DonationItem
  onDonate: () => void
}) {
  const [showShare, setShowShare] = useState(false)
  const progress = calculateProgress(raised, campaign.goal)
  const campaignUrl =
  typeof window !== "undefined"
  ? `${window.location.origin}/campaigns/${campaign.slug}`
  : ""

  const latest = latestDonation
  ? {
  name:
  latestDonation.anonymous || !latestDonation.donorName
  ? "Anonymous"
  : latestDonation.donorName,
  amount: formatCurrency(
  latestDonation.amount,
  latestDonation.currency || campaign.currency
  ),
  }
  : null

  return (
  <motion.div
  initial={{ opacity: 0, y: 24 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
  className="rounded-[30px] bg-white px-4 py-3 shadow-[0_16px_40px_-18px_rgba(15,23,42,0.25)] ring-1 ring-black/[0.04] sm:px-5 sm:py-3.5"
  >
  {/* Progress + Amounts */}
  <div className="flex items-center gap-3.5 sm:gap-4">
  <CircularProgress value={progress} size={52} strokeWidth={5} />
  <div className="min-w-0 flex-1">
  <p className="truncate text-[11px] font-medium text-muted-foreground">
  Raised of {formatCurrency(campaign.goal, campaign.currency)}
  </p>
  <motion.p
  key={raised}
  initial={{ scale: 1.05 }}
  animate={{ scale: 1 }}
  className="text-lg font-extrabold leading-tight text-gray-900 sm:text-xl"
  >
  {formatCurrency(raised, campaign.currency)}
  </motion.p>
  {latest ? (
   <p className="truncate text-[11px] text-muted-foreground">
   {latest.name} donated <span className="font-semibold text-foreground">{latest.amount}</span>
   </p>
  ) : (
   <p className="truncate text-[11px] text-muted-foreground">
   Be the first to donate
   </p>
  )}
  </div>
  </div>

  {/* Actions */}
  <div className="mt-2.5 flex gap-2.5">
  <Button
  onClick={onDonate}
  size="default"
  className="h-9 flex-1 rounded-full bg-[#CDF88D] px-4 text-sm font-bold text-[#14532d] shadow-sm transition-all hover:bg-[#CDF88D] hover:brightness-95"
  >
  Donate
  </Button>
  <Button
  variant="outline"
  size="default"
  onClick={() => setShowShare(!showShare)}
  className="h-9 flex-1 gap-1.5 rounded-full border-[#14532d] bg-[#14532d] px-4 text-sm font-medium text-[#CDF88D] hover:bg-[#174a2e] hover:text-[#CDF88D]"
  >
  <Share2 className="h-4 w-4" />
  Share
  </Button>
  </div>

  {showShare && campaignUrl && (
  <motion.div
  initial={{ opacity: 0, height: 0 }}
  animate={{ opacity: 1, height: "auto" }}
  transition={{ duration: 0.2 }}
  className="overflow-hidden"
  >
  <div className="mt-3 border-t border-gray-100 pt-3">
  <ShareButtons url={campaignUrl} title={campaign.title} variant="compact" />
  </div>
  </motion.div>
  )}
  </motion.div>
  )
}

// ─── Sticky Summary Card Wrapper ─────────────────────────────────────────────

export function StickySummaryCard({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [showFloating, setShowFloating] = useState(false)
  const { scrollY } = useScroll()

  useEffect(() => {
    const el = ref.current
    if (el) setShowFloating(el.getBoundingClientRect().bottom < 0)
  }, [])

  useMotionValueEvent(scrollY, "change", () => {
    const el = ref.current
    if (!el) return
    const visible = el.getBoundingClientRect().bottom < 0
    setShowFloating((prev) => (prev === visible ? prev : visible))
  })

  return (
  <>
  {/* In-flow summary card - scrolls away completely */}
  <div ref={ref} className="mx-auto mt-4 w-[93%] max-w-4xl sm:mt-6">
  {children}
  </div>

  {/* Floating version - slides up from the bottom once scrolled past */}
  <AnimatePresence>
  {showFloating && (
  <motion.div
  initial={{ opacity: 0, y: 120 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: 120 }}
  transition={{ type: "spring", stiffness: 320, damping: 30 }}
  className="fixed bottom-4 left-1/2 z-40 w-[92%] max-w-lg -translate-x-1/2"
  >
  {children}
  </motion.div>
  )}
  </AnimatePresence>
  </>
  )
}

// ─── Campaign Hero ───────────────────────────────────────────────────────────

interface CampaignHeroProps {
 campaign: CampaignData
}

export function CampaignHero({ campaign }: CampaignHeroProps) {
 const images = campaign.galleryImages.length > 0 ? campaign.galleryImages : [campaign.coverImage]
 const [currentSlide, setCurrentSlide] = useState(0)
 const [lightboxOpen, setLightboxOpen] = useState(false)
 const [lightboxIndex, setLightboxIndex] = useState(0)
 const [isFavorited, setIsFavorited] = useState(false)
 const touchStartX = useRef(0)
 const touchEndX = useRef(0)

 const daysLeft = getDaysRemaining(campaign.deadline)

 const goNext = useCallback(() => {
 setCurrentSlide((prev) => (prev + 1) % images.length)
 }, [images.length])

 const goPrev = useCallback(() => {
 setCurrentSlide((prev) => (prev - 1 + images.length) % images.length)
 }, [images.length])

 // Mobile touch support
 const handleTouchStart = (e: React.TouchEvent) => {
 touchStartX.current = e.touches[0].clientX
 }

 const handleTouchMove = (e: React.TouchEvent) => {
 touchEndX.current = e.touches[0].clientX
 }

 const handleTouchEnd = () => {
 const diff = touchStartX.current - touchEndX.current
 const minSwipe = 50
 if (diff > minSwipe) goNext()
 else if (diff < -minSwipe) goPrev()
 }

 const openLightbox = (index: number) => {
 setLightboxIndex(index)
 setLightboxOpen(true)
 }

 return (
 <>
   <section
   className="relative h-[48vh] min-h-[380px] overflow-hidden sm:h-[500px] md:h-[540px]"
 onTouchStart={handleTouchStart}
 onTouchMove={handleTouchMove}
 onTouchEnd={handleTouchEnd}
 >
 {/* Image Slide */}
 <AnimatePresence mode="wait">
 <motion.div
 key={currentSlide}
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 transition={{ duration: 0.4 }}
 className="absolute inset-0"
 >
  <img
  src={images[currentSlide]}
  alt={`${campaign.title} - Image ${currentSlide + 1}`}
  className="absolute inset-0 h-full w-full object-cover"
  />
 </motion.div>
 </AnimatePresence>

 {/* Gradient Overlay */}
 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

 {/* Desktop Navigation Arrows */}
 {images.length > 1 && (
 <>
 <button
 onClick={goPrev}
 className="absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60 md:flex"
 >
 <ChevronLeft className="h-5 w-5" />
 </button>
 <button
 onClick={goNext}
 className="absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60 md:flex"
 >
 <ChevronRight className="h-5 w-5" />
 </button>
 </>
 )}

  {/* Top Overlays: Lightbox, Favorite, Share */}
  <div className="absolute top-4 left-0 right-0 z-10 flex items-center justify-between px-4 sm:px-6">
  <button
  onClick={() => openLightbox(currentSlide)}
  className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
  >
  <Maximize2 className="h-4 w-4" />
  </button>
  <div className="flex items-center gap-2">
  <button
  onClick={() => setIsFavorited(!isFavorited)}
  className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
  >
  {isFavorited ? (
  <BookmarkCheck className="h-4 w-4 fill-[#CDF88D] text-[#CDF88D]" />
  ) : (
  <Bookmark className="h-4 w-4" />
  )}
  </button>
  <button className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60">
  <Share2 className="h-4 w-4" />
  </button>
  </div>
  </div>

  {/* Bottom Title + Slider Dots Overlay */}
  <div className="absolute inset-x-0 bottom-0 flex items-end justify-center px-4 pb-6 sm:px-6 sm:pb-8 md:px-10 md:pb-10">
  <div className="mx-auto w-full max-w-4xl text-center">
  <h1 className="text-xl font-extrabold text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.55)] sm:text-3xl md:text-4xl">{campaign.title}</h1>
  {images.length > 1 && (
  <div className="mt-3 flex items-center justify-center gap-1.5">
  {images.map((_, i) => (
  <button
  key={i}
  aria-label={`Go to image ${i + 1}`}
  onClick={() => setCurrentSlide(i)}
  className={`h-1.5 rounded-full transition-all duration-300 ${
  i === currentSlide
  ? "w-5 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.5)]"
  : "w-1.5 bg-white/50 hover:bg-white/80"
  }`}
  />
  ))}
  </div>
  )}
  </div>
  </div>
  </section>

 {/* Lightbox */}
 <ImageLightbox
 images={images}
 initialIndex={lightboxIndex}
 isOpen={lightboxOpen}
 onClose={() => setLightboxOpen(false)}
 />
 </>
 )
}

// ─── Campaign Story ──────────────────────────────────────────────────────────

export function CampaignStory({ campaign }: { campaign: CampaignData }) {
 const [expanded, setExpanded] = useState(false)
 const paragraphs = campaign.fullStory.split("\n\n")
 const hasMore = paragraphs.length > 3

 return (
 <div className="space-y-6">
 <Card>
 <CardHeader>
 <CardTitle>Our Story</CardTitle>
 </CardHeader>
 <CardContent>
 <div className="prose prose-gray max-w-none">
 <AnimatePresence initial={false}>
 {(expanded ? paragraphs : paragraphs.slice(0, 3)).map((paragraph, i) => (
 <motion.p
 key={i}
 initial={{ opacity: 0, height: 0 }}
 animate={{ opacity: 1, height: "auto" }}
 exit={{ opacity: 0, height: 0 }}
 transition={{ duration: 0.3, ease: "easeInOut" }}
 className="mb-4 text-gray-600 overflow-hidden"
 >
 {paragraph}
 </motion.p>
 ))}
 </AnimatePresence>
 </div>

 {hasMore && (
 <Button
 variant="ghost"
 onClick={() => setExpanded(!expanded)}
 className="mt-2 gap-1 text-[#CDF88D] hover:text-[#CDF88D] hover:bg-[#CDF88D]"
 >
 {expanded ? (
 <>
 Show Less
 <ChevronDown className="h-4 w-4 rotate-180 transition-transform" />
 </>
 ) : (
 <>
 Read More
 <ChevronDown className="h-4 w-4 transition-transform" />
 </>
 )}
 </Button>
 )}
 </CardContent>
 </Card>

 {campaign.tags.length > 0 && (
 <div className="flex flex-wrap gap-2">
 {campaign.tags.map((tag) => (
 <Badge key={tag} variant="secondary">
 <Tag className="mr-1 h-3 w-3" />
 {tag}
 </Badge>
 ))}
 </div>
 )}
 </div>
 )
}

// ─── Campaign Updates ────────────────────────────────────────────────────────

export function CampaignUpdates() {
 const updates = [
 {
 id: "1",
 title: "We hit 50% of our goal!",
 date: "2026-06-15",
 content:
 "Incredible news! We've reached 50% of our fundraising goal. Thank you to every single donor who has contributed. Your generosity is truly changing lives.",
 },
 {
 id: "2",
 title: "New photos from the field",
 date: "2026-05-28",
 content:
 "We just received new photos from the field showing the progress we've made so far. Check out the gallery to see your donations in action!",
 },
 {
 id: "3",
 title: "Campaign launched!",
 date: "2026-04-01",
 content:
 "We're excited to announce the launch of our campaign! After months of planning, we're finally live and ready to make a difference.",
 },
 ]

 return (
 <Card>
 <CardHeader>
 <CardTitle>Campaign Updates ({updates.length})</CardTitle>
 </CardHeader>
 <CardContent className="space-y-6">
 {updates.map((update) => (
 <div key={update.id} className="space-y-2">
 <div className="flex items-center justify-between">
 <h4 className="font-semibold">{update.title}</h4>
 <span className="text-xs text-gray-500">{formatDate(update.date)}</span>
 </div>
 <p className="text-sm text-gray-600">{update.content}</p>
 <Separator />
 </div>
 ))}
 </CardContent>
 </Card>
 )
}

// ─── Campaign Comments ───────────────────────────────────────────────────────

export function CampaignComments() {
 const comments = [
 {
 id: "1",
 name: "Jessica Lee",
 avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
 content: "Sending love and support. You've got this!",
 date: "2026-06-14",
 likes: 12,
 },
 {
 id: "2",
 name: "Tom Wilson",
 avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
 content: "Donated and shared with my entire office. Let's make this happen!",
 date: "2026-06-12",
 likes: 8,
 },
 {
 id: "3",
 name: "Priya Sharma",
 avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80",
 content: "This cause is so important. Happy to contribute whatever I can.",
 date: "2026-06-10",
 likes: 5,
 },
 ]

 return (
 <Card>
 <CardHeader>
 <CardTitle>Comments ({comments.length})</CardTitle>
 </CardHeader>
 <CardContent className="space-y-6">
 <div className="flex gap-3">
 <Input placeholder="Write a comment..." className="flex-1" />
 <Button className="bg-[#CDF88D] text-[#14532d] hover:bg-[#CDF88D]">Post</Button>
 </div>
 {comments.map((comment) => (
 <div key={comment.id} className="flex gap-3">
 <Avatar className="h-9 w-9">
 <AvatarImage src={comment.avatar} />
 <AvatarFallback>{getInitials(comment.name)}</AvatarFallback>
 </Avatar>
 <div className="flex-1">
 <div className="flex items-center gap-2">
 <span className="text-sm font-semibold">{comment.name}</span>
 <span className="text-xs text-gray-500">{formatDate(comment.date)}</span>
 </div>
 <p className="mt-1 text-sm text-gray-600">
 {comment.content}
 </p>
 <button className="mt-1 flex items-center gap-1 text-xs text-gray-500 hover:text-[#CDF88D]">
 <Heart className="h-3 w-3" />
 {comment.likes}
 </button>
 </div>
 </div>
 ))}
 </CardContent>
 </Card>
 )
}

// ─── Campaign Donations Section ──────────────────────────────────────────────

export function CampaignDonationsSection({
 donations,
 currency,
}: {
 donations: DonationItem[]
 currency?: string
}) {
 const [showAll, setShowAll] = useState(false)
 const sorted = [...donations].sort(
 (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
 )
 const visible = showAll ? sorted : sorted.slice(0, 8)

 if (sorted.length === 0) {
 return (
 <Card>
 <CardHeader>
 <CardTitle>Recent Donations</CardTitle>
 </CardHeader>
 <CardContent>
 <div className="py-10 text-center">
 <Heart className="mx-auto h-10 w-10 text-muted-foreground/30 mb-3" />
 <p className="text-sm text-muted-foreground">
 Be the first to donate to this campaign!
 </p>
 </div>
 </CardContent>
 </Card>
 )
 }

 return (
 <Card>
 <CardHeader>
 <div className="flex items-center justify-between">
 <CardTitle>Recent Donations ({donations.length})</CardTitle>
 </div>
 </CardHeader>
 <CardContent className="space-y-1">
 {visible.map((donation) => {
 const isAnon = donation.anonymous || !donation.donorName
 const displayName = isAnon ? "Anonymous" : donation.donorName
 const initials = isAnon ? "?" : getInitials(donation.donorName || "")

 return (
 <motion.div
 key={donation.id}
 initial={{ opacity: 0, y: 8 }}
 animate={{ opacity: 1, y: 0 }}
 className="group flex gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50"
 >
 <Avatar className="h-9 w-9 shrink-0">
 {!isAnon && donation.donorAvatar && (
 <AvatarImage src={donation.donorAvatar} alt={displayName || ""} />
 )}
 <AvatarFallback
 className={cn(
 "text-xs font-medium",
 isAnon
 ? "bg-muted text-muted-foreground"
 : "bg-[#CDF88D] text-[#CDF88D]"
 )}
 >
 {initials}
 </AvatarFallback>
 </Avatar>

 <div className="flex-1 min-w-0">
 <div className="flex items-baseline gap-2 flex-wrap">
 <span className="text-sm font-medium truncate">{displayName}</span>
 <span className="text-xs text-muted-foreground">
 {formatRelativeTime(donation.createdAt)}
 </span>
 </div>
  <p className="text-sm font-bold text-[#14532d] mt-0.5">
 {formatCurrency(donation.amount, donation.currency || currency)}
 </p>
 {donation.message && (
 <div className="mt-1.5 flex items-start gap-1.5 rounded-md bg-muted/50 px-2.5 py-2">
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

 {sorted.length > 8 && !showAll && (
 <button
 onClick={() => setShowAll(true)}
 className="flex w-full items-center justify-center gap-1 py-3 text-sm font-medium text-[#CDF88D] hover:text-[#CDF88D] transition-colors"
 >
 View all {sorted.length} donations
 <ChevronDown className="h-4 w-4" />
 </button>
 )}
 </CardContent>
 </Card>
 )
}

// ─── Sticky Donate Card ──────────────────────────────────────────────────────

export function StickyDonateCard({
 campaign,
 raised,
 donorCount,
 onDonate,
}: {
 campaign: CampaignData
 raised: number
 donorCount: number
 onDonate: () => void
}) {
 const [showShare, setShowShare] = useState(false)
 const progress = calculateProgress(raised, campaign.goal)
 const daysLeft = getDaysRemaining(campaign.deadline)
 const campaignUrl =
 typeof window !== "undefined"
 ? `${window.location.origin}/campaigns/${campaign.slug}`
 : ""

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
 <Card className="overflow-hidden border border-gray-200 shadow-lg">
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
 {/* Fundraising Progress */}
 <div className="space-y-2">
 <div className="flex items-baseline justify-between">
 <motion.span
 key={raised}
 initial={{ scale: 1.1 }}
 animate={{ scale: 1 }}
  className="text-2xl font-bold text-gray-900"
 >
 {formatCurrency(raised, campaign.currency)}
 </motion.span>
 <span className="text-sm text-muted-foreground">
 of {formatCurrency(campaign.goal, campaign.currency)}
 </span>
 </div>
 <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
 <motion.div
 className="h-full rounded-full bg-gradient-to-r from-[#CDF88D] to-[#CDF88D]"
 initial={{ width: 0 }}
 animate={{ width: `${progress}%` }}
 transition={{ duration: 0.8, ease: "easeOut" }}
 />
 </div>
 <div className="flex items-center justify-between text-sm">
 <span className="font-semibold text-foreground">{progress}% funded</span>
 </div>
 </div>

 {/* Stats */}
 <div className="grid grid-cols-2 gap-3">
 <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-2.5">
 <Users className="h-4 w-4 text-muted-foreground" />
 <div>
 <p className="text-xs text-muted-foreground">Donors</p>
 <motion.p
 key={donorCount}
 initial={{ scale: 1.1 }}
 animate={{ scale: 1 }}
 className="text-sm font-semibold"
 >
 {donorCount.toLocaleString()}
 </motion.p>
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

 {/* Donate Button - GoFundMe Style */}
  <Button
  onClick={onDonate}
  size="lg"
  className="w-full h-13 text-base font-bold bg-[#CDF88D] hover:bg-[#CDF88D] text-[#14532d] shadow-md hover:shadow-lg transition-all rounded-full hover:brightness-95"
  >
  Donate Now
  </Button>

 {/* Share Button */}
 <Button
 variant="outline"
 size="default"
 className="w-full gap-2 h-11 font-medium border-[#14532d] bg-[#14532d] text-[#CDF88D] hover:bg-[#174a2e] hover:text-[#CDF88D]"
 onClick={() => setShowShare(!showShare)}
 >
 <Share2 className="h-4 w-4" />
 Share Campaign
 <ChevronDown
 className={cn(
 "h-3 w-3 transition-transform duration-200",
 showShare ? "rotate-180" : ""
 )}
 />
 </Button>

 {showShare && campaignUrl && (
 <motion.div
 initial={{ opacity: 0, height: 0 }}
 animate={{ opacity: 1, height: "auto" }}
 exit={{ opacity: 0, height: 0 }}
 transition={{ duration: 0.2 }}
 className="overflow-hidden"
 >
 <ShareButtons url={campaignUrl} title={campaign.title} variant="compact" />
 </motion.div>
 )}

 <Separator />

 {/* Organizer */}
 <div className="flex items-center gap-3">
 <Avatar>
 <AvatarImage src={campaign.creatorAvatar} />
 <AvatarFallback>{getInitials(campaign.creatorName)}</AvatarFallback>
 </Avatar>
 <div>
 <p className="text-sm font-semibold">{campaign.creatorName}</p>
 <p className="text-xs text-gray-500">Campaign Organizer</p>
 </div>
 </div>

 {/* Campaign Info */}
 <div className="space-y-2 text-sm">
 <div className="flex justify-between">
 <span className="text-gray-500">Beneficiary</span>
 <span className="font-medium">{campaign.beneficiaryName}</span>
 </div>
 <div className="flex justify-between">
 <span className="text-gray-500">Deadline</span>
 <span className="font-medium">{formatDate(campaign.deadline)}</span>
 </div>
 <div className="flex justify-between">
 <span className="text-gray-500">Views</span>
 <span className="font-medium">{campaign.viewCount.toLocaleString()}</span>
 </div>
 </div>
 </div>
  </Card>
  </motion.div>
  </div>
  </div>
  </>
  )
}

// ─── Related Campaigns ───────────────────────────────────────────────────────

export function RelatedCampaigns({
 campaigns,
}: {
 campaigns: CampaignData[]
}) {
 if (campaigns.length === 0) return null

 return (
 <section className="py-12">
 <h2 className="mb-6 text-2xl font-bold">Related Campaigns</h2>
 <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
 {campaigns.map((campaign, i) => (
 <motion.div
 key={campaign.id}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: i * 0.05 }}
 >
 <a href={`/campaigns/${campaign.slug}`} className="block">
 <Card className="group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
 <div className="relative aspect-[16/10] overflow-hidden">
  <img
  src={campaign.coverImage}
  alt={campaign.title}
  className="h-full w-full object-cover transition-transform group-hover:scale-105"
  />
 </div>
 <CardContent className="space-y-2 p-4">
 <h3 className="line-clamp-1 font-semibold group-hover:text-[#CDF88D]">
 {campaign.title}
 </h3>
 <div className="flex items-center justify-between text-sm">
 <span className="font-semibold text-[#CDF88D]">
 {formatCurrency(campaign.raised)}
 </span>
 <span className="text-gray-500">
 {calculateProgress(campaign.raised, campaign.goal)}%
 </span>
 </div>
 </CardContent>
 </Card>
 </a>
 </motion.div>
 ))}
 </div>
 </section>
 )
}
