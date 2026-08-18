"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Clock, TrendingUp, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SearchOverlayProps {
 open: boolean;
 onClose: () => void;
}

const CATEGORIES = [
 "Medical",
 "Education",
 "Emergency",
 "Nonprofit",
 "Personal",
 "Business",
 "Animals",
 "Environment",
];

const RECENT_SEARCHES = [
 "Medical bills for cancer treatment",
 "School renovation",
 "Earthquake relief",
];

const POPULAR_CAMPAIGNS = [
 {
 id: "1",
 title: "Help Sarah Beat Cancer",
 category: "Medical",
 raised: 24500,
 slug: "help-sarah-beat-cancer",
 },
 {
 id: "2",
 title: "Build a School in Kenya",
 category: "Education",
 raised: 18200,
 slug: "build-school-kenya",
 },
 {
 id: "3",
 title: "Disaster Relief Fund",
 category: "Emergency",
 raised: 52000,
 slug: "disaster-relief-fund",
 },
];

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
 const [query, setQuery] = useState("");
 const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
 const inputRef = useRef<HTMLInputElement>(null);

 useEffect(() => {
 if (open) {
 setTimeout(() => inputRef.current?.focus(), 100);
 }
 }, [open]);

 useEffect(() => {
 const handleEscape = (e: KeyboardEvent) => {
 if (e.key === "Escape") onClose();
 };
 if (open) {
 document.addEventListener("keydown", handleEscape);
 document.body.style.overflow = "hidden";
 }
 return () => {
 document.removeEventListener("keydown", handleEscape);
 document.body.style.overflow = "";
 };
 }, [open, onClose]);

 return (
 <AnimatePresence>
 {open && (
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 transition={{ duration: 0.2 }}
 className="fixed inset-0 z-[100] bg-white"
 >
 <div className="mx-auto max-w-3xl px-4 pt-4 sm:px-6">
 {/* Search Header */}
 <div className="flex items-center gap-3">
 <div className="relative flex-1">
 <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
 <input
 ref={inputRef}
 type="text"
 value={query}
 onChange={(e) => setQuery(e.target.value)}
 placeholder="Search for campaigns, people, or causes..."
 className="h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-12 pr-12 text-lg text-gray-900 placeholder:text-gray-400 focus:border-[#CDF88D] focus:outline-none focus:ring-2 focus:ring-[#CDF88D]/20"
 />
 {query && (
 <button
 onClick={() => setQuery("")}
 className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
 >
 <X className="h-5 w-5" />
 </button>
 )}
 </div>
 <Button
 variant="ghost"
 onClick={onClose}
 className="shrink-0 rounded-full px-4 text-sm font-medium text-gray-600 hover:text-gray-900"
 >
 Cancel
 </Button>
 </div>

 {/* Category Filter Pills */}
 <div className="mt-4 flex flex-wrap gap-2">
 {CATEGORIES.map((cat) => (
 <button
 key={cat}
 onClick={() =>
 setSelectedCategory(
 selectedCategory === cat ? null : cat
 )
 }
 className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
 selectedCategory === cat
 ? "bg-[#CDF88D] text-[#14532d] shadow-sm"
 : "bg-gray-100 text-gray-600 hover:bg-gray-200"
 }`}
 >
 {cat}
 </button>
 ))}
 </div>

 {/* Content */}
 <div className="mt-8 space-y-8">
 {/* Recent Searches */}
 {RECENT_SEARCHES.length > 0 && (
 <div>
 <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-500">
 <Clock className="h-4 w-4" />
 Recent Searches
 </h3>
 <div className="space-y-1">
 {RECENT_SEARCHES.map((search) => (
 <button
 key={search}
 onClick={() => setQuery(search)}
 className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
 >
 <span>{search}</span>
 <ArrowRight className="h-4 w-4 text-gray-400" />
 </button>
 ))}
 </div>
 </div>
 )}

 {/* Popular Campaigns */}
 <div>
 <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-500">
 <TrendingUp className="h-4 w-4" />
 Trending Campaigns
 </h3>
 <div className="space-y-2">
 {POPULAR_CAMPAIGNS.map((campaign) => (
 <Link
 key={campaign.id}
 href={`/campaign/${campaign.slug}`}
 onClick={onClose}
 className="flex items-center justify-between rounded-xl px-4 py-3 transition-colors hover:bg-gray-50"
 >
 <div>
 <p className="text-sm font-medium text-gray-900">
 {campaign.title}
 </p>
 <div className="mt-1 flex items-center gap-2">
 <Badge
 variant="secondary"
 className="text-[10px]"
 >
 {campaign.category}
 </Badge>
 <span className="text-xs text-gray-500">
 ${campaign.raised.toLocaleString()} raised
 </span>
 </div>
 </div>
 <ArrowRight className="h-4 w-4 shrink-0 text-gray-400" />
 </Link>
 ))}
 </div>
 </div>

 {/* Empty State for Search Results */}
 {query && (
 <div className="py-12 text-center">
 <Search className="mx-auto h-12 w-12 text-gray-300" />
 <p className="mt-4 text-sm text-gray-500">
 Press Enter to search for &ldquo;{query}&rdquo;
 </p>
 </div>
 )}
 </div>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 );
}
