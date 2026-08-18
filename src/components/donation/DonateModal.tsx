"use client"

import { useState, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
 Check,
 Heart,
 Loader2,
 ChevronLeft,
 ChevronRight,
 User,
 Mail,
 MessageSquare,
 EyeOff,
 DollarSign,
 Copy,
 CheckCircle,
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

function BitcoinIcon({ className }: { className?: string }) {
 return (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
   <circle cx="16" cy="16" r="16" fill="#F7931A" />
   <path d="M22.86 13.9c.34-2.3-1.4-3.53-3.78-4.4l.77-3.1-1.88-.47-.75 3.02c-.5-.12-1.01-.23-1.53-.34l.76-3.05-1.87-.47-.76 3.1c-.41-.1-.82-.19-1.22-.29l0 0-2.59-.65-.5 2.01s1.4.32 1.37.34c.76.19.9.68.88 1.07l-.88 3.53c.05.01.12.03.2.06l-.2-.05-1.24 4.97c-.09.23-.33.57-.85.44.02.03-1.37-.34-1.37-.34l-.94 2.17 2.45.61c.45.11.9.23 1.34.34l-.78 3.14 1.87.47.77-3.08c.51.13 1.02.25 1.51.36l-.77 3.08 1.88.47.78-3.12c3.24.61 5.67.37 6.7-2.55.76-2.33-.04-3.67-1.59-4.55 1.14-.27 2-1.01 2.23-2.54zm-4.3 6.04c-.53 2.14-4.16.99-5.34.7l.95-3.8c1.17.29 5.1.86 4.39 3.1zm.54-6.09c-4.86 1.46-7.73.73-8.35-.72.53-1.13 4.1-1.22 7.26-.88l1.07-4.3c.22.06.45.12.64.17l-.62 5.73z" fill="white" />
  </svg>
 )
}

function CashAppIcon({ className }: { className?: string }) {
 return (
  <svg className={className} viewBox="0 0 24 24" fill="#00D632" xmlns="http://www.w3.org/2000/svg">
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

const paymentMethods = [
 {
  id: "cashapp",
  name: "Cash App",
  icon: CashAppIcon,
  description: "Pay with Cash App",
 },
 {
  id: "paypal",
  name: "PayPal",
  icon: PayPalIcon,
  description: "Pay with PayPal",
 },
 {
  id: "bitcoin",
  name: "Bitcoin",
  icon: BitcoinIcon,
  description: "Optional",
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
 const router = useRouter()
 const [step, setStep] = useState(0)
 const [direction, setDirection] = useState(0)
 const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
 const [customAmount, setCustomAmount] = useState("")
 const [name, setName] = useState("")
 const [email, setEmail] = useState("")
 const [anonymous, setAnonymous] = useState(false)
 const [message, setMessage] = useState("")
 const [paymentMethod, setPaymentMethod] = useState("cashapp")

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

 const handleGoToPay = useCallback(() => {
  const params = new URLSearchParams({
   cid: campaign.id,
   amt: String(donationAmount),
   method: paymentMethod,
   currency,
   name,
   email,
   message,
   anon: String(anonymous),
  })
  onClose()
  router.push(`/pay?${params.toString()}`)
 }, [campaign.id, donationAmount, paymentMethod, currency, name, email, message, anonymous, onClose, router])

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
    setPaymentMethod("bitcoin")
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
       className="h-full rounded-full bg-gradient-to-r from-[#CDF88D] to-[#CDF88D]"
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
      <Check className="h-3 w-3" />
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
       Make a Donation
      </DialogTitle>
      <span className="text-xs text-muted-foreground font-medium tabular-nums">
       Step {step + 1} of 3
      </span>
    </div>

    {/* Progress Indicator */}
     <div className="mt-3 flex items-center gap-1">
      {stepLabels.map((label, i) => (
       <div key={label} className="flex flex-1 items-center gap-1">
        <div className="flex items-center gap-1.5">
         <div
          className={cn(
           "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium transition-colors",
           i <= step
            ? "bg-[#CDF88D] text-[#14532d]"
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
           i < step ? "bg-[#CDF88D]" : "bg-border"
          )}
         />
        )}
       </div>
      ))}
      </div>
    </DialogHeader>

   <Separator className="mt-4" />

   {/* Step Content */}
    <div className="relative min-h-[320px] overflow-x-hidden">
     <AnimatePresence mode="wait" custom={direction}>
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
              "bg-[#CDF88D] hover:bg-[#CDF88D] text-[#14532d]"
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
             customAmount && "border-[#CDF88D] ring-[#CDF88D]/20"
            )}
           />
          </div>
         </div>

         {donationAmount > 0 && (
          <motion.div
           initial={{ opacity: 0, y: -10 }}
           animate={{ opacity: 1, y: 0 }}
           className="rounded-lg bg-[#CDF88D] p-3 text-center"
          >
           <span className="text-sm text-muted-foreground">
            You will donate{" "}
           </span>
           <span className="text-lg font-bold text-[#CDF88D]">
            {formatCurrency(donationAmount, currency)}
           </span>
          </motion.div>
         )}
        </div>
       )}

       {step === 1 && (
        <div className="space-y-4">
         <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#CDF88D]">
           <DollarSign className="h-5 w-5 text-[#CDF88D]" />
          </div>
          <div>
           <p className="text-sm text-muted-foreground">Donation amount</p>
           <p className="font-bold text-[#CDF88D]">
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
            ? "border-[#CDF88D] bg-[#CDF88D]"
            : "hover:bg-muted/50"
          )}
         >
          <div
           className={cn(
            "flex h-5 w-5 items-center justify-center rounded border transition-colors",
            anonymous
             ? "border-[#CDF88D] bg-[#CDF88D] text-[#14532d]"
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
           <span className="font-bold text-[#CDF88D]">
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
          Choose how to pay
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
              ? "border-[#CDF88D] bg-[#CDF88D] ring-1 ring-[#CDF88D]/20"
              : "hover:border-border/80 hover:bg-muted/50"
            )}
           >
            <div
             className={cn(
              "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors",
              paymentMethod === method.id
               ? "border-[#CDF88D]"
               : "border-border"
             )}
            >
             {paymentMethod === method.id && (
              <div className="h-2.5 w-2.5 rounded-full bg-[#CDF88D]" />
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
        </div>
       )}
      </motion.div>
     </AnimatePresence>
    </div>

    {/* Footer */}
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
       <span className="text-lg font-bold text-[#CDF88D]">
        {formatCurrency(donationAmount, currency)}
       </span>
      )}
     </div>

     <div className="flex items-center gap-3">
      {step > 0 && (
       <Button
        variant="outline"
        onClick={handleBack}
        disabled={false}
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
        className="gap-1 bg-[#CDF88D] hover:bg-[#CDF88D] text-[#14532d] min-w-[140px] hover:brightness-95"
       >
        Continue
        <ChevronRight className="h-4 w-4" />
       </Button>
      ) : (
       <Button
        onClick={handleGoToPay}
        disabled={!canProceed}
        className="bg-[#CDF88D] hover:bg-[#CDF88D] text-[#14532d] min-w-[180px] h-11 hover:brightness-95"
       >
        Pay {donationAmount > 0 ? formatCurrency(donationAmount, currency) : "Now"}
       </Button>
      )}
      </div>
     </div>
    </div>
   </div>
  </DialogContent>
  </Dialog>
 )
}
