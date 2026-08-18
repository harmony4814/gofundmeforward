"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
 Megaphone,
 Calendar,
 Image,
 Send,
 ChevronDown,
 ChevronUp,
 MessageSquare,
} from "lucide-react"
import { cn, formatRelativeTime } from "@/lib/utils"

interface UpdateComment {
 id: string
 authorName: string
 authorAvatar?: string
 content: string
 createdAt: string
}

interface CampaignUpdate {
 id: string
 title: string
 description: string
 images?: string[]
 createdAt: string
 comments?: UpdateComment[]
}

interface CampaignUpdatesProps {
 updates: CampaignUpdate[]
 isOwner?: boolean
 onUpdateSubmit?: (title: string, description: string, images?: string[]) => void
 className?: string
}

export function CampaignUpdates({
 updates,
 isOwner = false,
 onUpdateSubmit,
 className,
}: CampaignUpdatesProps) {
 const [showForm, setShowForm] = useState(false)
 const [newTitle, setNewTitle] = useState("")
 const [newDescription, setNewDescription] = useState("")
 const [expandedUpdate, setExpandedUpdate] = useState<string | null>(
 updates.length > 0 ? updates[0].id : null
 )

 const handleSubmit = () => {
 if (!newTitle.trim() || !newDescription.trim()) return
 onUpdateSubmit?.(newTitle, newDescription)
 setNewTitle("")
 setNewDescription("")
 setShowForm(false)
 }

 return (
 <div className={cn("space-y-4", className)}>
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <Megaphone className="h-5 w-5 text-muted-foreground" />
 <h2 className="text-xl font-bold">
 Updates
 {updates.length > 0 && (
 <span className="ml-2 text-sm font-normal text-muted-foreground">
 ({updates.length})
 </span>
 )}
 </h2>
 </div>
 {isOwner && (
 <Button
 variant="outline"
 size="sm"
 className="gap-1.5"
 onClick={() => setShowForm(!showForm)}
 >
 <Megaphone className="h-3.5 w-3.5" />
 Post Update
 </Button>
 )}
 </div>

 {/* Add Update Form */}
 <AnimatePresence>
 {showForm && (
 <motion.div
 initial={{ opacity: 0, height: 0 }}
 animate={{ opacity: 1, height: "auto" }}
 exit={{ opacity: 0, height: 0 }}
 transition={{ duration: 0.2 }}
 >
 <Card className="border-dashed">
 <CardContent className="p-4 space-y-3">
 <div className="space-y-2">
 <Label htmlFor="update-title">Update Title</Label>
 <Input
 id="update-title"
 placeholder="e.g., Milestone Reached!"
 value={newTitle}
 onChange={(e) => setNewTitle(e.target.value)}
 />
 </div>
 <div className="space-y-2">
 <Label htmlFor="update-content">Description</Label>
 <Textarea
 id="update-content"
 placeholder="Share the latest news with your backers..."
 value={newDescription}
 onChange={(e) => setNewDescription(e.target.value)}
 className="min-h-[100px] resize-none"
 />
 </div>
 <div className="flex justify-end gap-2">
 <Button
 variant="outline"
 size="sm"
 onClick={() => setShowForm(false)}
 >
 Cancel
 </Button>
 <Button
 size="sm"
 className="gap-1.5"
 onClick={handleSubmit}
 disabled={!newTitle.trim() || !newDescription.trim()}
 >
 <Send className="h-3.5 w-3.5" />
 Post Update
 </Button>
 </div>
 </CardContent>
 </Card>
 </motion.div>
 )}
 </AnimatePresence>

 {/* Updates List */}
 {updates.length === 0 ? (
 <div className="text-center py-12">
 <Megaphone className="mx-auto h-10 w-10 text-muted-foreground/30 mb-3" />
 <p className="text-sm text-muted-foreground">
 No updates yet. Check back soon!
 </p>
 </div>
 ) : (
 <div className="space-y-3">
 {updates.map((update, index) => {
 const isExpanded = expandedUpdate === update.id
 return (
 <motion.div
 key={update.id}
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: index * 0.05 }}
 >
 <Card
 className={cn(
 "transition-colors",
 isExpanded && "border-[#CDF88D]"
 )}
 >
 <button
 type="button"
 className="flex w-full items-start gap-3 p-4 text-left"
 onClick={() =>
 setExpandedUpdate(isExpanded ? null : update.id)
 }
 >
 <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#CDF88D] mt-0.5">
 <Megaphone className="h-4 w-4 text-[#CDF88D]" />
 </div>
 <div className="flex-1 min-w-0">
 <div className="flex items-center gap-2">
 <h3 className="text-sm font-semibold line-clamp-1">
 {update.title}
 </h3>
 </div>
 <div className="flex items-center gap-2 mt-0.5">
 <Calendar className="h-3 w-3 text-muted-foreground" />
 <span className="text-xs text-muted-foreground">
 {formatRelativeTime(update.createdAt)}
 </span>
 {update.comments && update.comments.length > 0 && (
 <>
 <span className="text-muted-foreground">&middot;</span>
 <span className="flex items-center gap-1 text-xs text-muted-foreground">
 <MessageSquare className="h-3 w-3" />
 {update.comments.length}
 </span>
 </>
 )}
 </div>
 </div>
 {isExpanded ? (
 <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
 ) : (
 <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
 )}
 </button>

 <AnimatePresence>
 {isExpanded && (
 <motion.div
 initial={{ height: 0, opacity: 0 }}
 animate={{ height: "auto", opacity: 1 }}
 exit={{ height: 0, opacity: 0 }}
 transition={{ duration: 0.2 }}
 className="overflow-hidden"
 >
 <div className="px-4 pb-4 space-y-3">
 <Separator />
 <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
 {update.description}
 </p>

 {update.images && update.images.length > 0 && (
 <div className="grid grid-cols-2 gap-2">
 {update.images.map((img, i) => (
 <div
 key={i}
 className="relative aspect-video overflow-hidden rounded-lg bg-muted"
 >
 <img
 src={img}
 alt={`Update image ${i + 1}`}
 className="h-full w-full object-cover"
 />
 </div>
 ))}
 </div>
 )}

 {/* Comments */}
 {update.comments && update.comments.length > 0 && (
 <div className="space-y-2 pt-2">
 <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
 Comments ({update.comments.length})
 </p>
 {update.comments.map((comment) => (
 <div
 key={comment.id}
 className="flex gap-2 rounded-lg bg-muted/50 p-2.5"
 >
 <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-medium text-muted-foreground">
 {comment.authorName[0]}
 </div>
 <div className="flex-1 min-w-0">
 <div className="flex items-baseline gap-2">
 <span className="text-xs font-medium">
 {comment.authorName}
 </span>
 <span className="text-[10px] text-muted-foreground">
 {formatRelativeTime(comment.createdAt)}
 </span>
 </div>
 <p className="text-xs text-muted-foreground mt-0.5">
 {comment.content}
 </p>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </Card>
 </motion.div>
 )
 })}
 </div>
 )}
 </div>
 )
}
