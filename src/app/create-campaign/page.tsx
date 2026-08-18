"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion, AnimatePresence } from "framer-motion"
import {
 ArrowLeft,
 ArrowRight,
 Upload,
 Check,
 FileText,
 Image as ImageIcon,
 Settings,
 Eye,
 Loader2,
 X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { BrandLogo } from "@/components/shared/BrandLogo"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { categories } from "@/lib/data"
import { formatCurrency } from "@/lib/utils"
import { useCampaignStore } from "@/store/campaign-store"
import { useAuthStore } from "@/store/auth-store"
import type { CampaignData } from "@/lib/data"

const step1Schema = z.object({
 title: z.string().min(10, "Title must be at least 10 characters"),
 shortDescription: z.string().min(30, "Description must be at least 30 characters"),
 category: z.string().min(1, "Please select a category"),
 country: z.string().min(1, "Please select a country"),
})

const step2Schema = z.object({
 fullStory: z.string().min(100, "Story must be at least 100 characters"),
})

const step3Schema = z.object({
 coverImage: z.string().optional(),
 videoUrl: z.string().optional(),
})

const step4Schema = z.object({
 goal: z.number().min(100, "Goal must be at least $100"),
 currency: z.string().min(1, "Please select a currency"),
 beneficiaryType: z.string().min(1, "Please select a beneficiary type"),
 beneficiaryName: z.string().min(2, "Beneficiary name is required"),
 deadline: z.string().min(1, "Please select a deadline"),
 tags: z.string().optional(),
})

const formSchema = step1Schema.merge(step2Schema).merge(step3Schema).merge(step4Schema)

type FormData = z.infer<typeof formSchema>

const steps = [
 { id: 1, label: "Basic Info", icon: FileText },
 { id: 2, label: "Story", icon: FileText },
 { id: 3, label: "Media", icon: ImageIcon },
 { id: 4, label: "Details", icon: Settings },
 { id: 5, label: "Review", icon: Eye },
]

const countries = [
 "United States", "United Kingdom", "Canada", "Australia", "Germany",
 "France", "Japan", "India", "Brazil", "Nigeria", "Kenya", "South Africa",
 "Mexico", "Turkey", "Bangladesh", "Pakistan", "Philippines", "Indonesia",
]

const currencies = ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "NGN", "KES"]

export default function CreateCampaignPage() {
 const router = useRouter()
 const addUserCampaign = useCampaignStore((s) => s.addUserCampaign)
 const user = useAuthStore((s) => s.user)
 const [currentStep, setCurrentStep] = useState(1)
const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [createdSlug, setCreatedSlug] = useState<string | null>(null)
 const [selectedCategory, setSelectedCategory] = useState("")
 const [selectedCountry, setSelectedCountry] = useState("")
 const [selectedCurrency, setSelectedCurrency] = useState("USD")
 const [selectedBeneficiaryType, setSelectedBeneficiaryType] = useState("")
 const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null)
 const [galleryPreviews, setGalleryPreviews] = useState<string[]>([])
 const coverInputRef = useRef<HTMLInputElement>(null)
 const galleryInputRef = useRef<HTMLInputElement>(null)

 useEffect(() => {
 if (!user) {
 router.push("/login?redirect=/create-campaign")
 }
 }, [user, router])

 const {
 register,
 handleSubmit,
 watch,
 trigger,
 setValue,
 formState: { errors },
 } = useForm<FormData>({
 resolver: zodResolver(formSchema),
 defaultValues: {
 title: "",
 shortDescription: "",
 category: "",
 country: "",
 fullStory: "",
 coverImage: "",
 videoUrl: "",
 goal: 1000,
 currency: "USD",
 beneficiaryType: "",
 beneficiaryName: "",
 deadline: "",
 tags: "",
 },
 })

 const formValues = watch()

 const handleCoverUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
 const file = e.target.files?.[0]
 if (!file) return
 if (!file.type.startsWith("image/")) return
 if (file.size > 5 * 1024 * 1024) return
 const reader = new FileReader()
 reader.onload = (ev) => {
 setCoverImagePreview(ev.target?.result as string)
 setValue("coverImage", ev.target?.result as string, { shouldValidate: true })
 }
 reader.readAsDataURL(file)
 }, [setValue])

 const handleGalleryUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
 const files = e.target.files
 if (!files) return
 const remaining = 10 - galleryPreviews.length
 const toProcess = Array.from(files).slice(0, remaining).filter((f) => f.type.startsWith("image/") && f.size <= 5 * 1024 * 1024)
 let count = 0
 toProcess.forEach((file) => {
 const reader = new FileReader()
 reader.onload = (ev) => {
 setGalleryPreviews((prev) => [...prev, ev.target?.result as string])
 count++
 if (count === toProcess.length) {
 setValue("coverImage", "gallery-uploaded", { shouldValidate: true })
 }
 }
 reader.readAsDataURL(file)
 })
 e.target.value = ""
 }, [galleryPreviews.length, setValue])

 const removeCoverImage = useCallback(() => {
 setCoverImagePreview(null)
 setValue("coverImage", "", { shouldValidate: true })
 if (coverInputRef.current) coverInputRef.current.value = ""
 }, [setValue])

 const removeGalleryImage = useCallback((index: number) => {
 setGalleryPreviews((prev) => prev.filter((_, i) => i !== index))
 }, [])

 const validateStep = async () => {
 switch (currentStep) {
 case 1:
 return await trigger(["title", "shortDescription", "category", "country"])
 case 2:
 return await trigger(["fullStory"])
 case 3:
 return await trigger(["coverImage", "videoUrl"])
 case 4:
 return await trigger(["goal", "currency", "beneficiaryType", "beneficiaryName", "deadline", "tags"])
 default:
 return true
 }
 }

 const handleNext = async () => {
 const valid = await validateStep()
 if (valid && currentStep < 5) {
 setCurrentStep(currentStep + 1)
 }
 }

 const handleBack = () => {
 if (currentStep > 1) {
 setCurrentStep(currentStep - 1)
 }
 }

const onSubmit = async (data: FormData) => {
  setIsSubmitting(true)
  setSubmitError(null)

  const cat = categories.find((c) => c.slug === data.category)

  try {
  const res = await fetch("/api/campaigns", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
  title: data.title,
  shortDescription: data.shortDescription,
  fullStory: data.fullStory,
  goal: data.goal,
  currency: data.currency || "USD",
  category: data.category,
  country: data.country,
  beneficiaryType: data.beneficiaryType,
  beneficiaryName: data.beneficiaryName,
  coverImage: coverImagePreview || "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=80",
  galleryImages: galleryPreviews,
  videoUrl: data.videoUrl || null,
  deadline: data.deadline || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  tags: data.tags ? data.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
  }),
  })

  if (res.status === 401) {
  router.push("/login?redirect=/create-campaign")
  return
  }

  const body = await res.json().catch(() => null)
  if (!res.ok || !body?.data) {
  setSubmitError(body?.error || "Failed to save campaign. Please try again.")
  return
  }

  const saved = body.data
  const slug = saved.slug
  const newCampaign: CampaignData = {
  id: saved.id,
  slug,
  title: saved.title,
  shortDescription: saved.short_description,
  fullStory: saved.full_story,
  goal: Number(saved.goal),
  raised: 0,
  currency: saved.currency || "USD",
  category: cat?.name || data.category,
  categorySlug: data.category,
  country: saved.country,
  beneficiaryName: saved.beneficiary_name,
  coverImage: saved.cover_image,
  galleryImages: saved.gallery_images || [],
  videoUrl: saved.video_url || null,
  deadline: saved.deadline,
  status: saved.status || "pending",
  tags: saved.tags || [],
  donorCount: 0,
  viewCount: 0,
  shareCount: 0,
  featured: false,
  trending: false,
  creatorName: "You",
  creatorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
  createdAt: saved.created_at,
  }

  addUserCampaign(newCampaign)
  setCreatedSlug(slug)
  } catch {
  setSubmitError("Network error. Please try again.")
  } finally {
  setIsSubmitting(false)
  }
  }

 const progress = (currentStep / steps.length) * 100

 if (createdSlug) {
 return (
 <div className="flex min-h-screen items-center justify-center px-4">
 <motion.div
 initial={{ opacity: 0, scale: 0.9 }}
 animate={{ opacity: 1, scale: 1 }}
 className="text-center"
 >
 <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#CDF88D]/10">
 <Check className="h-10 w-10 text-[#CDF88D]" />
 </div>
 <h1 className="mt-6 text-3xl font-bold">Campaign Created!</h1>
 <p className="mt-3 text-gray-500">
 Your campaign has been submitted and is pending admin approval. You&apos;ll see it on your dashboard once approved.
 </p>
 <div className="mt-8 flex gap-4 justify-center">
 <Link href="/dashboard/campaigns">
 <Button variant="outline">My Dashboard</Button>
 </Link>
 <Link href={`/campaigns/${createdSlug}`}>
 <Button className="bg-[#CDF88D] text-[#14532d] hover:bg-[#CDF88D]">
 View Campaign
 </Button>
 </Link>
 </div>
 </motion.div>
 </div>
 )
 }

 return (
 <div className="min-h-screen bg-gray-50">
 <div className="border-b bg-white">
 <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
 <div className="flex items-center justify-between">
  <Link href="/" className="flex items-center">
  <BrandLogo />
  </Link>
 <Badge variant="outline">Step {currentStep} of {steps.length}</Badge>
 </div>
 <div className="mt-4">
 <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
 <motion.div
 className="h-full rounded-full bg-[#CDF88D]"
 initial={{ width: 0 }}
 animate={{ width: `${progress}%` }}
 transition={{ duration: 0.3 }}
 />
 </div>
 <div className="mt-3 flex justify-between">
 {steps.map((step) => (
 <div
 key={step.id}
 className={`flex items-center gap-1.5 text-xs ${
 currentStep >= step.id
 ? "font-medium text-[#CDF88D]"
 : "text-gray-400"
 }`}
 >
 <div
 className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
 currentStep > step.id
 ? "bg-[#CDF88D] text-[#14532d]"
 : currentStep === step.id
 ? "border-2 border-[#CDF88D] text-[#CDF88D]"
 : "border border-gray-300 text-gray-400"
 }`}
 >
 {currentStep > step.id ? (
 <Check className="h-3 w-3" />
 ) : (
 step.id
 )}
 </div>
 <span className="hidden sm:inline">{step.label}</span>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>

 <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
 <form onSubmit={handleSubmit(onSubmit)}>
 <AnimatePresence mode="wait">
 {currentStep === 1 && (
 <motion.div
 key="step1"
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -20 }}
 >
 <Card>
 <CardContent className="space-y-6 p-6 sm:p-8">
 <div>
 <h2 className="text-xl font-bold">Basic Information</h2>
 <p className="mt-1 text-sm text-gray-500">
 Tell us the basics about your campaign
 </p>
 </div>

 <div className="space-y-2">
 <Label htmlFor="title">Campaign Title *</Label>
 <Input
 id="title"
 placeholder="e.g., Help Sarah Beat Cancer"
 {...register("title")}
 />
 {errors.title && (
 <p className="text-xs text-red-500">{errors.title.message}</p>
 )}
 </div>

 <div className="space-y-2">
 <Label htmlFor="shortDescription">Short Description *</Label>
 <Textarea
 id="shortDescription"
 placeholder="Write a brief description that captures the essence of your campaign (shown in search results)"
 rows={3}
 {...register("shortDescription")}
 />
 {errors.shortDescription && (
 <p className="text-xs text-red-500">
 {errors.shortDescription.message}
 </p>
 )}
 </div>

 <div className="space-y-2">
 <Label>Category *</Label>
 <Select
 value={selectedCategory}
 onValueChange={(v) => {
 const val = v ?? ""
 setSelectedCategory(val)
 setValue("category", val, { shouldValidate: true })
 }}
 >
 <SelectTrigger>
 <SelectValue placeholder="Select a category" />
 </SelectTrigger>
 <SelectContent>
 {categories.map((cat) => (
 <SelectItem key={cat.slug} value={cat.slug}>
 {cat.name}
 </SelectItem>
 ))}
 </SelectContent>
 </Select>
 {errors.category && (
 <p className="text-xs text-red-500">{errors.category.message}</p>
 )}
 </div>

 <div className="space-y-2">
 <Label>Country *</Label>
 <Select
 value={selectedCountry}
 onValueChange={(v) => {
 const val = v ?? ""
 setSelectedCountry(val)
 setValue("country", val, { shouldValidate: true })
 }}
 >
 <SelectTrigger>
 <SelectValue placeholder="Select a country" />
 </SelectTrigger>
 <SelectContent>
 {countries.map((c) => (
 <SelectItem key={c} value={c}>
 {c}
 </SelectItem>
 ))}
 </SelectContent>
 </Select>
 {errors.country && (
 <p className="text-xs text-red-500">{errors.country.message}</p>
 )}
 </div>
 </CardContent>
 </Card>
 </motion.div>
 )}

 {currentStep === 2 && (
 <motion.div
 key="step2"
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -20 }}
 >
 <Card>
 <CardContent className="space-y-6 p-6 sm:p-8">
 <div>
 <h2 className="text-xl font-bold">Tell Your Story</h2>
 <p className="mt-1 text-sm text-gray-500">
 Share the details of your campaign. Compelling stories raise more funds.
 </p>
 </div>

 <div className="space-y-2">
 <Label htmlFor="fullStory">Full Story *</Label>
 <Textarea
 id="fullStory"
 placeholder="Tell potential donors everything they need to know. Include details about who you're raising money for, why you need it, and how the funds will be used. Be specific and heartfelt..."
 rows={15}
 className="min-h-[300px]"
 {...register("fullStory")}
 />
 {errors.fullStory && (
 <p className="text-xs text-red-500">
 {errors.fullStory.message}
 </p>
 )}
 <p className="text-xs text-gray-500">
 Tip: Include paragraphs about the background, the challenge, the plan, and
 the impact of donations.
 </p>
 </div>
 </CardContent>
 </Card>
 </motion.div>
 )}

 {currentStep === 3 && (
 <motion.div
 key="step3"
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -20 }}
 >
 <Card>
 <CardContent className="space-y-6 p-6 sm:p-8">
 <div>
 <h2 className="text-xl font-bold">Media</h2>
 <p className="mt-1 text-sm text-gray-500">
 Add images and video to bring your campaign to life
 </p>
 </div>

 {/* Cover Image Upload */}
 <div className="space-y-2">
 <Label>Cover Image *</Label>
 <input
 ref={coverInputRef}
 type="file"
 accept="image/png,image/jpeg,image/webp"
 className="hidden"
 onChange={handleCoverUpload}
 />
 {coverImagePreview ? (
 <div className="relative overflow-hidden rounded-xl border">
 <img
 src={coverImagePreview}
 alt="Cover preview"
 className="h-48 w-full object-cover"
 />
 <button
 type="button"
 onClick={removeCoverImage}
 className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
 >
 <X className="h-4 w-4" />
 </button>
 <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-xs text-white">
 <Check className="h-3 w-3" />
 Cover image ready
 </div>
 </div>
 ) : (
 <button
 type="button"
 onClick={() => coverInputRef.current?.click()}
 className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors hover:border-[#CDF88D] hover:bg-[#CDF88D]/5"
 >
 <Upload className="h-10 w-10 text-gray-400" />
 <p className="mt-2 text-sm font-medium">
 Click to upload or drag and drop
 </p>
 <p className="text-xs text-gray-500">
 PNG, JPG, WEBP up to 5MB. Recommended: 1200x675px
 </p>
 </button>
 )}
 </div>

 {/* Gallery Images Upload */}
 <div className="space-y-2">
 <Label>
 Gallery Images
 <span className="ml-1 text-gray-400 font-normal">({galleryPreviews.length}/10)</span>
 </Label>
 <input
 ref={galleryInputRef}
 type="file"
 accept="image/png,image/jpeg,image/webp"
 multiple
 className="hidden"
 onChange={handleGalleryUpload}
 />
 {galleryPreviews.length > 0 && (
 <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
 {galleryPreviews.map((preview, i) => (
 <div key={i} className="relative aspect-square overflow-hidden rounded-lg border">
 <img
 src={preview}
 alt={`Gallery ${i + 1}`}
 className="h-full w-full object-cover"
 />
 <button
 type="button"
 onClick={() => removeGalleryImage(i)}
 className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
 >
 <X className="h-3 w-3" />
 </button>
 </div>
 ))}
 {galleryPreviews.length < 10 && (
 <button
 type="button"
 onClick={() => galleryInputRef.current?.click()}
 className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors hover:border-[#CDF88D] hover:bg-[#CDF88D]/5"
 >
 <ImageIcon className="h-6 w-6 text-gray-400" />
 <span className="mt-1 text-[10px] text-gray-500">Add more</span>
 </button>
 )}
 </div>
 )}
 {galleryPreviews.length === 0 && (
 <button
 type="button"
 onClick={() => galleryInputRef.current?.click()}
 className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors hover:border-[#CDF88D] hover:bg-[#CDF88D]/5"
 >
 <ImageIcon className="h-8 w-8 text-gray-400" />
 <p className="mt-2 text-sm font-medium">Add additional images</p>
 <p className="text-xs text-gray-500">Up to 10 images</p>
 </button>
 )}
 </div>

 <div className="space-y-2">
 <Label htmlFor="videoUrl">Video URL (optional)</Label>
 <Input
 id="videoUrl"
 placeholder="https://youtube.com/watch?v=..."
 {...register("videoUrl")}
 />
 <p className="text-xs text-gray-500">
 YouTube or Vimeo URL. Videos help campaigns raise 4x more!
 </p>
 </div>
 </CardContent>
 </Card>
 </motion.div>
 )}

 {currentStep === 4 && (
 <motion.div
 key="step4"
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -20 }}
 >
 <Card>
 <CardContent className="space-y-6 p-6 sm:p-8">
 <div>
 <h2 className="text-xl font-bold">Campaign Details</h2>
 <p className="mt-1 text-sm text-gray-500">
 Set your fundraising goal and other details
 </p>
 </div>

 <div className="grid gap-4 sm:grid-cols-2">
 <div className="space-y-2">
 <Label htmlFor="goal">Fundraising Goal *</Label>
 <div className="relative">
 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
 <Input
 id="goal"
 type="number"
 min={100}
 className="h-12 pl-8 text-lg"
 {...register("goal", { valueAsNumber: true })}
 />
 </div>
 {errors.goal && (
 <p className="text-xs text-red-500">{errors.goal.message}</p>
 )}
 </div>
 <div className="space-y-2">
 <Label>Currency</Label>
 <Select
 value={selectedCurrency}
 onValueChange={(v) => {
 const val = v ?? ""
 setSelectedCurrency(val)
 setValue("currency", val, { shouldValidate: true })
 }}
 >
 <SelectTrigger className="h-12">
 <SelectValue placeholder="Select currency" />
 </SelectTrigger>
 <SelectContent>
 {currencies.map((c) => (
 <SelectItem key={c} value={c}>
 {c}
 </SelectItem>
 ))}
 </SelectContent>
 </Select>
 </div>
 </div>

 <div className="space-y-2">
 <Label>Beneficiary Type *</Label>
 <Select
 value={selectedBeneficiaryType}
 onValueChange={(v) => {
 const val = v ?? ""
 setSelectedBeneficiaryType(val)
 setValue("beneficiaryType", val, { shouldValidate: true })
 }}
 >
 <SelectTrigger>
 <SelectValue placeholder="Who will receive the funds?" />
 </SelectTrigger>
 <SelectContent>
 <SelectItem value="myself">Myself</SelectItem>
 <SelectItem value="friend">Friend or Family Member</SelectItem>
 <SelectItem value="charity">Charity or Non-Profit</SelectItem>
 <SelectItem value="business">Business or Organization</SelectItem>
 <SelectItem value="other">Other</SelectItem>
 </SelectContent>
 </Select>
 {errors.beneficiaryType && (
 <p className="text-xs text-red-500">
 {errors.beneficiaryType.message}
 </p>
 )}
 </div>

 <div className="space-y-2">
 <Label htmlFor="beneficiaryName">Beneficiary Name *</Label>
 <Input
 id="beneficiaryName"
 placeholder="Who is this campaign for?"
 {...register("beneficiaryName")}
 />
 {errors.beneficiaryName && (
 <p className="text-xs text-red-500">
 {errors.beneficiaryName.message}
 </p>
 )}
 </div>

 <div className="space-y-2">
 <Label htmlFor="deadline">Campaign Deadline *</Label>
 <Input
 id="deadline"
 type="date"
 {...register("deadline")}
 />
 {errors.deadline && (
 <p className="text-xs text-red-500">{errors.deadline.message}</p>
 )}
 </div>

 <div className="space-y-2">
 <Label htmlFor="tags">Tags (optional)</Label>
 <Input
 id="tags"
 placeholder="cancer, medical, family (comma separated)"
 {...register("tags")}
 />
 </div>
 </CardContent>
 </Card>
 </motion.div>
 )}

 {currentStep === 5 && (
 <motion.div
 key="step5"
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -20 }}
 className="space-y-6"
 >
 <Card>
 <CardContent className="space-y-6 p-6 sm:p-8">
 <div>
 <h2 className="text-xl font-bold">Review Your Campaign</h2>
 <p className="mt-1 text-sm text-gray-500">
 Make sure everything looks good before submitting
 </p>
 </div>

 <div className="space-y-4">
 <div className="rounded-lg bg-gray-50 p-4">
 <h3 className="text-lg font-semibold">{formValues.title || "Untitled Campaign"}</h3>
 <p className="mt-1 text-sm text-gray-500">
 {formValues.shortDescription || "No description provided"}
 </p>
 </div>

 <Separator />

 <div className="grid gap-4 sm:grid-cols-2">
 <div>
 <p className="text-xs font-medium text-gray-500">Category</p>
 <p className="text-sm">{selectedCategory || "Not selected"}</p>
 </div>
 <div>
 <p className="text-xs font-medium text-gray-500">Country</p>
 <p className="text-sm">{selectedCountry || "Not selected"}</p>
 </div>
 <div>
 <p className="text-xs font-medium text-gray-500">Fundraising Goal</p>
 <p className="text-sm font-semibold text-[#CDF88D]">
 {formatCurrency(formValues.goal || 0, selectedCurrency)}
 </p>
 </div>
 <div>
 <p className="text-xs font-medium text-gray-500">Deadline</p>
 <p className="text-sm">{formValues.deadline || "Not set"}</p>
 </div>
 <div>
 <p className="text-xs font-medium text-gray-500">Beneficiary</p>
 <p className="text-sm">{formValues.beneficiaryName || "Not specified"}</p>
 </div>
 <div>
 <p className="text-xs font-medium text-gray-500">Tags</p>
 <p className="text-sm">{formValues.tags || "None"}</p>
 </div>
 </div>

 <Separator />

 <div>
 <p className="text-xs font-medium text-gray-500 mb-2">Full Story</p>
 <div className="max-h-40 overflow-y-auto rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
 {formValues.fullStory || "No story provided"}
 </div>
 </div>
 </div>
 </CardContent>
 </Card>
 </motion.div>
 )}
 </AnimatePresence>

<div className="mt-6 flex items-center justify-between">
  {submitError && (
  <p className="text-sm text-red-500">{submitError}</p>
  )}
  <Button
 type="button"
 variant="outline"
 onClick={handleBack}
 disabled={currentStep === 1}
 >
 <ArrowLeft className="mr-1 h-4 w-4" />
 Back
 </Button>

 {currentStep < 5 ? (
 <Button
 type="button"
 onClick={handleNext}
 className="bg-[#CDF88D] text-[#14532d] hover:bg-[#CDF88D]"
 >
 Next
 <ArrowRight className="ml-1 h-4 w-4" />
 </Button>
 ) : (
 <Button
 type="submit"
 className="bg-[#CDF88D] text-[#14532d] hover:bg-[#CDF88D]"
 disabled={isSubmitting}
 >
 {isSubmitting ? (
 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
 ) : (
 <Check className="mr-2 h-4 w-4" />
 )}
 {isSubmitting ? "Submitting..." : "Submit Campaign"}
 </Button>
 )}
 </div>
 </form>
 </div>
 </div>
 )
}
