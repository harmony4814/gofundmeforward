"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
 CreditCard,
 Check,
 Heart,
 Lock,
 Loader2,
 ChevronLeft,
 ChevronRight,
 User,
 Mail,
 MessageSquare,
 EyeOff,
 PartyPopper,
 DollarSign,
 Shield,
 Zap,
} from "lucide-react"
import {
 Dialog,
 DialogContent,
 DialogHeader,
 DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { cn, formatCurrency, calculateProgress } from "@/lib/utils"
import type { DonationItem } from "@/components/shared/CampaignDetailComponents"

interface Campaign {
 id: string
 title: string
 slug: string
 goal: number
 raised: number
 currency?: string
 coverImage?: string
}

interface DonateModalProps {
 isOpen: boolean
 onClose: () => void
 campaign: Campaign
 onSuccess: (donation: DonationItem) => void
}

const presetAmounts = [10, 25, 50, 100, 250, 500]

function PayPalIcon({ className }: { className?: string }) {
 return (
 <svg className={className} viewBox="0 0 24 24" fill="currentColor">
 <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z" />
 </svg>
 )
}

function BankIcon({ className }: { className?: string }) {
 return (
 <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <rect x="2" y="6" width="20" height="12" rx="2" />
 <path d="M2 10h20" />
 <path d="M6 14h.01" />
 <path d="M10 14h.01" />
 <path d="M14 14h.01" />
 </svg>
 )
}

function PaystackIcon({ className }: { className?: string }) {
 return (
 <svg className={className} viewBox="0 0 24 24" fill="currentColor">
 <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-2.09c-1.38-.18-2.5-1.16-2.5-2.41 0-1.34 1.12-2.42 2.5-2.42V9.9l2.1-.6V8.5l-2.1.6V7.03c-2.01.18-3.6 1.59-3.6 3.37 0 1.88 1.52 3.28 3.6 3.47v2.09l2.1-.6v-1.4l-2.1.6v-.47zm2 0v-.47c1.38.18 2.5 1.16 2.5 2.41 0 .58-.22 1.11-.59 1.51l.59.59 1.41-1.41-.59-.59c.37-.4.59-.93.59-1.51 0-1.34-1.12-2.42-2.5-2.42V9.9l-2.1.6v1.4l2.1-.6v.47c-2.01-.18-3.6-1.59-3.6-3.47 0-1.78 1.59-3.19 3.6-3.37V7.03l-2.1.6V8.5l2.1-.6v1.4l-2.1.6v2.09c1.38.18 2.5 1.16 2.5 2.41 0 1.34-1.12 2.42-2.5 2.42v2.09h1z" />
 </svg>
 )
}

function FlutterwaveIcon({ className }: { className?: string }) {
 return (
 <svg className={className} viewBox="0 0 24 24" fill="currentColor">
 <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
 </svg>
 )
}

const paymentMethods = [
 {
 id: "stripe",
 name: "Credit / Debit Card",
 icon: CreditCard,
 description: "Visa, Mastercard, AMEX via Stripe",
 },
 {
 id: "paypal",
 name: "PayPal",
 icon: PayPalIcon,
 description: "Pay with your PayPal account",
 },
 {
 id: "paystack",
 name: "Paystack",
 icon: PaystackIcon,
 description: "Cards, Bank Transfer, Mobile Money",
 },
 {
 id: "flutterwave",
 name: "Flutterwave",
 icon: FlutterwaveIcon,
 description: "Cards, Bank, USSD, Mobile Money",
 },
 {
 id: "bank",
 name: "Bank Transfer",
 icon: BankIcon,
 description: "Direct bank transfer",
 },
]

const slideVariants = {
 enter: (direction: number) => ({
 x: direction > 0 ? 80 : -80,
 opacity: 0,
 }),
 center: { x: 0, opacity: 1 },
 exit: (direction: number) => ({
 x: direction < 0 ? 80 : -80,
 opacity: 0,
 }),
}

export function DonateModal({ isOpen, onClose, campaign, onSuccess }: DonateModalProps) {
 const [step, setStep] = useState(0)
 const [direction, setDirection] = useState(0)
 const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
 const [customAmount, setCustomAmount] = useState("")
 const [name, setName] = useState("")
 const [email, setEmail] = useState("")
 const [anonymous, setAnonymous] = useState(false)
 const [message, setMessage] = useState("")
 const [paymentMethod, setPaymentMethod] = useState("stripe")
 const [isProcessing, setIsProcessing] = useState(false)
 const [isSuccess, setIsSuccess] = useState(false)

 const currency = campaign.currency || "USD"
 const donationAmount = selectedAmount || parseFloat(customAmount) || 0
 const progress = calculateProgress(campaign.raised, campaign.goal)

 const stepLabels = ["Amount", "Details", "Payment"]

 const canProceed = useMemo(() => {
 switch (step) {
 case 0:
 return donationAmount > 0
 case 1:
 return true
 case 2:
 return paymentMethod.length > 0
 default:
 return false
 }
 }, [step, donationAmount, paymentMethod])

 const goToStep = (newStep: number) => {
 setDirection(newStep > step ? 1 : -1)
 setStep(newStep)
 }

 const handleNext = () => {
 if (step < 2 && canProceed) goToStep(step + 1)
 }

 const handleBack = () => {
 if (step > 0) goToStep(step - 1)
 }

 const handleDonate = async () => {
 if (!canProceed) return
 setIsProcessing(true)

 // Simulate payment processing
 await new Promise((resolve) => setTimeout(resolve, 2500))

 const donation: DonationItem = {
 id: `donation-${Date.now()}`,
 donorName: anonymous ? null : name || null,
 amount: donationAmount,
 currency,
 message: message || null,
 anonymous,
 createdAt: new Date().toISOString(),
 }

 setIsProcessing(false)
 setIsSuccess(true)
 onSuccess(donation)
 }

 const handleClose = () => {
 onClose()
 setTimeout(() => {
 setStep(0)
 setSelectedAmount(null)
 setCustomAmount("")
 setName("")
 setEmail("")
 setAnonymous(false)
 setMessage("")
 setPaymentMethod("stripe")
 setIsProcessing(false)
 setIsSuccess(false)
 }, 300)
 }

 const selectAmount = (amount: number) => {
 setSelectedAmount(amount)
 setCustomAmount("")
 }

 const handleCustomAmountChange = (value: string) => {
 const cleaned = value.replace(/[^0-9.]/g, "")
 if (cleaned.split(".").length <= 2) {
 setCustomAmount(cleaned)
 setSelectedAmount(null)
 }
 }

 return (
 <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
 <DialogContent className="sm:max-w-[720px] max-h-[90vh] overflow-hidden p-0 gap-0">
 <div className="flex flex-col lg:flex-row">
 {/* Sidebar - Campaign Summary */}
 <div className="hidden lg:flex w-[240px] shrink-0 flex-col bg-muted/40 p-5 border-r">
 <div className="mb-4">
 <h3 className="text-sm font-semibold line-clamp-2 mb-3">
 {campaign.title}
 </h3>
 <div className="relative h-28 w-full overflow-hidden rounded-lg bg-muted">
 {campaign.coverImage ? (
 <img
 src={campaign.coverImage}
 alt={campaign.title}
 className="h-full w-full object-cover"
 />
 ) : (
 <div className="flex h-full items-center justify-center">
 <Heart className="h-8 w-8 text-muted-foreground/40" />
 </div>
 )}
 </div>
 </div>

 <div className="space-y-3">
 <div className="space-y-1.5">
 <div className="flex justify-between text-sm">
 <span className="font-semibold text-foreground">
 {formatCurrency(campaign.raised, currency)}
 </span>
 </div>
 <span className="text-xs text-muted-foreground">
 raised of {formatCurrency(campaign.goal, currency)} goal
 </span>
 <div className="h-2 w-full overflow-hidden rounded-full bg-border">
 <motion.div
 className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-400"
 initial={{ width: 0 }}
 animate={{ width: `${progress}%` }}
 transition={{ duration: 0.8, ease: "easeOut" }}
 />
 </div>
 <span className="text-xs text-muted-foreground">
 {progress}% funded
 </span>
 </div>
 </div>

 <Separator className="my-4" />

 <div className="mt-auto space-y-2">
 <div className="flex items-center gap-2 text-xs text-muted-foreground">
 <Lock className="h-3 w-3" />
 <span>Secure 256-bit SSL encryption</span>
 </div>
 <div className="flex items-center gap-2 text-xs text-muted-foreground">
 <Check className="h-3 w-3" />
 <span>100% goes to the campaign</span>
 </div>
 </div>
 </div>

 {/* Main Content */}
 <div className="flex flex-1 flex-col min-w-0">
 <DialogHeader className="p-5 pb-0">
 <div className="flex items-center justify-between">
 <DialogTitle className="text-lg">
 {isSuccess ? "Thank You!" : "Make a Donation"}
 </DialogTitle>
 {!isSuccess && (
 <span className="text-xs text-muted-foreground font-medium tabular-nums">
 Step {step + 1} of 3
 </span>
 )}
 </div>

 {/* Progress Indicator */}
 {!isSuccess && (
 <div className="mt-3 flex items-center gap-1">
 {stepLabels.map((label, i) => (
 <div key={label} className="flex flex-1 items-center gap-1">
 <div className="flex items-center gap-1.5">
 <div
 className={cn(
 "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium transition-colors",
 i <= step
 ? "bg-green-500 text-white"
 : "bg-muted text-muted-foreground"
 )}
 >
 {i < step ? (
 <Check className="h-3 w-3" />
 ) : (
 i + 1
 )}
 </div>
 <span
 className={cn(
 "hidden text-xs font-medium sm:block",
 i <= step ? "text-foreground" : "text-muted-foreground"
 )}
 >
 {label}
 </span>
 </div>
 {i < stepLabels.length - 1 && (
 <div
 className={cn(
 "mx-1 h-px flex-1 transition-colors",
 i < step ? "bg-green-500" : "bg-border"
 )}
 />
 )}
 </div>
 ))}
 </div>
 )}
 </DialogHeader>

 <Separator className="mt-4" />

 {/* Step Content */}
 <div className="relative min-h-[320px] overflow-hidden">
 <AnimatePresence mode="wait" custom={direction}>
 {isSuccess ? (
 <motion.div
 key="success"
 initial={{ opacity: 0, scale: 0.9 }}
 animate={{ opacity: 1, scale: 1 }}
 className="flex flex-col items-center justify-center p-8 text-center"
 >
 <motion.div
 initial={{ scale: 0 }}
 animate={{ scale: 1 }}
 transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
 className="relative mb-6"
 >
 <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
 <PartyPopper className="h-10 w-10 text-green-600" />
 </div>
 {[...Array(8)].map((_, i) => (
 <motion.div
 key={i}
 initial={{ opacity: 1, scale: 0 }}
 animate={{
 opacity: 0,
 scale: 1.5,
 x: Math.cos((i * Math.PI * 2) / 8) * 60,
 y: Math.sin((i * Math.PI * 2) / 8) * 60,
 }}
 transition={{
 duration: 1,
 delay: 0.4 + i * 0.05,
 ease: "easeOut",
 }}
 className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
 style={{
 backgroundColor: [
 "#22c55e",
 "#3b82f6",
 "#f59e0b",
 "#ec4899",
 "#8b5cf6",
 "#f97316",
 "#06b6d4",
 "#ef4444",
 ][i],
 }}
 />
 ))}
 </motion.div>

 <motion.h3
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.5 }}
 className="text-xl font-bold mb-2"
 >
 Donation Successful!
 </motion.h3>
 <motion.p
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.6 }}
 className="text-muted-foreground mb-1"
 >
 You donated{" "}
 <span className="font-semibold text-foreground">
 {formatCurrency(donationAmount, currency)}
 </span>{" "}
 to
 </motion.p>
 <motion.p
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.7 }}
 className="font-medium text-foreground mb-6"
 >
 {campaign.title}
 </motion.p>
 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.8 }}
 className="flex gap-3"
 >
 <Button variant="outline" onClick={handleClose}>
 Close
 </Button>
 <Button
 onClick={handleClose}
 className="bg-green-600 hover:bg-green-700"
 >
 View Campaign
 </Button>
 </motion.div>
 </motion.div>
 ) : (
 <motion.div
 key={step}
 custom={direction}
 variants={slideVariants}
 initial="enter"
 animate="center"
 exit="exit"
 transition={{ duration: 0.25, ease: "easeInOut" }}
 className="absolute inset-0 p-5"
 >
 {step === 0 && (
 <div className="space-y-5">
 <div>
 <Label className="text-sm font-medium mb-3 block">
 Select donation amount
 </Label>
 <div className="grid grid-cols-3 gap-2">
 {presetAmounts.map((amount) => (
 <Button
 key={amount}
 variant={
 selectedAmount === amount ? "default" : "outline"
 }
 size="lg"
 className={cn(
 "h-12 text-base font-semibold",
 selectedAmount === amount &&
 "bg-green-600 hover:bg-green-700 text-white"
 )}
 onClick={() => selectAmount(amount)}
 >
 ${amount}
 </Button>
 ))}
 </div>
 </div>

 <div>
 <Label htmlFor="custom-amount" className="text-sm font-medium mb-2 block">
 Or enter custom amount
 </Label>
 <div className="relative">
 <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
 <Input
 id="custom-amount"
 type="text"
 inputMode="decimal"
 placeholder="0.00"
 value={customAmount}
 onChange={(e) =>
 handleCustomAmountChange(e.target.value)
 }
 className={cn(
 "h-12 pl-8 text-lg font-semibold",
 customAmount && "border-green-500 ring-green-500/20"
 )}
 />
 </div>
 </div>

 {donationAmount > 0 && (
 <motion.div
 initial={{ opacity: 0, y: -10 }}
 animate={{ opacity: 1, y: 0 }}
 className="rounded-lg bg-green-50 p-3 text-center"
 >
 <span className="text-sm text-muted-foreground">
 You will donate{" "}
 </span>
 <span className="text-lg font-bold text-green-600">
 {formatCurrency(donationAmount, currency)}
 </span>
 </motion.div>
 )}
 </div>
 )}

 {step === 1 && (
 <div className="space-y-4">
 <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
 <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
 <DollarSign className="h-5 w-5 text-green-600" />
 </div>
 <div>
 <p className="text-sm text-muted-foreground">Donation amount</p>
 <p className="font-bold text-green-600">
 {formatCurrency(donationAmount, currency)}
 </p>
 </div>
 </div>

 {!anonymous && (
 <>
 <div className="space-y-2">
 <Label htmlFor="donor-name" className="text-sm">
 Full Name
 <span className="ml-1 text-muted-foreground font-normal">(optional)</span>
 </Label>
 <div className="relative">
 <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
 <Input
 id="donor-name"
 placeholder="John Doe"
 value={name}
 onChange={(e) => setName(e.target.value)}
 className="h-10 pl-9"
 />
 </div>
 </div>

 <div className="space-y-2">
 <Label htmlFor="donor-email" className="text-sm">
 Email Address
 <span className="ml-1 text-muted-foreground font-normal">(for receipt)</span>
 </Label>
 <div className="relative">
 <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
 <Input
 id="donor-email"
 type="email"
 placeholder="john@example.com"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 className="h-10 pl-9"
 />
 </div>
 </div>
 </>
 )}

 <button
 type="button"
 onClick={() => setAnonymous(!anonymous)}
 className={cn(
 "flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors",
 anonymous
 ? "border-green-500 bg-green-50"
 : "hover:bg-muted/50"
 )}
 >
 <div
 className={cn(
 "flex h-5 w-5 items-center justify-center rounded border transition-colors",
 anonymous
 ? "border-green-500 bg-green-500 text-white"
 : "border-border"
 )}
 >
 {anonymous && <Check className="h-3 w-3" />}
 </div>
 <div className="flex items-center gap-2">
 <EyeOff className="h-4 w-4 text-muted-foreground" />
 <span className="text-sm font-medium">
 Donate anonymously
 </span>
 </div>
 </button>

 <div className="space-y-2">
 <Label htmlFor="donor-message" className="text-sm">
 Leave a word of encouragement
 <span className="ml-1 text-muted-foreground font-normal">
 (optional)
 </span>
 </Label>
 <div className="relative">
 <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
 <Textarea
 id="donor-message"
 placeholder="Write something encouraging..."
 value={message}
 onChange={(e) => setMessage(e.target.value)}
 className="min-h-[80px] pl-9 resize-none"
 maxLength={500}
 />
 </div>
 <p className="text-right text-xs text-muted-foreground">
 {message.length}/500
 </p>
 </div>
 </div>
 )}

 {step === 2 && (
 <div className="space-y-4">
 <div className="rounded-lg bg-muted/50 p-4">
 <h4 className="text-sm font-medium mb-1">
 Donation Summary
 </h4>
 <div className="flex justify-between text-sm">
 <span className="text-muted-foreground">
 {anonymous ? "Anonymous" : name || "Donor"}
 </span>
 <span className="font-bold text-green-600">
 {formatCurrency(donationAmount, currency)}
 </span>
 </div>
 {message && (
 <p className="mt-1 text-xs text-muted-foreground italic">
 &ldquo;{message}&rdquo;
 </p>
 )}
 </div>

 <Label className="text-sm font-medium">
 Select payment method
 </Label>

 <div className="space-y-2">
 {paymentMethods.map((method) => (
 <button
 key={method.id}
 type="button"
 onClick={() => setPaymentMethod(method.id)}
 className={cn(
 "flex w-full items-center gap-4 rounded-lg border p-4 text-left transition-all",
 paymentMethod === method.id
 ? "border-green-500 bg-green-50 ring-1 ring-green-500/20"
 : "hover:border-border/80 hover:bg-muted/50"
 )}
 >
 <div
 className={cn(
 "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors",
 paymentMethod === method.id
 ? "border-green-500"
 : "border-border"
 )}
 >
 {paymentMethod === method.id && (
 <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
 )}
 </div>
 <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
 <method.icon className="h-5 w-5" />
 </div>
 <div className="flex-1">
 <p className="text-sm font-medium">
 {method.name}
 </p>
 <p className="text-xs text-muted-foreground">
 {method.description}
 </p>
 </div>
 </button>
 ))}
 </div>

 <div className="rounded-lg bg-amber-50 p-3">
 <div className="flex items-start gap-2">
 <Lock className="mt-0.5 h-4 w-4 text-amber-600 shrink-0" />
 <p className="text-xs text-amber-700">
 Your payment information is encrypted and secure.
 We never store your card details.
 </p>
 </div>
 </div>
 </div>
 )}
 </motion.div>
 )}
 </AnimatePresence>
 </div>

 {/* Footer */}
 {!isSuccess && (
 <div className="mt-auto border-t p-5">
 {/* Mobile campaign summary */}
 <div className="mb-4 flex items-center justify-between rounded-lg bg-muted/50 p-3 lg:hidden">
 <div>
 <p className="text-xs text-muted-foreground">
 Donating to
 </p>
 <p className="text-sm font-medium line-clamp-1">
 {campaign.title}
 </p>
 </div>
 {donationAmount > 0 && (
 <span className="text-lg font-bold text-green-600">
 {formatCurrency(donationAmount, currency)}
 </span>
 )}
 </div>

 <div className="flex items-center gap-3">
 {step > 0 && (
 <Button
 variant="outline"
 onClick={handleBack}
 disabled={isProcessing}
 className="gap-1"
 >
 <ChevronLeft className="h-4 w-4" />
 Back
 </Button>
 )}
 <div className="flex-1" />
 {step < 2 ? (
 <Button
 onClick={handleNext}
 disabled={!canProceed}
 className="gap-1 bg-green-600 hover:bg-green-700 text-white min-w-[140px]"
 >
 Continue
 <ChevronRight className="h-4 w-4" />
 </Button>
 ) : (
 <Button
 onClick={handleDonate}
 disabled={isProcessing || !canProceed}
 className="gap-2 bg-green-600 hover:bg-green-700 text-white min-w-[180px] h-11"
 >
 {isProcessing ? (
 <>
 <Loader2 className="h-4 w-4 animate-spin" />
 Processing...
 </>
 ) : (
 <>
 <Heart className="h-4 w-4" />
 Donate {donationAmount > 0 ? formatCurrency(donationAmount, currency) : "Now"}
 </>
 )}
 </Button>
 )}
 </div>
 </div>
 )}
 </div>
 </div>
 </DialogContent>
 </Dialog>
 )
}
