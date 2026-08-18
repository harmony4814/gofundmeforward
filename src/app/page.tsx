"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useInView } from "framer-motion"
import {
  ArrowRight,
  TrendingUp,
  Star,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import { CampaignCard } from "@/components/shared/CampaignCard"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import {
  categories,
  heroImages,
  mockCampaigns,
  testimonials,
  faqData,
} from "@/lib/data"
import {
  formatCurrency,
  formatNumber,
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
  const [testimonialIndex, setTestimonialIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { allCampaigns, fetchCampaigns } = useCampaignStore()

  useEffect(() => {
    fetchCampaigns()
  }, [fetchCampaigns])

  const activeCampaigns = allCampaigns.length > 0 ? allCampaigns : mockCampaigns
  const featuredCampaigns = activeCampaigns.filter((c) => c.featured)
  const trendingCampaigns = activeCampaigns.filter((c) => c.trending)
  const recentCampaigns = [...activeCampaigns].sort(
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
      <section className="relative overflow-hidden bg-white pb-24 pt-16 sm:pb-32 sm:pt-24">
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-[#CDF88D] bg-[#CDF88D] px-4 py-2 text-sm font-medium text-[#14532d]"
          >
            <Sparkles className="h-4 w-4 text-[#14532d]" />
            Trusted by thousands of donors
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto mt-8 max-w-4xl text-4xl font-extrabold leading-[1.08] tracking-tight text-gray-900 sm:text-7xl lg:text-[5.5rem]"
          >
            Where
            <br className="sm:hidden" />
            <span className="block text-gray-900 sm:inline">Successful</span>
            <br className="hidden sm:inline" />
            <span className="block text-gray-900 sm:inline">Fundraisers</span>
            Start
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10"
          >
            <Link href="/create-campaign">
              <Button className="h-[60px] w-[280px] rounded-full bg-[#CDF88D] text-base font-semibold text-[#14532d] shadow-lg shadow-[#CDF88D]/30 transition-all duration-300 hover:scale-[1.03] hover:bg-[#CDF88D] hover:shadow-xl hover:shadow-[#CDF88D]/40 active:scale-95">
                Start a Fundraiser
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-20 sm:mt-24"
          >
            <div className="flex items-center justify-center">
              {heroImages.map((img, i) => (
                <motion.div
                  key={img.src}
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 4 + (i % 3),
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: img.delay,
                  }}
                  style={{ zIndex: i + 1 }}
                  className={`relative -ml-4 first:ml-0 sm:-ml-6 ${img.offset} ${
                    i > 3 ? "hidden md:block" : ""
                  }`}
                >
                  <div
                    className={`${img.rotate} rounded-[30px] bg-white p-2 shadow-2xl shadow-gray-900/15 ring-1 ring-black/5 transition-transform duration-300 hover:scale-105`}
                  >
                    <div className="relative overflow-hidden rounded-[24px]">
                      <Image
                        src={img.src}
                        alt={img.alt}
                        width={200}
                        height={260}
                        sizes="(max-width: 640px) 96px, (max-width: 1024px) 144px, 176px"
                        loading="lazy"
                        className="h-32 w-24 object-cover sm:h-44 sm:w-36 lg:h-52 lg:w-40"
                      />
                      <span className="absolute bottom-2.5 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-full bg-white/95 px-3 py-1 text-[10px] font-semibold text-gray-800 shadow-sm sm:block">
                        {img.label}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
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
                    <Card className="group cursor-pointer text-center transition-all duration-300 hover:border-[#CDF88D] hover:shadow-md">
                      <CardContent className="flex flex-col items-center gap-3 p-4 sm:p-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#CDF88D]/10 transition-colors group-hover:bg-[#CDF88D]">
                          <Icon className="h-6 w-6 text-[#CDF88D] transition-colors group-hover:text-white" />
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
              <Badge className="mb-3 bg-[#CDF88D]/10 text-[#CDF88D]">
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
                  <Badge className="ml-2 bg-[#CDF88D]/10 text-[#CDF88D]">
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
                        ? "w-8 bg-[#CDF88D]"
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
              Everything you need to know about gofundme
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12"
          >
            <Accordion type="single" collapsible>
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
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#CDF88D] to-[#CDF88D] px-8 py-16 text-center sm:px-16"
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
                    className="bg-white text-[#CDF88D] hover:bg-gray-100"
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
              <div className="text-4xl font-bold text-[#CDF88D] sm:text-5xl">
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
