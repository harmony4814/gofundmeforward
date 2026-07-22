"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useInView, useAnimation } from "framer-motion"
import {
 Search,
 ArrowRight,
 TrendingUp,
 Star,
 Play,
 ChevronLeft,
 ChevronRight,
 ChevronDown,
 ChevronUp,
 CheckCircle,
 Users,
 Globe,
 DollarSign,
 Heart,
 Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
 Accordion,
 AccordionItem,
 AccordionTrigger,
 AccordionContent,
} from "@/components/ui/accordion"
import { ProgressBar } from "@/components/shared/ProgressBar"
import { CampaignCard } from "@/components/shared/CampaignCard"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import {
 categories,
 mockCampaigns,
 testimonials,
 faqData,
 siteStats,
} from "@/lib/data"
import {
 formatCurrency,
 calculateProgress,
 formatNumber,
 getDaysRemaining,
} from "@/lib/utils"
import { useCampaignStore } from "@/store/campaign-store"

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
 const [count, setCount] = useState(0)
 const ref = useRef(null)
 const isInView = useInView(ref, { once: true })

 useEffect(() => {
 if (!isInView) return
 const duration = 2000
 const steps = 60
 const increment = target / steps
 let current = 0
 const timer = setInterval(() => {
 current += increment
 if (current >= target) {
 setCount(target)
 clearInterval(timer)
 } else {
 setCount(Math.floor(current))
 }
 }, duration / steps)
 return () => clearInterval(timer)
 }, [isInView, target])

 return (
 <span ref={ref}>
 {count.toLocaleString()}
 {suffix}
 </span>
 )
}

export default function HomePage() {
 const [searchQuery, setSearchQuery] = useState("")
 const [testimonialIndex, setTestimonialIndex] = useState(0)
 const scrollRef = useRef<HTMLDivElement>(null)
  const userCampaigns = useCampaignStore((s) => s.userCampaigns)

  const allCampaigns = [...userCampaigns.filter((c) => c.status === "active"), ...mockCampaigns]
 const featuredCampaigns = allCampaigns.filter((c) => c.featured)
 const trendingCampaigns = allCampaigns.filter((c) => c.trending)
 const recentCampaigns = [...allCampaigns].sort(
 (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
 )

 const nextTestimonial = () =>
 setTestimonialIndex((prev) => (prev + 1) % testimonials.length)
 const prevTestimonial = () =>
 setTestimonialIndex(
 (prev) => (prev - 1 + testimonials.length) % testimonials.length
 )

 return (
 <div className="min-h-screen">
 <Navbar />

 {/* Hero Section */}
 <section className="relative overflow-hidden bg-gradient-to-br from-[#052e16] via-[#14532d] to-[#166534]">
 <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMmM1NWUiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0djJoLTJ2LTJoMnptMCw0MHYxaC0ydi0xaDJ6TTIwIDIwdjJoLTJ2LTJoMnpNMjAsNTB2MWgtMnYtMWgyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
 <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
 <div className="text-center">
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6 }}
 >
 <Badge className="mb-6 border-[#22c55e]/30 bg-[#22c55e]/10 text-[#22c55e]">
 <Sparkles className="mr-1 h-3 w-3" />
 Trusted by millions worldwide
 </Badge>
 </motion.div>
 <motion.h1
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6, delay: 0.1 }}
 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
 >
 Help People Fund
 <br />
 <span className="text-[#22c55e]">What Matters</span>
 </motion.h1>
 <motion.p
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6, delay: 0.2 }}
 className="mx-auto mt-6 max-w-2xl text-lg text-gray-300"
 >
 Join millions of generous people who are making a difference. Start a
 campaign or donate to a cause you care about.
 </motion.p>

 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6, delay: 0.3 }}
 className="mx-auto mt-8 max-w-xl"
 >
 <div className="relative">
 <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
 <Input
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 placeholder="Search campaigns, categories, people..."
 className="h-14 rounded-2xl border-0 bg-white pl-12 pr-32 text-base shadow-xl focus-visible:ring-2 focus-visible:ring-[#22c55e]"
 />
 <Link
 href={`/search?q=${searchQuery}`}
 className="absolute right-2 top-1/2 -translate-y-1/2"
 >
 <Button className="rounded-xl bg-[#22c55e] text-white hover:bg-[#16a34a]" size="lg">
 Search
 </Button>
 </Link>
 </div>
 </motion.div>

 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6, delay: 0.4 }}
 className="mt-12 flex flex-wrap items-center justify-center gap-8 sm:gap-16"
 >
 {[
 { label: "Raised", value: siteStats.totalRaised, icon: DollarSign },
 { label: "Donations", value: siteStats.totalDonations, icon: Heart },
 { label: "Countries", value: siteStats.countries, icon: Globe },
 { label: "Campaigns Funded", value: siteStats.campaignsFunded, icon: CheckCircle },
 ].map((stat) => (
 <div key={stat.label} className="text-center">
 <stat.icon className="mx-auto mb-1 h-6 w-6 text-[#22c55e]" />
 <div className="text-2xl font-bold text-white">{stat.value}</div>
 <div className="text-sm text-gray-400">{stat.label}</div>
 </div>
 ))}
 </motion.div>
 </div>
 </div>
 <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50" />
 </section>

 {/* Categories Section */}
 <section className="py-16 sm:py-24">
 <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 className="text-center"
 >
 <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
 Explore Categories
 </h2>
 <p className="mt-3 text-gray-500">
 Discover campaigns across a wide range of categories
 </p>
 </motion.div>
 <div className="mt-12 grid grid-cols-3 gap-4 sm:grid-cols-5 lg:grid-cols-5">
 {categories.map((cat, i) => {
 const Icon = cat.icon
 return (
 <motion.div
 key={cat.id}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: i * 0.03 }}
 >
 <Link href={`/categories/${cat.slug}`}>
 <Card className="group cursor-pointer text-center transition-all duration-300 hover:border-[#22c55e] hover:shadow-md">
 <CardContent className="flex flex-col items-center gap-3 p-4 sm:p-6">
 <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#22c55e]/10 transition-colors group-hover:bg-[#22c55e]">
 <Icon className="h-6 w-6 text-[#22c55e] transition-colors group-hover:text-white" />
 </div>
 <div>
 <h3 className="text-sm font-semibold">{cat.name}</h3>
 <p className="mt-0.5 text-xs text-gray-500">
 {formatNumber(cat.campaignCount)} campaigns
 </p>
 </div>
 </CardContent>
 </Card>
 </Link>
 </motion.div>
 )
 })}
 </div>
 </div>
 </section>

 {/* Featured Campaigns - Horizontal Scroll */}
 <section className="bg-gray-50 py-16 sm:py-24">
 <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
 <div className="flex items-center justify-between">
 <motion.div
 initial={{ opacity: 0, x: -20 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 >
 <Badge className="mb-3 bg-[#22c55e]/10 text-[#22c55e]">
 <Star className="mr-1 h-3 w-3" />
 Featured
 </Badge>
 <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
 Featured Campaigns
 </h2>
 <p className="mt-2 text-gray-500">
 Hand-picked campaigns that deserve your attention
 </p>
 </motion.div>
 <div className="hidden gap-2 sm:flex">
 <Button
 variant="outline"
 size="icon"
 onClick={() =>
 scrollRef.current?.scrollBy({ left: -400, behavior: "smooth" })
 }
 >
 <ChevronLeft className="h-4 w-4" />
 </Button>
 <Button
 variant="outline"
 size="icon"
 onClick={() =>
 scrollRef.current?.scrollBy({ left: 400, behavior: "smooth" })
 }
 >
 <ChevronRight className="h-4 w-4" />
 </Button>
 </div>
 </div>
 </div>
 <div
 ref={scrollRef}
 className="mt-10 flex gap-6 overflow-x-auto scroll-smooth px-4 pb-4 sm:px-6 lg:px-[max(1rem,calc((100vw-80rem)/2+1.5rem))]"
 >
 {featuredCampaigns.map((campaign, i) => (
 <div key={campaign.id} className="w-[340px] shrink-0">
 <CampaignCard campaign={campaign} index={i} />
 </div>
 ))}
 </div>
 </section>

 {/* Trending Campaigns */}
 <section className="py-16 sm:py-24">
 <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 className="text-center"
 >
 <Badge className="mb-3 bg-orange-500/10 text-orange-500">
 <TrendingUp className="mr-1 h-3 w-3" />
 Trending
 </Badge>
 <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
 Trending Campaigns
 </h2>
 <p className="mt-3 text-gray-500">
 The campaigns gaining the most momentum right now
 </p>
 </motion.div>
 <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
 {trendingCampaigns.slice(0, 6).map((campaign, i) => (
 <CampaignCard key={campaign.id} campaign={campaign} index={i} />
 ))}
 </div>
 </div>
 </section>

 {/* Recently Created */}
 <section className="bg-gray-50 py-16 sm:py-24">
 <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 className="text-center"
 >
 <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
 Recently Created
 </h2>
 <p className="mt-3 text-gray-500">
 Fresh campaigns that just launched
 </p>
 </motion.div>
 <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
 {recentCampaigns.slice(0, 3).map((campaign, i) => (
 <CampaignCard key={campaign.id} campaign={campaign} index={i} />
 ))}
 </div>
 <div className="mt-10 text-center">
 <Link href="/categories">
 <Button variant="outline" size="lg">
 View All Campaigns
 <ArrowRight className="ml-2 h-4 w-4" />
 </Button>
 </Link>
 </div>
 </div>
 </section>

 {/* Success Stories */}
 <section className="py-16 sm:py-24" id="testimonials">
 <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 className="text-center"
 >
 <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
 Success Stories
 </h2>
 <p className="mt-3 text-gray-500">
 Real stories from real people who made a difference
 </p>
 </motion.div>
 <div className="relative mt-12 mx-auto max-w-3xl">
 <Card className="p-8 sm:p-12">
 <CardContent className="space-y-6">
 <div className="flex items-center gap-4">
 <Image
 src={testimonials[testimonialIndex].avatar}
 alt={testimonials[testimonialIndex].name}
 width={64}
 height={64}
 className="rounded-full object-cover"
 />
 <div>
 <h3 className="text-lg font-semibold">
 {testimonials[testimonialIndex].name}
 </h3>
 <p className="text-sm text-gray-500">
 {testimonials[testimonialIndex].role}
 </p>
 </div>
 </div>
 <p className="text-gray-600 italic">
 &ldquo;{testimonials[testimonialIndex].content}&rdquo;
 </p>
 <div className="flex items-center gap-2 text-sm">
 <span className="text-gray-500">Campaign:</span>
 <span className="font-medium">
 {testimonials[testimonialIndex].campaignTitle}
 </span>
 <Badge className="ml-2 bg-[#22c55e]/10 text-[#22c55e]">
 {formatCurrency(testimonials[testimonialIndex].amountRaised)} raised
 </Badge>
 </div>
 </CardContent>
 </Card>
 <div className="mt-6 flex justify-center gap-3">
 <Button variant="outline" size="icon" onClick={prevTestimonial}>
 <ChevronLeft className="h-4 w-4" />
 </Button>
 <div className="flex items-center gap-2">
 {testimonials.map((_, i) => (
 <button
 key={i}
 onClick={() => setTestimonialIndex(i)}
 className={`h-2 rounded-full transition-all ${
 i === testimonialIndex
 ? "w-8 bg-[#22c55e]"
 : "w-2 bg-gray-300"
 }`}
 />
 ))}
 </div>
 <Button variant="outline" size="icon" onClick={nextTestimonial}>
 <ChevronRight className="h-4 w-4" />
 </Button>
 </div>
 </div>
 </div>
 </section>

 {/* Stats Section */}
 <StatsSection />

 {/* FAQ Section */}
 <section className="py-16 sm:py-24">
 <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 className="text-center"
 >
 <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
 Frequently Asked Questions
 </h2>
 <p className="mt-3 text-gray-500">
 Everything you need to know about FundForward
 </p>
 </motion.div>
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 className="mt-12"
 >
 <Accordion>
 {faqData.slice(0, 6).map((faq) => (
 <AccordionItem key={faq.id} value={faq.id}>
 <AccordionTrigger>{faq.question}</AccordionTrigger>
 <AccordionContent>{faq.answer}</AccordionContent>
 </AccordionItem>
 ))}
 </Accordion>
 <div className="mt-8 text-center">
 <Link href="/faq">
 <Button variant="outline">
 View All FAQs
 <ArrowRight className="ml-2 h-4 w-4" />
 </Button>
 </Link>
 </div>
 </motion.div>
 </div>
 </section>

 {/* CTA Section */}
 <section className="py-16 sm:py-24">
 <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
 <motion.div
 initial={{ opacity: 0, scale: 0.95 }}
 whileInView={{ opacity: 1, scale: 1 }}
 viewport={{ once: true }}
 className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#166534] to-[#22c55e] px-8 py-16 text-center sm:px-16"
 >
 <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10" />
 <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/10" />
 <div className="relative">
 <h2 className="text-3xl font-bold text-white sm:text-4xl">
 Ready to Make a Difference?
 </h2>
 <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
 Whether you want to start a campaign or support a cause, there has never
 been a better time to make an impact.
 </p>
 <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
 <Link href="/create-campaign">
 <Button
 size="lg"
 className="bg-white text-[#166534] hover:bg-gray-100"
 >
 Start a Campaign
 <ArrowRight className="ml-2 h-4 w-4" />
 </Button>
 </Link>
 <Link href="/categories">
 <Button
 size="lg"
 variant="outline"
 className="border-white text-black hover:bg-white/10"
 >
 Browse Campaigns
 </Button>
 </Link>
 </div>
 </div>
 </motion.div>
 </div>
 </section>

 <Footer />
 </div>
 )
}

function StatsSection() {
 const ref = useRef(null)
 const isInView = useInView(ref, { once: true })

 const stats = [
 { label: "Total Raised", value: 2, suffix: "B+", prefix: "$" },
 { label: "Total Donations", value: 150, suffix: "M+" },
 { label: "Campaigns Funded", value: 500, suffix: "K+" },
 { label: "Countries", value: 200, suffix: "+" },
 ]

 return (
 <section ref={ref} className="bg-gray-50 py-16 sm:py-24">
 <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
 <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
 {stats.map((stat, i) => (
 <motion.div
 key={stat.label}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: i * 0.1 }}
 className="text-center"
 >
 <div className="text-4xl font-bold text-[#22c55e] sm:text-5xl">
 {stat.prefix || ""}
 <AnimatedCounter target={stat.value} suffix={stat.suffix} />
 </div>
 <div className="mt-2 text-sm font-medium text-gray-500">
 {stat.label}
 </div>
 </motion.div>
 ))}
 </div>
 </div>
 </section>
 )
}
