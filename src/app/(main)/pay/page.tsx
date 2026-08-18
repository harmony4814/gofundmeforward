"use client"

import { useState, useEffect, useMemo, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import {
 Heart,
 ArrowLeft,
 Copy,
 CheckCircle,
 Check,
 Loader2,
 PartyPopper,
 Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn, formatCurrency } from "@/lib/utils"
import { useCampaignStore } from "@/store/campaign-store"
import { mockCampaigns } from "@/lib/data"

function BitcoinIcon({ className }: { className?: string }) {
 return (
  <svg className={className} viewBox="0 0 32 32" fill="none">
   <circle cx="16" cy="16" r="16" fill="#F7931A" />
   <path d="M22.86 13.9c.34-2.3-1.4-3.53-3.78-4.4l.77-3.1-1.88-.47-.75 3.02c-.5-.12-1.01-.23-1.53-.34l.76-3.05-1.87-.47-.76 3.1c-.41-.1-.82-.19-1.22-.29l0 0-2.59-.65-.5 2.01s1.4.32 1.37.34c.76.19.9.68.88 1.07l-.88 3.53c.05.01.12.03.2.06l-.2-.05-1.24 4.97c-.09.23-.33.57-.85.44.02.03-1.37-.34-1.37-.34l-.94 2.17 2.45.61c.45.11.9.23 1.34.34l-.78 3.14 1.87.47.77-3.08c.51.13 1.02.25 1.51.36l-.77 3.08 1.88.47.78-3.12c3.24.61 5.67.37 6.7-2.55.76-2.33-.04-3.67-1.59-4.55 1.14-.27 2-1.01 2.23-2.54zm-4.3 6.04c-.53 2.14-4.16.99-5.34.7l.95-3.8c1.17.29 5.1.86 4.39 3.1zm.54-6.09c-4.86 1.46-7.73.73-8.35-.72.53-1.13 4.1-1.22 7.26-.88l1.07-4.3c.22.06.45.12.64.17l-.62 5.73z" fill="white" />
  </svg>
 )
}

function CashAppIcon({ className }: { className?: string }) {
 return (
  <svg className={className} viewBox="0 0 24 24" fill="#00D632">
   <path d="M23.59 3.475a5.1 5.1 0 00-3.05-3.05c-1.31-.42-2.5-.42-4.92-.42H8.36c-2.4 0-3.61 0-4.9.4a5.1 5.1 0 00-3.05 3.06C0 4.765 0 5.965 0 8.365v7.27c0 2.41 0 3.6.4 4.9a5.1 5.1 0 003.05 3.05c1.3.41 2.5.41 4.9.41h7.28c2.41 0 3.61 0 4.9-.4a5.1 5.1 0 003.06-3.06c.41-1.3.41-2.5.41-4.9v-7.25c0-2.41 0-3.61-.41-4.91zm-6.17 4.63l-.93.93a.5.5 0 01-.67.01 5 5 0 00-3.22-1.18c-.97 0-1.94.32-1.94 1.21 0 .9 1.04 1.2 2.24 1.65 2.1.7 3.84 1.58 3.84 3.64 0 2.24-1.74 3.78-4.58 3.95l-.26 1.2a.49.49 0 01-.48.39H9.63l-.09-.01a.5.5 0 01-.38-.59l.28-1.27a6.54 6.54 0 01-2.88-1.57v-.01a.48.48 0 010-.68l1-.97a.49.49 0 01.67 0c.91.86 2.13 1.34 3.39 1.32 1.3 0 2.17-.55 2.17-1.42 0-.87-.88-1.1-2.54-1.72-1.76-.63-3.43-1.52-3.43-3.6 0-2.42 2.01-3.6 4.39-3.71l.25-1.23a.48.48 0 01.48-.38h1.78l.1.01c.26.06.43.31.37.57l-.27 1.37c.9.3 1.75.77 2.48 1.39l.02.02c.19.2.19.5 0 .68z" />
  </svg>
 )
}

function PayPalIcon({ className }: { className?: string }) {
 return (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
   <path d="M7.076 21.337H2.47a.641.641 0 01-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797H9.603c-.536 0-.99.396-1.073.925L7.076 21.337z" fill="#003087"/>
   <path d="M18.164 6.499c-.022.144-.046.289-.076.438-.982 5.051-4.342 6.798-8.64 6.798H8.195a1.065 1.065 0 00-1.05 1.135l-.467 2.958-.132.837a.541.541 0 00.53.623h4.248a.9.9 0 00.89-.77l.028-.145.688-4.363.044-.24a.9.9 0 01.89-.77h.56c3.59 0 6.41-1.462 7.218-5.693.338-1.78.163-3.277-.906-4.338a3.54 3.54 0 01-.357-.256l.027.124z" fill="#0070E0"/>
   <path d="M17.466 3.778c.716.81 1.107 1.963.877 3.428-.017.109-.036.218-.057.328H13.74a.86.86 0 00-.851.745l-.867 5.49-.024.14a.86.86 0 01.85-.745h2.35a1.065 1.065 0 001.05-1.135l.002-.012.604-3.824.038-.238a1.065 1.065 0 00-1.052-1.135h-3.93a.45.45 0 01-.443-.382l-.293-1.855a.45.45 0 01.443-.518H17.466z" fill="#009CDE"/>
  </svg>
 )
}

function PayPageContent() {
 const searchParams = useSearchParams()
 const router = useRouter()

 const cid = searchParams.get("cid") || ""
 const amt = parseFloat(searchParams.get("amt") || "0")
 const method = searchParams.get("method") || "bitcoin"
 const donorName = searchParams.get("name") || ""
 const donorEmail = searchParams.get("email") || ""
 const message = searchParams.get("message") || ""
 const anonymous = searchParams.get("anon") === "true"
 const currency = searchParams.get("currency") || "USD"

 const [copied, setCopied] = useState(false)
 const [isConfirming, setIsConfirming] = useState(false)
 const [isSuccess, setIsSuccess] = useState(false)

 const [bitcoinWallet, setBitcoinWallet] = useState("")
 const [cashappCashtag, setCashappCashtag] = useState("")
 const [paypalEmail, setPaypalEmail] = useState("")
 const [bitcoinQr, setBitcoinQr] = useState("")
 const [cashappQr, setCashappQr] = useState("")
 const [paypalQr, setPaypalQr] = useState("")

 const userCampaigns = useCampaignStore((s) => s.userCampaigns)

 const campaign = useMemo(() => {
  return (
   mockCampaigns.find((c) => c.id === cid) ??
   userCampaigns.find((c) => c.id === cid)
  )
 }, [cid, userCampaigns])

 useEffect(() => {
  try {
   const raw = localStorage.getItem("ff_payment_settings")
   if (raw) {
     const data = JSON.parse(raw)
     setBitcoinWallet(data.bitcoin_wallet || "")
     setCashappCashtag(data.cashapp_cashtag || "")
     setPaypalEmail(data.paypal_email || "")
     setBitcoinQr(data.bitcoin_qr || "")
     setCashappQr(data.cashapp_qr || "")
     setPaypalQr(data.paypal_qr || "")
   }
  } catch {}
 }, [])

 const isBitcoin = method === "bitcoin"
 const isCashapp = method === "cashapp"
 const isPaypal = method === "paypal"
 const walletAddress = isBitcoin ? bitcoinWallet : isCashapp ? (cashappCashtag ? `$${cashappCashtag}` : "") : paypalEmail
 const qrImage = isBitcoin ? bitcoinQr : isCashapp ? cashappQr : paypalQr
 const label = isBitcoin ? "Bitcoin Wallet Address" : isCashapp ? "Cash App Cashtag" : "PayPal Email"

 const copyAddress = () => {
  navigator.clipboard.writeText(walletAddress)
  setCopied(true)
  setTimeout(() => setCopied(false), 2000)
 }

 const handleConfirmPayment = async () => {
  setIsConfirming(true)

  const supabase = (await import("@/lib/supabase/client")).createClient()

  try {
   await supabase
    .from("donations")
    .insert({
     campaign_id: cid,
     donor_name: anonymous ? null : donorName || null,
     donor_email: donorEmail || null,
     amount: amt,
     message: message || null,
     anonymous,
     payment_method: method,
     payment_status: "pending",
    })
  } catch {}

  // Update campaign raised
  if (campaign) {
   try {
    await supabase
     .from("campaigns")
     .update({
      raised: (campaign.raised || 0) + amt,
      donors: (campaign.donorCount || 0) + 1,
     })
     .eq("id", cid)
   } catch {}
  }

  setIsConfirming(false)
  setIsSuccess(true )
 }

 if (!campaign) {
  return (
   <div className="flex min-h-[60vh] items-center justify-center">
    <div className="text-center space-y-4">
     <p className="text-muted-foreground">Campaign not found.</p>
     <Link href="/campaigns">
      <Button variant="outline">Browse Campaigns</Button>
     </Link>
    </div>
   </div>
  )
 }

 if (isSuccess) {
  return (
   <div className="mx-auto max-w-lg px-4 py-20">
    <motion.div
     initial={{ opacity: 0, scale: 0.9 }}
     animate={{ opacity: 1, scale: 1 }}
     className="text-center space-y-6"
    >
     <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
      className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#CDF88D]"
     >
      <PartyPopper className="h-12 w-12 text-[#CDF88D]" />
     </motion.div>
     <h1 className="text-3xl font-bold">Donation Recorded!</h1>
     <p className="text-muted-foreground">
      Thank you for donating <span className="font-bold text-foreground">{formatCurrency(amt, currency)}</span> to <span className="font-bold text-foreground">{campaign.title}</span>
     </p>
     <div className="rounded-lg bg-amber-50 p-4">
      <p className="text-sm text-amber-700">
        Your donation will be confirmed after payment is verified.
      </p>
     </div>
     <div className="flex justify-center gap-3">
      <Link href={`/campaigns/${campaign.slug}`}>
       <Button variant="outline">View Campaign</Button>
      </Link>
      <Link href="/">
       <Button className="bg-[#CDF88D] hover:bg-[#CDF88D]">Back to Home</Button>
      </Link>
     </div>
    </motion.div>
   </div>
  )
 }

 return (
  <div className="mx-auto max-w-lg px-4 py-10">
   <Link
    href="#"
    onClick={(e) => { e.preventDefault(); router.back() }}
    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
   >
    <ArrowLeft className="h-4 w-4" />
    Back to donation
   </Link>

   <div className="space-y-6">
    {/* Header */}
    <div className="text-center space-y-2">
      <div className="flex items-center justify-center gap-2">
       {isBitcoin ? (
        <BitcoinIcon className="h-8 w-8" />
       ) : isPaypal ? (
        <PayPalIcon className="h-8 w-8" />
       ) : (
        <CashAppIcon className="h-8 w-8" />
       )}
       <h1 className="text-2xl font-bold">
        Pay with {isBitcoin ? "Bitcoin" : isPaypal ? "PayPal" : "Cash App"}
       </h1>
      </div>
     <p className="text-muted-foreground">
      Donate <span className="font-bold text-[#CDF88D]">{formatCurrency(amt, currency)}</span> to <span className="font-semibold">{campaign.title}</span>
     </p>
    </div>

    {/* QR Code */}
    {qrImage && (
     <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-center"
     >
      <div className="h-56 w-56 overflow-hidden rounded-2xl border-2 bg-white p-3 shadow-sm">
        <img
         src={qrImage}
         alt={`${isBitcoin ? "Bitcoin" : isPaypal ? "PayPal" : "Cash App"} QR Code`}
         className="h-full w-full object-contain"
        />
      </div>
     </motion.div>
    )}

    {/* Payment Address */}
    {walletAddress ? (
     <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-xl border bg-muted/30 p-5 space-y-3"
     >
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
       {label}
      </p>
      <div className="flex items-center gap-2 rounded-lg bg-background p-3 border">
       <p className="flex-1 text-sm font-mono font-medium break-all select-all">
        {walletAddress}
       </p>
       <Button
        variant="ghost"
        size="icon"
        onClick={copyAddress}
        className="shrink-0"
       >
        {copied ? (
         <CheckCircle className="h-5 w-5 text-[#CDF88D]" />
        ) : (
         <Copy className="h-5 w-5" />
        )}
       </Button>
      </div>
      <p className="text-xs text-muted-foreground text-center">
        {copied ? "Copied to clipboard!" : "Click the copy button to copy the address"}
      </p>
     </motion.div>
    ) : (
      <div className="rounded-xl bg-amber-50 p-5 text-center">
       <p className="text-sm text-amber-700">
        {isBitcoin
         ? "Bitcoin wallet address has not been configured by admin yet."
         : isPaypal
         ? "PayPal email has not been configured by admin yet."
         : "Cash App cashtag has not been configured by admin yet."}
       </p>
       <p className="text-xs text-amber-600 mt-1">Please contact the site admin.</p>
      </div>
    )}

    {/* Donor Info */}
    {(donorName || message) && (
     <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-xl border p-4 space-y-2"
     >
      {donorName && (
       <p className="text-sm">
        <span className="text-muted-foreground">Donating as: </span>
        <span className="font-medium">{anonymous ? "Anonymous" : donorName}</span>
       </p>
      )}
      {message && (
       <p className="text-sm italic text-muted-foreground">&ldquo;{message}&rdquo;</p>
      )}
     </motion.div>
    )}

    {/* Confirm Button */}
    <motion.div
     initial={{ opacity: 0, y: 10 }}
     animate={{ opacity: 1, y: 0 }}
     transition={{ delay: 0.3 }}
     className="space-y-3"
    >
     <Button
      onClick={handleConfirmPayment}
      disabled={isConfirming || !walletAddress}
      className="w-full h-12 bg-[#CDF88D] hover:bg-[#CDF88D] text-[#14532d] text-base font-semibold"
     >
      {isConfirming ? (
       <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Recording donation...
       </>
      ) : (
       <>
        <Check className="mr-2 h-4 w-4" />
        I&apos;ve Completed Payment
       </>
      )}
     </Button>
     <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
      <Shield className="h-3 w-3" />
      <span>Payment will be verified</span>
     </div>
    </motion.div>
   </div>
  </div>
 )
}

export default function PayPage() {
 return (
  <Suspense fallback={
   <div className="flex min-h-[60vh] items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-[#CDF88D]" />
   </div>
  }>
   <PayPageContent />
  </Suspense>
 )
}
