"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
 LayoutDashboard,
 Megaphone,
 Heart,
 Banknote,
 Bell,
 MessageSquare,
 Settings,
 Shield,
 ChevronLeft,
 ChevronRight,
 LogOut,
 User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
 is_admin?: boolean;
}

const NAV_ITEMS = [
 {
 label: "Overview",
 href: "/dashboard",
 icon: LayoutDashboard,
 },
 {
 label: "My Campaigns",
 href: "/dashboard/campaigns",
 icon: Megaphone,
 },
 {
 label: "Donations Received",
 href: "/dashboard/donations",
 icon: Heart,
 },
 {
 label: "Withdrawals",
 href: "/dashboard/withdrawals",
 icon: Banknote,
 },
 {
 label: "Notifications",
 href: "/dashboard/notifications",
 icon: Bell,
 },
 {
 label: "Messages",
 href: "/dashboard/messages",
 icon: MessageSquare,
 },
 {
 label: "Settings",
 href: "/dashboard/settings",
 icon: Settings,
 },
];

export default function DashboardSidebar({
 is_admin = false,
}: DashboardSidebarProps) {
 const pathname = usePathname();
 const [collapsed, setCollapsed] = useState(false);

 const is_active = (href: string) => {
 if (href === "/dashboard") return pathname === "/dashboard";
 return pathname.startsWith(href);
 };

 return (
 <motion.aside
 animate={{ width: collapsed ? 72 : 260 }}
 transition={{ duration: 0.2, ease: "easeInOut" }}
 className="sticky top-16 z-40 hidden h-[calc(100vh-4rem)] flex-col border-r border-gray-200 bg-white md:flex"
 >
 {/* User Profile */}
 <div className="flex items-center gap-3 p-4">
 <Avatar>
 <AvatarImage src="/avatars/user.jpg" alt="User" />
 <AvatarFallback>
 <User className="h-4 w-4" />
 </AvatarFallback>
 </Avatar>
 <AnimatePresence>
 {!collapsed && (
 <motion.div
 initial={{ opacity: 0, width: 0 }}
 animate={{ opacity: 1, width: "auto" }}
 exit={{ opacity: 0, width: 0 }}
 className="min-w-0 overflow-hidden"
 >
 <p className="truncate text-sm font-medium text-gray-900">
 John Doe
 </p>
 <p className="truncate text-xs text-gray-500">
 john@example.com
 </p>
 </motion.div>
 )}
 </AnimatePresence>
 </div>

 <Separator />

 {/* Navigation */}
 <nav className="flex-1 space-y-1 overflow-y-auto p-3">
 {NAV_ITEMS.map((item) => {
 const active = is_active(item.href);
 return (
 <Link
 key={item.href}
 href={item.href}
 className={cn(
 "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
 active
 ? "bg-green-50 text-green-600"
 : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
 )}
 >
 <item.icon
 className={cn(
 "h-5 w-5 shrink-0",
 active
 ? "text-green-500"
 : "text-gray-400"
 )}
 />
 <AnimatePresence>
 {!collapsed && (
 <motion.span
 initial={{ opacity: 0, width: 0 }}
 animate={{ opacity: 1, width: "auto" }}
 exit={{ opacity: 0, width: 0 }}
 className="truncate"
 >
 {item.label}
 </motion.span>
 )}
 </AnimatePresence>
 {item.label === "Notifications" && !collapsed && (
 <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-green-500 px-1.5 text-[10px] font-bold text-white">
 3
 </span>
 )}
 </Link>
 );
 })}

 {/* Admin Link */}
 {is_admin && (
 <>
 <Separator className="my-3" />
 <Link
 href="/admin"
 className={cn(
 "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
 pathname.startsWith("/admin")
 ? "bg-green-50 text-green-600"
 : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
 )}
 >
 <Shield
 className={cn(
 "h-5 w-5 shrink-0",
 pathname.startsWith("/admin")
 ? "text-green-500"
 : "text-gray-400"
 )}
 />
 <AnimatePresence>
 {!collapsed && (
 <motion.span
 initial={{ opacity: 0, width: 0 }}
 animate={{ opacity: 1, width: "auto" }}
 exit={{ opacity: 0, width: 0 }}
 className="truncate"
 >
 Admin Panel
 </motion.span>
 )}
 </AnimatePresence>
 </Link>
 </>
 )}
 </nav>

 <Separator />

 {/* Bottom Actions */}
 <div className="space-y-1 p-3">
 <Link
 href="/"
 className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
 >
 <LogOut className="h-5 w-5 shrink-0 text-gray-400" />
 <AnimatePresence>
 {!collapsed && (
 <motion.span
 initial={{ opacity: 0, width: 0 }}
 animate={{ opacity: 1, width: "auto" }}
 exit={{ opacity: 0, width: 0 }}
 >
 Back to Site
 </motion.span>
 )}
 </AnimatePresence>
 </Link>
 </div>

 {/* Collapse Toggle */}
 <button
 onClick={() => setCollapsed(!collapsed)}
 className="flex h-10 items-center justify-center border-t border-gray-200 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600"
 >
 {collapsed ? (
 <ChevronRight className="h-4 w-4" />
 ) : (
 <ChevronLeft className="h-4 w-4" />
 )}
 </button>
 </motion.aside>
 );
}
