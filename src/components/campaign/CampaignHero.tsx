"use client"

import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
 ChevronLeft,
 ChevronRight,
 Share2,
 Heart,
 Maximize2,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface CampaignHeroProps {
 title: string
 category?: string
 coverImage?: string
 images?: string[]
 onShare?: () => void
 onFavorite?: () => void
 isFavorited?: boolean
}

export function CampaignHero({
 title,
 category,
 coverImage,
 images = [],
 onShare,
 onFavorite,
 isFavorited = false,
}: CampaignHeroProps) {
 const allImages =
 images.length > 0
 ? images
 : coverImage
 ? [coverImage]
 : []

 const [currentIndex, setCurrentIndex] = useState(0)
 const [isFullscreen, setIsFullscreen] = useState(false)

 const goTo = useCallback(
 (index: number) => {
 if (index < 0) setCurrentIndex(allImages.length - 1)
 else if (index >= allImages.length) setCurrentIndex(0)
 else setCurrentIndex(index)
 },
 [allImages.length]
 )

 useEffect(() => {
 if (allImages.length <= 1) return
 const handleKeyDown = (e: KeyboardEvent) => {
 if (e.key === "ArrowLeft") goTo(currentIndex - 1)
 if (e.key === "ArrowRight") goTo(currentIndex + 1)
 if (e.key === "Escape") setIsFullscreen(false)
 }
 window.addEventListener("keydown", handleKeyDown)
 return () => window.removeEventListener("keydown", handleKeyDown)
 }, [currentIndex, allImages.length, goTo])

 return (
 <>
 <div className="relative w-full overflow-hidden bg-muted">
 {/* Image Container */}
 <div className="relative aspect-[16/9] w-full sm:aspect-[21/9]">
 {allImages.length > 0 ? (
 <AnimatePresence mode="wait">
 <motion.img
 key={currentIndex}
 src={allImages[currentIndex]}
 alt={`${title} - Image ${currentIndex + 1}`}
 className="absolute inset-0 h-full w-full object-cover"
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 transition={{ duration: 0.4 }}
 />
 </AnimatePresence>
 ) : (
 <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#CDF88D] to-[#CDF88D]">
 <Heart className="h-16 w-16 text-[#CDF88D]" />
 </div>
 )}

 {/* Overlay Gradient */}
 <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

 {/* Navigation Arrows */}
 {allImages.length > 1 && (
 <>
 <Button
 variant="ghost"
 size="icon"
 className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-sm"
 onClick={() => goTo(currentIndex - 1)}
 >
 <ChevronLeft className="h-5 w-5" />
 </Button>
 <Button
 variant="ghost"
 size="icon"
 className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-sm"
 onClick={() => goTo(currentIndex + 1)}
 >
 <ChevronRight className="h-5 w-5" />
 </Button>
 </>
 )}

 {/* Top Right Buttons */}
 <div className="absolute right-3 top-3 flex gap-2">
 <Button
 variant="ghost"
 size="icon"
 className="h-9 w-9 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-sm"
 onClick={onShare}
 >
 <Share2 className="h-4 w-4" />
 </Button>
 <Button
 variant="ghost"
 size="icon"
 className={cn(
 "h-9 w-9 rounded-full backdrop-blur-sm",
 isFavorited
 ? "bg-red-500/80 text-white hover:bg-red-600/80"
 : "bg-black/40 text-white hover:bg-black/60"
 )}
 onClick={onFavorite}
 >
 <Heart
 className={cn("h-4 w-4", isFavorited && "fill-current")}
 />
 </Button>
 {allImages.length > 1 && (
 <Button
 variant="ghost"
 size="icon"
 className="h-9 w-9 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-sm"
 onClick={() => setIsFullscreen(true)}
 >
 <Maximize2 className="h-4 w-4" />
 </Button>
 )}
 </div>

 {/* Category Badge */}
 {category && (
 <div className="absolute left-3 top-3">
 <Badge
 variant="secondary"
 className="bg-black/50 text-white backdrop-blur-sm border-0 hover:bg-black/60"
 >
 {category}
 </Badge>
 </div>
 )}

 {/* Navigation Dots */}
 {allImages.length > 1 && (
 <div className="absolute bottom-14 left-1/2 flex -translate-x-1/2 gap-1.5">
 {allImages.map((_, index) => (
 <button
 key={index}
 onClick={() => setCurrentIndex(index)}
 className={cn(
 "h-2 rounded-full transition-all duration-300",
 index === currentIndex
 ? "w-6 bg-white"
 : "w-2 bg-white/50 hover:bg-white/70"
 )}
 aria-label={`Go to image ${index + 1}`}
 />
 ))}
 </div>
 )}

 {/* Title Overlay */}
 <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
 <motion.h1
 className="text-xl font-bold text-white sm:text-2xl lg:text-3xl line-clamp-2"
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.2 }}
 >
 {title}
 </motion.h1>
 </div>
 </div>
 </div>

 {/* Fullscreen Lightbox */}
 <AnimatePresence>
 {isFullscreen && (
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
 onClick={() => setIsFullscreen(false)}
 >
 <Button
 variant="ghost"
 size="icon"
 className="absolute right-4 top-4 h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/20"
 onClick={() => setIsFullscreen(false)}
 >
 <span className="text-lg">&times;</span>
 </Button>

 {allImages.length > 1 && (
 <>
 <Button
 variant="ghost"
 size="icon"
 className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/20"
 onClick={(e) => {
 e.stopPropagation()
 goTo(currentIndex - 1)
 }}
 >
 <ChevronLeft className="h-6 w-6" />
 </Button>
 <Button
 variant="ghost"
 size="icon"
 className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/20"
 onClick={(e) => {
 e.stopPropagation()
 goTo(currentIndex + 1)
 }}
 >
 <ChevronRight className="h-6 w-6" />
 </Button>
 </>
 )}

 <motion.img
 key={currentIndex}
 src={allImages[currentIndex]}
 alt={title}
 className="max-h-[85vh] max-w-[90vw] object-contain"
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.95 }}
 onClick={(e) => e.stopPropagation()}
 />

 {allImages.length > 1 && (
 <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
 {allImages.map((_, index) => (
 <button
 key={index}
 onClick={(e) => {
 e.stopPropagation()
 setCurrentIndex(index)
 }}
 className={cn(
 "h-2 rounded-full transition-all",
 index === currentIndex
 ? "w-6 bg-white"
 : "w-2 bg-white/40 hover:bg-white/60"
 )}
 />
 ))}
 </div>
 )}
 </motion.div>
 )}
 </AnimatePresence>
 </>
 )
}
