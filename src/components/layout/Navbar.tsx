"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Menu, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { navLinks } from "@/lib/data"

export function Navbar() {
 const [mobileOpen, setMobileOpen] = useState(false)
 const [searchOpen, setSearchOpen] = useState(false)

 return (
 <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-xl">
 <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
 <Link href="/" className="flex items-center gap-2">
 <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#22c55e]">
 <Heart className="h-5 w-5 text-white" fill="white" />
 </div>
 <span className="text-xl font-bold tracking-tight">FundForward</span>
 </Link>

 <nav className="hidden items-center gap-1 md:flex">
 {navLinks.map((link) => (
 <Link
 key={link.href}
 href={link.href}
 className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
 >
 {link.label}
 </Link>
 ))}
 </nav>

 <div className="hidden items-center gap-2 md:flex">
 <button
  onClick={() => setSearchOpen(!searchOpen)}
  className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
  >
  <Search className="h-5 w-5" />
  </button>
  <Link href="/login">
 <Button variant="ghost" size="sm">
 Log In
 </Button>
 </Link>
 <Link href="/create-campaign">
 <Button size="sm" className="bg-[#22c55e] text-white hover:bg-[#16a34a]">
 Start a Campaign
 </Button>
 </Link>
 </div>

 <div className="flex items-center gap-1 md:hidden">
  <button
 onClick={() => setMobileOpen(!mobileOpen)}
 className="rounded-lg p-2 text-gray-500"
 >
 {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
 </button>
 </div>
 </div>

 <AnimatePresence>
 {searchOpen && (
 <motion.div
 initial={{ height: 0, opacity: 0 }}
 animate={{ height: "auto", opacity: 1 }}
 exit={{ height: 0, opacity: 0 }}
 className="border-t bg-white"
 >
 <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
 <div className="relative">
 <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
 <Input placeholder="Search campaigns, categories, people..." className="pl-10" />
 </div>
 </div>
 </motion.div>
 )}
 </AnimatePresence>

 <AnimatePresence>
 {mobileOpen && (
 <motion.div
 initial={{ height: 0, opacity: 0 }}
 animate={{ height: "auto", opacity: 1 }}
 exit={{ height: 0, opacity: 0 }}
 className="border-t bg-white md:hidden"
 >
 <div className="space-y-1 px-4 py-3">
 {navLinks.map((link) => (
 <Link
 key={link.href}
 href={link.href}
 onClick={() => setMobileOpen(false)}
 className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
 >
 {link.label}
 </Link>
 ))}
 <div className="flex flex-col gap-2 pt-3">
 <Link href="/login" onClick={() => setMobileOpen(false)}>
 <Button variant="outline" className="w-full">
 Log In
 </Button>
 </Link>
 <Link href="/create-campaign" onClick={() => setMobileOpen(false)}>
 <Button className="w-full bg-[#22c55e] text-white hover:bg-[#16a34a]">
 Start a Campaign
 </Button>
 </Link>
 </div>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </header>
 )
}
