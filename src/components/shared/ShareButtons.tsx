"use client"

import { useState } from "react"
import { QRCodeSVG } from "qrcode.react"
import {
 Send,
 Mail,
 LinkIcon,
 Check,
 MessageCircle,
 QrCode,
 Share2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
 Popover,
 PopoverTrigger,
 PopoverContent,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

function FacebookIcon({ className }: { className?: string }) {
 return (
 <svg className={className} viewBox="0 0 24 24" fill="currentColor">
 <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
 </svg>
 )
}

function TwitterIcon({ className }: { className?: string }) {
 return (
 <svg className={className} viewBox="0 0 24 24" fill="currentColor">
 <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
 </svg>
 )
}

interface ShareButtonsProps {
 url: string
 title: string
 className?: string
 variant?: "default" | "compact" | "icons"
}

export function ShareButtons({
 url,
 title,
 className,
 variant = "default",
}: ShareButtonsProps) {
 const [copied, setCopied] = useState(false)

 const encodedUrl = encodeURIComponent(url)
 const encodedTitle = encodeURIComponent(title)

 const shareLinks = [
 {
 name: "Facebook",
 icon: FacebookIcon,
 url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
 color: "hover:bg-blue-600 hover:text-white",
 },
 {
 name: "X (Twitter)",
 icon: TwitterIcon,
 url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
 color: "hover:bg-black hover:text-white",
 },
 {
 name: "WhatsApp",
 icon: MessageCircle,
 url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
 color: "hover:bg-green-600 hover:text-white",
 },
 {
 name: "Telegram",
 icon: Send,
 url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
 color: "hover:bg-sky-500 hover:text-white",
 },
 {
 name: "Email",
 icon: Mail,
 url: `mailto:?subject=${encodedTitle}&body=Check%20out%20this%20campaign:%20${encodedUrl}`,
 color: "hover:bg-amber-500 hover:text-white",
 },
 ]

 const handleCopyLink = async () => {
 try {
 await navigator.clipboard.writeText(url)
 setCopied(true)
 setTimeout(() => setCopied(false), 2000)
 } catch {
 const textArea = document.createElement("textarea")
 textArea.value = url
 document.body.appendChild(textArea)
 textArea.select()
 document.execCommand("copy")
 document.body.removeChild(textArea)
 setCopied(true)
 setTimeout(() => setCopied(false), 2000)
 }
 }

 if (variant === "icons") {
 return (
 <div className={cn("flex items-center gap-1", className)}>
 {shareLinks.map((link) => (
 <Button
 key={link.name}
 variant="ghost"
 size="icon"
 className={cn("h-9 w-9 rounded-full transition-colors", link.color)}
 render={
 <a
 href={link.url}
 target="_blank"
 rel="noopener noreferrer"
 aria-label={`Share on ${link.name}`}
 />
 }
 >
 <link.icon className="h-4 w-4" />
 </Button>
 ))}
 <Button
 variant="ghost"
 size="icon"
 className="h-9 w-9 rounded-full transition-colors hover:bg-primary hover:text-primary-foreground"
 onClick={handleCopyLink}
 aria-label="Copy link"
 >
 {copied ? (
 <Check className="h-4 w-4 text-green-500" />
 ) : (
 <LinkIcon className="h-4 w-4" />
 )}
 </Button>
 <Popover>
 <PopoverTrigger
 render={
 <Button
 variant="ghost"
 size="icon"
 className="h-9 w-9 rounded-full transition-colors hover:bg-muted"
 />
 }
 >
 <QrCode className="h-4 w-4" />
 </PopoverTrigger>
 <PopoverContent className="w-auto p-4" side="top">
 <div className="flex flex-col items-center gap-2">
 <QRCodeSVG value={url} size={160} />
 <p className="text-xs text-muted-foreground">Scan to donate</p>
 </div>
 </PopoverContent>
 </Popover>
 </div>
 )
 }

 if (variant === "compact") {
 return (
 <div className={cn("flex items-center gap-2", className)}>
 {shareLinks.map((link) => (
 <Button
 key={link.name}
 variant="outline"
 size="icon"
 className={cn("h-8 w-8 rounded-full transition-colors", link.color)}
 render={
 <a
 href={link.url}
 target="_blank"
 rel="noopener noreferrer"
 aria-label={`Share on ${link.name}`}
 />
 }
 >
 <link.icon className="h-3.5 w-3.5" />
 </Button>
 ))}
 <Button
 variant="outline"
 size="icon"
 className="h-8 w-8 rounded-full transition-colors"
 onClick={handleCopyLink}
 aria-label="Copy link"
 >
 {copied ? (
 <Check className="h-3.5 w-3.5 text-green-500" />
 ) : (
 <LinkIcon className="h-3.5 w-3.5" />
 )}
 </Button>
 </div>
 )
 }

 return (
 <div className={cn("space-y-3", className)}>
 <div className="flex items-center gap-2">
 <Share2 className="h-4 w-4 text-muted-foreground" />
 <span className="text-sm font-medium">Share this campaign</span>
 </div>
 <div className="flex flex-wrap gap-2">
 {shareLinks.map((link) => (
 <Button
 key={link.name}
 variant="outline"
 size="sm"
 className={cn(
 "gap-2 rounded-full transition-colors",
 link.color
 )}
 render={
 <a
 href={link.url}
 target="_blank"
 rel="noopener noreferrer"
 />
 }
 >
 <link.icon className="h-4 w-4" />
 <span className="hidden sm:inline">{link.name}</span>
 </Button>
 ))}
 </div>
 <Separator />
 <div className="flex items-center gap-2">
 <Button
 variant="outline"
 size="sm"
 className="gap-2 rounded-full"
 onClick={handleCopyLink}
 >
 {copied ? (
 <>
 <Check className="h-4 w-4 text-green-500" />
 Copied!
 </>
 ) : (
 <>
 <LinkIcon className="h-4 w-4" />
 Copy Link
 </>
 )}
 </Button>
 <Popover>
 <PopoverTrigger
 render={
 <Button
 variant="outline"
 size="sm"
 className="gap-2 rounded-full"
 />
 }
 >
 <QrCode className="h-4 w-4" />
 QR Code
 </PopoverTrigger>
 <PopoverContent className="w-auto p-4" side="bottom">
 <div className="flex flex-col items-center gap-3">
 <QRCodeSVG value={url} size={180} />
 <p className="text-xs text-muted-foreground">
 Scan to view campaign
 </p>
 </div>
 </PopoverContent>
 </Popover>
 </div>
 </div>
 )
}
