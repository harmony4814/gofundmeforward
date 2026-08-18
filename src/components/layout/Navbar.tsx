"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Search, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BrandLogo } from "@/components/shared/BrandLogo"
import { navLinks } from "@/lib/data"

const drawerLinks = [
 {
 title: "Manage your activity",
 description: "Sign in or create an account to manage your donations and fundraisers.",
 href: "/login",
 },
 {
 title: "Explore",
 description: "Browse active fundraisers and discover inspiring causes.",
 href: "/categories",
 },
 {
 title: "Start Fundraising",
 description: "Create a fundraiser and access tips and fundraising resources.",
 href: "/create-campaign",
 },
 {
 title: "About",
  description: "Learn how gofundme works, pricing, trust, and safety.",
 href: "/about",
 },
 {
 title: "Help Centre",
 description: "Technical support, FAQs, and contact information.",
 href: "/faq",
 },
]

const drawerContainer = {
 hidden: {},
 show: { transition: { staggerChildren: 0.06, delayChildren: 0.12 } },
}

const drawerItem = {
 hidden: { opacity: 0, x: 24 },
 show: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
}

export function Navbar() {
 const [mobileOpen, setMobileOpen] = useState(false)
 const [searchOpen, setSearchOpen] = useState(false)
 const [hidden, setHidden] = useState(false)
 const [scrolled, setScrolled] = useState(false)
 const drawerRef = useRef<HTMLDivElement>(null)
 const closeButtonRef = useRef<HTMLButtonElement>(null)
 const menuButtonRef = useRef<HTMLButtonElement>(null)

 const closeMenu = () => setMobileOpen(false)
 const leftLinks = navLinks.slice(0, 2)
 const rightLinks = navLinks.slice(2)

 useEffect(() => {
  if (mobileOpen) return
  let prevY = window.scrollY
  const threshold = 120
  const onScroll = () => {
   const y = window.scrollY
   const delta = y - prevY
   setScrolled(y > threshold)
   if (y <= threshold) {
    setHidden(false)
   } else if (delta > 6) {
    setHidden(true)
   } else if (delta < -6) {
    setHidden(false)
   }
   prevY = y
  }
  window.addEventListener("scroll", onScroll, { passive: true })
  return () => window.removeEventListener("scroll", onScroll)
 }, [mobileOpen])

 useEffect(() => {
  if (!mobileOpen) return
  const previous = document.body.style.overflow
  document.body.style.overflow = "hidden"
  closeButtonRef.current?.focus()

  const onKeyDown = (event: KeyboardEvent) => {
   if (event.key === "Escape") {
    setMobileOpen(false)
    return
   }
   if (event.key !== "Tab") return
   const focusable = drawerRef.current?.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
   )
   if (!focusable || focusable.length === 0) return
   const first = focusable[0]
   const last = focusable[focusable.length - 1]
   if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
   } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
   }
  }

  document.addEventListener("keydown", onKeyDown)
  return () => {
   document.body.style.overflow = previous
   document.removeEventListener("keydown", onKeyDown)
  }
 }, [mobileOpen])

 return (
 <>
 <motion.header
  initial={false}
  animate={{ y: hidden ? "-100%" : "0%" }}
  transition={{ duration: 0.4, ease: "easeInOut" }}
  className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-shadow duration-300 ${
   scrolled
    ? "border-gray-200 bg-white/95 shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
    : "border-gray-100 bg-white/80 shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
  }`}
 >
 <div className={`mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 transition-[height] duration-300 sm:px-6 lg:px-8 ${scrolled ? "h-16" : "h-20"}`}>

 <nav className="hidden items-center gap-6 md:flex">
 <button
 onClick={() => setSearchOpen(!searchOpen)}
 className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
 >
 <Search className="h-5 w-5" />
 </button>
 {leftLinks.map((link) => (
 <Link
 key={link.href}
 href={link.href}
 className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
 >
 {link.label}
 </Link>
 ))}
 </nav>

  <Link href="/" className="col-start-2 flex items-center justify-self-center">
  <BrandLogo />
  </Link>

 <div className="hidden items-center gap-6 justify-self-end md:flex">
 {rightLinks.map((link) => (
 <Link
 key={link.href}
 href={link.href}
 className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
 >
 {link.label}
 </Link>
 ))}
 <div className="flex items-center gap-2">
 <Link href="/login">
 <Button variant="ghost" size="sm">
 Log In
 </Button>
 </Link>
 <Link href="/create-campaign">
 <Button size="sm" className="bg-[#CDF88D] text-[#14532d] hover:bg-[#CDF88D]">
 Start a Campaign
 </Button>
 </Link>
 </div>
 </div>

 <div className="col-start-3 flex items-center gap-1 justify-self-end md:hidden">
 <button
 ref={menuButtonRef}
 onClick={() => setMobileOpen(true)}
 aria-label="Open menu"
 className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
 >
 <Menu className="h-6 w-6" />
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
 </motion.header>

 <AnimatePresence>
 {mobileOpen && (
 <>
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 transition={{ duration: 0.3 }}
 onClick={closeMenu}
 aria-hidden="true"
 className="fixed inset-0 z-[60] bg-black/40 md:hidden"
 />
 <motion.aside
 ref={drawerRef}
 role="dialog"
 aria-modal="true"
 aria-label="Mobile menu"
 initial={{ x: "100%" }}
 animate={{ x: 0 }}
 exit={{ x: "100%" }}
 transition={{ duration: 0.3, ease: "easeOut" }}
 className="fixed inset-y-0 right-0 z-[70] flex w-[88%] max-w-[420px] flex-col bg-white shadow-2xl md:hidden"
 >
 <div className="flex items-center justify-between px-7 py-6">
  <Link href="/" onClick={closeMenu} className="flex items-center">
  <BrandLogo />
  </Link>
 <button
 ref={closeButtonRef}
 onClick={closeMenu}
 aria-label="Close menu"
 className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 active:scale-95"
 >
 <X className="h-6 w-6" />
 </button>
 </div>

 <nav aria-label="Mobile navigation" className="flex-1 overflow-y-auto px-7 py-4">
 <motion.ul
 variants={drawerContainer}
 initial="hidden"
 animate="show"
  className="max-md:space-y-[18px]"
 >
 {drawerLinks.map((link) => (
 <motion.li key={link.title} variants={drawerItem}>
 <Link
 href={link.href}
 onClick={closeMenu}
  className="group flex items-center justify-between gap-4 rounded-xl px-2 py-2 transition-colors hover:bg-gray-50 active:scale-[0.99] max-md:py-1.5"
  >
  <div>
  <p className="max-md:text-lg font-bold text-gray-900 transition-colors group-hover:text-[#CDF88D]">
  {link.title}
  </p>
  <p className="max-md:mt-1 max-md:text-sm max-md:leading-[1.45] text-gray-500">
  {link.description}
  </p>
 </div>
 <ChevronRight className="h-5 w-5 shrink-0 text-gray-400 transition-all group-hover:translate-x-0.5 group-hover:text-gray-600" />
 </Link>
 </motion.li>
 ))}
 </motion.ul>
 </nav>

 <div className="border-t border-gray-100 px-7 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6">
 <div className="flex flex-col gap-3">
 <Link href="/create-campaign" onClick={closeMenu}>
 <Button className="h-[58px] w-full rounded-full bg-[#CDF88D] text-base text-[#14532d] hover:bg-[#174a2e]">
 Start a Fundraiser
 </Button>
 </Link>
 <Link href="/login" onClick={closeMenu}>
 <Button variant="outline" className="h-[58px] w-full rounded-full border-gray-200 text-base text-gray-900">
 Sign In
 </Button>
 </Link>
 </div>
 </div>
 </motion.aside>
 </>
 )}
 </AnimatePresence>
 </>
 )
}
