"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Monitor, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeProviderToggle() {
 const { setTheme, theme } = useTheme()
 const [mounted, setMounted] = useState(false)
 const [open, setOpen] = useState(false)

 useEffect(() => {
 setMounted(true)
 }, [])

 if (!mounted) {
 return (
 <Button variant="ghost" size="icon" className="h-9 w-9">
 <Sun className="h-5 w-5 opacity-0" />
 </Button>
 )
 }

 return (
 <div className="relative">
 <Button
 variant="ghost"
 size="icon"
 className="h-9 w-9"
 onClick={() => setOpen(!open)}
 aria-label="Toggle theme"
 >
 <Sun className="h-5 w-5 rotate-0 scale-100 transition-all" />
 <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all" />
 <span className="sr-only">Toggle theme</span>
 </Button>

 {open && (
 <>
 <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
 <div className="absolute right-0 top-full z-50 mt-1 w-36 overflow-hidden rounded-lg border bg-white shadow-lg">
 <button
 onClick={() => { setTheme("light"); setOpen(false) }}
 className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-gray-100 ${theme === "light" ? "text-[#22c55e]" : "text-gray-600"}`}
 >
 <Sun className="h-4 w-4" />
 Light
 </button>
 <button
 onClick={() => { setTheme("dark"); setOpen(false) }}
 className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-gray-100 ${theme === "dark" ? "text-[#22c55e]" : "text-gray-600"}`}
 >
 <Moon className="h-4 w-4" />
 Dark
 </button>
 <button
 onClick={() => { setTheme("system"); setOpen(false) }}
 className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-gray-100 ${theme === "system" ? "text-[#22c55e]" : "text-gray-600"}`}
 >
 <Monitor className="h-4 w-4" />
 System
 </button>
 </div>
 </>
 )}
 </div>
 )
}
