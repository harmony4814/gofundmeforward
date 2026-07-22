"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Plus, FolderOpen, User } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
 { label: "Home", href: "/", icon: Home },
 { label: "Explore", href: "/explore", icon: Search },
 { label: "Start", href: "/create", icon: Plus, is_center: true },
 { label: "Campaigns", href: "/dashboard/campaigns", icon: FolderOpen },
 { label: "Profile", href: "/profile", icon: User },
];

export default function MobileNav() {
 const pathname = usePathname();

 return (
 <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom)] lg:hidden">
 <div className="flex h-16 items-center justify-around px-2">
 {TABS.map((tab) => {
 const is_active =
 tab.href === "/"
 ? pathname === "/"
 : pathname.startsWith(tab.href);

 if (tab.is_center) {
 return (
 <Link
 key={tab.href}
 href={tab.href}
 className="group relative -mt-6"
 >
 <div
 className={cn(
 "flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all",
 "bg-green-500 text-white hover:bg-green-600 hover:shadow-xl hover:scale-105",
 "active:scale-95"
 )}
 >
 <Plus className="h-6 w-6" />
 </div>
 <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-medium text-green-500">
 {tab.label}
 </span>
 </Link>
 );
 }

 return (
 <Link
 key={tab.href}
 href={tab.href}
 className="flex flex-col items-center gap-1 px-3 py-1"
 >
 <tab.icon
 className={cn(
 "h-5 w-5 transition-colors",
 is_active
 ? "text-green-500"
 : "text-gray-400 group-hover:text-gray-600"
 )}
 />
 <span
 className={cn(
 "text-[10px] font-medium transition-colors",
 is_active
 ? "text-green-500"
 : "text-gray-400"
 )}
 >
 {tab.label}
 </span>
 </Link>
 );
 })}
 </div>
 </nav>
 );
}
