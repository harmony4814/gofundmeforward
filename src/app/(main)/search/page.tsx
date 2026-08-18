"use client"

import { Suspense, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Search as SearchIcon, SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Badge as BadgeComponent } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { CampaignCard } from "@/components/shared/CampaignCard"
import { categories, mockCampaigns } from "@/lib/data"

const ITEMS_PER_PAGE = 6

export default function SearchPage() {
 return (
 <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
 <SearchPageContent />
 </Suspense>
 )
}

function SearchPageContent() {
 const searchParams = useSearchParams()
 const initialQuery = searchParams.get("q") || ""

 const [query, setQuery] = useState(initialQuery)
 const [category, setCategory] = useState("all")
 const [sortBy, setSortBy] = useState("newest")
 const [goalMin, setGoalMin] = useState("")
 const [goalMax, setGoalMax] = useState("")
 const [page, setPage] = useState(1)
 const [mobileFilters, setMobileFilters] = useState(false)

 const results = useMemo(() => {
 let filtered = [...mockCampaigns]

 if (query) {
 const q = query.toLowerCase()
 filtered = filtered.filter(
 (c) =>
 c.title.toLowerCase().includes(q) ||
 c.shortDescription.toLowerCase().includes(q) ||
 c.category.toLowerCase().includes(q) ||
 c.tags.some((t) => t.toLowerCase().includes(q))
 )
 }

 if (category !== "all") {
 filtered = filtered.filter((c) => c.categorySlug === category)
 }

 if (goalMin) {
 filtered = filtered.filter((c) => c.goal >= Number(goalMin))
 }
 if (goalMax) {
 filtered = filtered.filter((c) => c.goal <= Number(goalMax))
 }

 switch (sortBy) {
 case "most_funded":
 filtered.sort((a, b) => b.raised - a.raised)
 break
 case "ending_soon":
 filtered.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
 break
 case "most_popular":
 filtered.sort((a, b) => b.donorCount - a.donorCount)
 break
 default:
 filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
 }

 return filtered
 }, [query, category, sortBy, goalMin, goalMax])

 const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE)
 const paginatedResults = results.slice(
 (page - 1) * ITEMS_PER_PAGE,
 page * ITEMS_PER_PAGE
 )

 const clearFilters = () => {
 setQuery("")
 setCategory("all")
 setSortBy("newest")
 setGoalMin("")
 setGoalMax("")
 setPage(1)
 }

 return (
 <div className="min-h-screen">
 <section className="bg-gradient-to-br from-[#CDF88D] via-[#CDF88D] to-[#CDF88D] py-16">
 <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
 <BadgeComponent className="mb-6 border-[#CDF88D]/30 bg-[#CDF88D]/10 text-[#CDF88D]">
 <SearchIcon className="mr-1 h-3 w-3" />
 Search
 </BadgeComponent>
 <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
 Find Campaigns
 </h1>
 <div className="relative mt-6 max-w-2xl">
 <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
 <Input
 value={query}
 onChange={(e) => {
 setQuery(e.target.value)
 setPage(1)
 }}
 placeholder="Search campaigns, categories, tags..."
 className="h-14 rounded-2xl border-0 bg-white pl-12 text-base shadow-xl focus-visible:ring-2 focus-visible:ring-[#CDF88D]"
 />
 </div>
 </motion.div>
 </div>
 </section>

 <section className="py-12">
 <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
 <div className="flex gap-8">
 {/* Filters Sidebar - Desktop */}
 <aside className="hidden w-64 shrink-0 lg:block">
 <div className="sticky top-24 space-y-6">
 <div className="flex items-center justify-between">
 <h3 className="font-semibold">Filters</h3>
 <button
 onClick={clearFilters}
 className="text-xs text-[#CDF88D] hover:underline"
 >
 Clear All
 </button>
 </div>

 <div className="space-y-2">
 <Label className="text-sm">Category</Label>
 <Select value={category} onValueChange={(v) => { setCategory(v ?? "all"); setPage(1) }}>
 <SelectTrigger className="w-full">
 <SelectValue placeholder="All Categories" />
 </SelectTrigger>
 <SelectContent>
 <SelectItem value="all">All Categories</SelectItem>
 {categories.map((cat) => (
 <SelectItem key={cat.slug} value={cat.slug}>
 {cat.name}
 </SelectItem>
 ))}
 </SelectContent>
 </Select>
 </div>

 <Separator />

 <div className="space-y-2">
 <Label className="text-sm">Goal Range</Label>
 <div className="flex gap-2">
 <Input
 type="number"
 placeholder="Min"
 value={goalMin}
 onChange={(e) => { setGoalMin(e.target.value); setPage(1) }}
 className="h-8"
 />
 <Input
 type="number"
 placeholder="Max"
 value={goalMax}
 onChange={(e) => { setGoalMax(e.target.value); setPage(1) }}
 className="h-8"
 />
 </div>
 </div>

 <Separator />

 <div className="space-y-2">
 <Label className="text-sm">Sort By</Label>
 <Select value={sortBy} onValueChange={(v) => setSortBy(v ?? "newest")}>
 <SelectTrigger className="w-full">
 <SelectValue placeholder="Sort by" />
 </SelectTrigger>
 <SelectContent>
 <SelectItem value="newest">Newest First</SelectItem>
 <SelectItem value="most_funded">Most Funded</SelectItem>
 <SelectItem value="ending_soon">Ending Soon</SelectItem>
 <SelectItem value="most_popular">Most Popular</SelectItem>
 </SelectContent>
 </Select>
 </div>
 </div>
 </aside>

 {/* Results */}
 <div className="flex-1">
 <div className="flex items-center justify-between">
 <p className="text-sm text-gray-500">
 {results.length} result{results.length !== 1 ? "s" : ""} found
 </p>
 <Button
 variant="outline"
 size="sm"
 className="lg:hidden"
 onClick={() => setMobileFilters(!mobileFilters)}
 >
 <SlidersHorizontal className="mr-1 h-4 w-4" />
 Filters
 </Button>
 </div>

 {/* Mobile Filters */}
 {mobileFilters && (
 <div className="mb-6 rounded-lg border p-4 lg:hidden">
 <div className="space-y-4">
 <Select value={category} onValueChange={(v) => { setCategory(v ?? "all"); setPage(1) }}>
 <SelectTrigger className="w-full">
 <SelectValue placeholder="All Categories" />
 </SelectTrigger>
 <SelectContent>
 <SelectItem value="all">All Categories</SelectItem>
 {categories.map((cat) => (
 <SelectItem key={cat.slug} value={cat.slug}>
 {cat.name}
 </SelectItem>
 ))}
 </SelectContent>
 </Select>
 <Select value={sortBy} onValueChange={(v) => setSortBy(v ?? "newest")}>
 <SelectTrigger className="w-full">
 <SelectValue placeholder="Sort by" />
 </SelectTrigger>
 <SelectContent>
 <SelectItem value="newest">Newest First</SelectItem>
 <SelectItem value="most_funded">Most Funded</SelectItem>
 <SelectItem value="ending_soon">Ending Soon</SelectItem>
 <SelectItem value="most_popular">Most Popular</SelectItem>
 </SelectContent>
 </Select>
 </div>
 </div>
 )}

 {paginatedResults.length > 0 ? (
 <div className="grid gap-6 sm:grid-cols-2">
 {paginatedResults.map((campaign, i) => (
 <CampaignCard key={campaign.id} campaign={campaign} index={i} />
 ))}
 </div>
 ) : (
 <div className="py-20 text-center">
 <SearchIcon className="mx-auto h-12 w-12 text-gray-300" />
 <h2 className="mt-4 text-xl font-semibold">No results found</h2>
 <p className="mt-2 text-gray-500">
 Try adjusting your search or filters
 </p>
 <Button variant="outline" className="mt-4" onClick={clearFilters}>
 Clear Filters
 </Button>
 </div>
 )}

 {/* Pagination */}
 {totalPages > 1 && (
 <div className="mt-8 flex items-center justify-center gap-2">
 <Button
 variant="outline"
 size="icon"
 disabled={page === 1}
 onClick={() => setPage(page - 1)}
 >
 <ChevronLeft className="h-4 w-4" />
 </Button>
 {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
 <Button
 key={p}
 variant={p === page ? "default" : "outline"}
 size="icon"
 className={p === page ? "bg-[#CDF88D] text-[#14532d] hover:bg-[#CDF88D]" : ""}
 onClick={() => setPage(p)}
 >
 {p}
 </Button>
 ))}
 <Button
 variant="outline"
 size="icon"
 disabled={page === totalPages}
 onClick={() => setPage(page + 1)}
 >
 <ChevronRight className="h-4 w-4" />
 </Button>
 </div>
 )}
 </div>
 </div>
 </div>
 </section>
 </div>
 )
}
