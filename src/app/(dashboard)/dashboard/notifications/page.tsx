"use client";

import { useState } from "react";
import Link from "next/link";
import {
 Bell,
 Heart,
 Megaphone,
 Wallet,
 AlertTriangle,
 CheckCircle,
 CheckCheck,
 Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const NOTIFICATIONS = [
 {
 id: "1",
 type: "donation",
 title: "New Donation",
 message: "Sarah Wilson donated $150 to Help Build a School",
 link: "/dashboard/donations",
 read: false,
 createdAt: "2025-07-18T10:30:00Z",
 icon: Heart,
 color: "text-green-600 bg-green-100",
 },
 {
 id: "2",
 type: "campaign",
 title: "Campaign Milestone",
 message: "Your campaign \"Clean Water Initiative\" reached 65% of its goal",
 link: "/dashboard/campaigns",
 read: false,
 createdAt: "2025-07-18T08:15:00Z",
 icon: Megaphone,
 color: "text-blue-600 bg-blue-100",
 },
 {
 id: "3",
 type: "withdrawal",
 title: "Withdrawal Processed",
 message: "Your withdrawal of $500 has been processed successfully",
 link: "/dashboard/withdrawals",
 read: false,
 createdAt: "2025-07-17T16:45:00Z",
 icon: Wallet,
 color: "text-purple-600 bg-purple-100",
 },
 {
 id: "4",
 type: "donation",
 title: "New Donation",
 message: "Anonymous donated $50 to Medical Emergency Fund",
 link: "/dashboard/donations",
 read: true,
 createdAt: "2025-07-17T12:00:00Z",
 icon: Heart,
 color: "text-green-600 bg-green-100",
 },
 {
 id: "5",
 type: "alert",
 title: "Campaign Review",
 message: "Your campaign \"Community Garden Project\" is under review",
 link: "/dashboard/campaigns",
 read: true,
 createdAt: "2025-07-16T09:30:00Z",
 icon: AlertTriangle,
 color: "text-amber-600 bg-amber-100",
 },
 {
 id: "6",
 type: "donation",
 title: "New Donation",
 message: "Mike Johnson donated $200 to Clean Water Initiative",
 link: "/dashboard/donations",
 read: true,
 createdAt: "2025-07-15T14:20:00Z",
 icon: Heart,
 color: "text-green-600 bg-green-100",
 },
];

function timeAgo(dateStr: string): string {
 const now = new Date();
 const date = new Date(dateStr);
 const diffMs = now.getTime() - date.getTime();
 const diffMin = Math.floor(diffMs / 60000);
 const diffHr = Math.floor(diffMin / 60);
 const diffDay = Math.floor(diffHr / 24);
 if (diffMin < 1) return "just now";
 if (diffMin < 60) return `${diffMin}m ago`;
 if (diffHr < 24) return `${diffHr}h ago`;
 if (diffDay < 7) return `${diffDay}d ago`;
 return date.toLocaleDateString();
}

export default function NotificationsPage() {
 const [notifications, setNotifications] = useState(NOTIFICATIONS);
 const [filter, setFilter] = useState("all");

 const unreadCount = notifications.filter((n) => !n.read).length;

 const filtered = notifications.filter((n) => {
 if (filter === "all") return true;
 if (filter === "unread") return !n.read;
 return n.type === filter;
 });

 const markAllRead = () => {
 setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
 };

 const markRead = (id: string) => {
 setNotifications((prev) =>
 prev.map((n) => (n.id === id ? { ...n, read: true } : n))
 );
 };

 return (
 <div className="space-y-6">
 <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
 <div>
 <h2 className="text-2xl font-bold text-foreground">Notifications</h2>
 <p className="text-sm text-muted-foreground">
 {unreadCount > 0 ? `You have ${unreadCount} unread notifications` : "You're all caught up!"}
 </p>
 </div>
 {unreadCount > 0 && (
 <Button variant="outline" onClick={markAllRead}>
 <CheckCheck className="h-4 w-4" />
 Mark all as read
 </Button>
 )}
 </div>

 <Tabs value={filter} onValueChange={setFilter}>
 <TabsList variant="line">
 <TabsTrigger value="all">All</TabsTrigger>
 <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
 <TabsTrigger value="donation">Donations</TabsTrigger>
 <TabsTrigger value="campaign">Campaigns</TabsTrigger>
 <TabsTrigger value="withdrawal">Withdrawals</TabsTrigger>
 <TabsTrigger value="alert">Alerts</TabsTrigger>
 </TabsList>

 <TabsContent value={filter}>
 <Card>
 <CardContent className="p-0">
 {filtered.length === 0 ? (
 <div className="flex flex-col items-center justify-center py-16 text-center">
 <Bell className="h-10 w-10 text-muted-foreground/50 mb-3" />
 <p className="text-sm text-muted-foreground">No notifications to show.</p>
 </div>
 ) : (
 <div className="divide-y divide-border">
 {filtered.map((notification) => {
 const Icon = notification.icon;
 return (
 <Link
 key={notification.id}
 href={notification.link}
 onClick={() => markRead(notification.id)}
 className={cn(
 "flex items-start gap-4 p-4 transition-colors hover:bg-muted/50",
 !notification.read && "bg-primary/5"
 )}
 >
 <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full", notification.color)}>
 <Icon className="h-4 w-4" />
 </div>
 <div className="min-w-0 flex-1">
 <div className="flex items-center gap-2">
 <p className={cn("text-sm font-medium", !notification.read ? "text-foreground" : "text-muted-foreground")}>
 {notification.title}
 </p>
 {!notification.read && (
 <span className="flex h-2 w-2 rounded-full bg-primary" />
 )}
 </div>
 <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
 {notification.message}
 </p>
 <p className="text-xs text-muted-foreground/70 mt-1">
 {timeAgo(notification.createdAt)}
 </p>
 </div>
 </Link>
 );
 })}
 </div>
 )}
 </CardContent>
 </Card>
 </TabsContent>
 </Tabs>
 </div>
 );
}
