"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Megaphone,
  Heart,
  Wallet,
  Bell,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

const SIDEBAR_LINKS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Campaigns",
    href: "/dashboard/campaigns",
    icon: Megaphone,
  },
  {
    label: "Donations",
    href: "/dashboard/donations",
    icon: Heart,
  },
  {
    label: "Withdrawals",
    href: "/dashboard/withdrawals",
    icon: Wallet,
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

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col border-r border-border bg-card transition-all duration-300",
        collapsed ? "w-[68px]" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <Heart className="h-4 w-4 text-primary-foreground" fill="currentColor" />
            </div>
            <span className="text-lg font-bold text-foreground">
              Fund<span className="text-primary">Rise</span>
            </span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setCollapsed(!collapsed)}
          className={cn("shrink-0", collapsed && "mx-auto")}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <Separator />

      <nav className="flex-1 overflow-y-auto p-2">
        <div className="flex flex-col gap-0.5">
          {SIDEBAR_LINKS.map((link) => {
            const isActive =
              link.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                title={collapsed ? link.label : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <link.icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} />
                {!collapsed && <span>{link.label}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      <Separator />

      <div className={cn("flex items-center gap-3 p-4", collapsed && "justify-center")}>
        <Avatar size="sm">
          <AvatarImage src="/avatars/user.jpg" alt="User" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        {!collapsed && (
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium truncate">John Doe</span>
            <span className="text-xs text-muted-foreground truncate">john@example.com</span>
          </div>
        )}
      </div>
    </aside>
  );
}
