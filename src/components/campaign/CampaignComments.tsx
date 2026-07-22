"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
 MessageSquare,
 Heart,
 Reply,
 Flag,
 MoreHorizontal,
 Send,
 ChevronDown,
 ChevronUp,
} from "lucide-react"
import { cn, formatRelativeTime, getInitials } from "@/lib/utils"

interface Comment {
 id: string
 authorName: string
 authorAvatar?: string
 content: string
 createdAt: string
 likes: number
 isLiked?: boolean
 replies?: Comment[]
}

interface CampaignCommentsProps {
 comments: Comment[]
 onAddComment?: (content: string) => void
 onReply?: (parentId: string, content: string) => void
 onLike?: (commentId: string) => void
 onReport?: (commentId: string) => void
 className?: string
}

function CommentItem({
 comment,
 depth = 0,
 onReply,
 onLike,
 onReport,
}: {
 comment: Comment
 depth?: number
 onReply?: (parentId: string, content: string) => void
 onLike?: (commentId: string) => void
 onReport?: (commentId: string) => void
}) {
 const [showReplyForm, setShowReplyForm] = useState(false)
 const [replyContent, setReplyContent] = useState("")
 const [showReplies, setShowReplies] = useState(depth === 0)
 const [liked, setLiked] = useState(comment.isLiked || false)
 const [likeCount, setLikeCount] = useState(comment.likes)

 const handleLike = () => {
 setLiked(!liked)
 setLikeCount((c) => (liked ? c - 1 : c + 1))
 onLike?.(comment.id)
 }

 const handleReply = () => {
 if (!replyContent.trim()) return
 onReply?.(comment.id, replyContent)
 setReplyContent("")
 setShowReplyForm(false)
 }

 const hasReplies = comment.replies && comment.replies.length > 0
 const initials = getInitials(comment.authorName)

 return (
 <motion.div
 initial={{ opacity: 0, y: 8 }}
 animate={{ opacity: 1, y: 0 }}
 className={cn("group", depth > 0 && "ml-8 sm:ml-12")}
 >
 <div className="flex gap-3">
 <Avatar size="sm">
 {comment.authorAvatar && (
 <AvatarImage src={comment.authorAvatar} alt={comment.authorName} />
 )}
 <AvatarFallback className="text-xs font-medium">
 {initials}
 </AvatarFallback>
 </Avatar>

 <div className="flex-1 min-w-0">
 <div className="rounded-lg bg-muted/50 p-3">
 <div className="flex items-baseline gap-2 mb-1">
 <span className="text-sm font-medium">{comment.authorName}</span>
 <span className="text-xs text-muted-foreground">
 {formatRelativeTime(comment.createdAt)}
 </span>
 </div>
 <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
 {comment.content}
 </p>
 </div>

 {/* Comment Actions */}
 <div className="mt-1.5 flex items-center gap-3">
 <button
 type="button"
 onClick={handleLike}
 className={cn(
 "flex items-center gap-1 text-xs transition-colors",
 liked
 ? "text-red-500 font-medium"
 : "text-muted-foreground hover:text-foreground"
 )}
 >
 <Heart
 className={cn("h-3.5 w-3.5", liked && "fill-current")}
 />
 {likeCount > 0 && <span>{likeCount}</span>}
 </button>
 <button
 type="button"
 onClick={() => setShowReplyForm(!showReplyForm)}
 className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
 >
 <Reply className="h-3.5 w-3.5" />
 Reply
 </button>
 <button
 type="button"
 onClick={() => onReport?.(comment.id)}
 className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
 >
 <Flag className="h-3.5 w-3.5" />
 Report
 </button>
 </div>

 {/* Reply Form */}
 <AnimatePresence>
 {showReplyForm && (
 <motion.div
 initial={{ opacity: 0, height: 0 }}
 animate={{ opacity: 1, height: "auto" }}
 exit={{ opacity: 0, height: 0 }}
 className="mt-2 overflow-hidden"
 >
 <div className="flex gap-2">
 <Textarea
 placeholder={`Reply to ${comment.authorName}...`}
 value={replyContent}
 onChange={(e) => setReplyContent(e.target.value)}
 className="min-h-[60px] resize-none text-sm"
 maxLength={1000}
 />
 </div>
 <div className="mt-2 flex justify-end gap-2">
 <Button
 variant="ghost"
 size="sm"
 onClick={() => {
 setShowReplyForm(false)
 setReplyContent("")
 }}
 >
 Cancel
 </Button>
 <Button
 size="sm"
 className="gap-1"
 onClick={handleReply}
 disabled={!replyContent.trim()}
 >
 <Send className="h-3 w-3" />
 Reply
 </Button>
 </div>
 </motion.div>
 )}
 </AnimatePresence>

 {/* Nested Replies */}
 {hasReplies && (
 <div className="mt-2">
 <button
 type="button"
 onClick={() => setShowReplies(!showReplies)}
 className="flex items-center gap-1 text-xs font-medium text-green-600 hover:text-green-700 transition-colors"
 >
 {showReplies ? (
 <ChevronUp className="h-3 w-3" />
 ) : (
 <ChevronDown className="h-3 w-3" />
 )}
 {comment.replies!.length} repl{comment.replies!.length === 1 ? "y" : "ies"}
 </button>
 <AnimatePresence>
 {showReplies && (
 <motion.div
 initial={{ opacity: 0, height: 0 }}
 animate={{ opacity: 1, height: "auto" }}
 exit={{ opacity: 0, height: 0 }}
 className="mt-2 space-y-3 overflow-hidden border-l-2 border-border pl-0"
 >
 {comment.replies!.map((reply) => (
 <CommentItem
 key={reply.id}
 comment={reply}
 depth={depth + 1}
 onReply={onReply}
 onLike={onLike}
 onReport={onReport}
 />
 ))}
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 )}
 </div>
 </div>
 </motion.div>
 )
}

export function CampaignComments({
 comments,
 onAddComment,
 onReply,
 onLike,
 onReport,
 className,
}: CampaignCommentsProps) {
 const [newComment, setNewComment] = useState("")

 const handleSubmit = () => {
 if (!newComment.trim()) return
 onAddComment?.(newComment)
 setNewComment("")
 }

 const handleKeyDown = useCallback(
 (e: React.KeyboardEvent) => {
 if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
 handleSubmit()
 }
 },
 // eslint-disable-next-line react-hooks/exhaustive-deps
 [newComment]
 )

 return (
 <div className={cn("space-y-4", className)}>
 <div className="flex items-center gap-2">
 <MessageSquare className="h-5 w-5 text-muted-foreground" />
 <h2 className="text-xl font-bold">
 Comments
 {comments.length > 0 && (
 <span className="ml-2 text-sm font-normal text-muted-foreground">
 ({comments.length})
 </span>
 )}
 </h2>
 </div>

 {/* Add Comment Form */}
 <Card>
 <CardContent className="p-4">
 <div className="flex gap-3">
 <Avatar size="sm" className="mt-1">
 <AvatarFallback className="bg-green-100 text-green-700 text-xs">
 Y
 </AvatarFallback>
 </Avatar>
 <div className="flex-1">
 <Textarea
 placeholder="Leave a comment..."
 value={newComment}
 onChange={(e) => setNewComment(e.target.value)}
 onKeyDown={handleKeyDown}
 className="min-h-[80px] resize-none"
 maxLength={2000}
 />
 <div className="mt-2 flex items-center justify-between">
 <p className="text-xs text-muted-foreground">
 Press Ctrl+Enter to submit
 </p>
 <Button
 size="sm"
 className="gap-1.5"
 onClick={handleSubmit}
 disabled={!newComment.trim()}
 >
 <Send className="h-3.5 w-3.5" />
 Comment
 </Button>
 </div>
 </div>
 </div>
 </CardContent>
 </Card>

 {/* Comments List */}
 {comments.length === 0 ? (
 <div className="text-center py-12">
 <MessageSquare className="mx-auto h-10 w-10 text-muted-foreground/30 mb-3" />
 <p className="text-sm text-muted-foreground">
 No comments yet. Be the first to share your thoughts!
 </p>
 </div>
 ) : (
 <div className="space-y-4">
 {comments.map((comment) => (
 <CommentItem
 key={comment.id}
 comment={comment}
 onReply={onReply}
 onLike={onLike}
 onReport={onReport}
 />
 ))}
 </div>
 )}
 </div>
 )
}
