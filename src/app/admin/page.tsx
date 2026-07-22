import Link from "next/link";
import {
 Users,
 Megaphone,
 Heart,
 Wallet,
 TrendingUp,
 Clock,
 DollarSign,
 ArrowUpRight,
 AlertTriangle,
 Activity,
 Calendar,
 Percent,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const STATS = [
 { title: "Total Users", value: "12,847", change: "+340 this month", icon: Users, color: "text-blue-600 bg-blue-100" },
 { title: "Total Campaigns", value: "3,456", change: "+89 this month", icon: Megaphone, color: "text-purple-600 bg-purple-100" },
 { title: "Active Campaigns", value: "1,234", change: "35.7% of total", icon: Activity, color: "text-green-600 bg-green-100" },
 { title: "Pending Campaigns", value: "23", change: "Needs review", icon: Clock, color: "text-amber-600 bg-amber-100" },
 { title: "Total Donations", value: "$2.4M", change: "+$180K this month", icon: DollarSign, color: "text-emerald-600 bg-emerald-100" },
 { title: "Total Withdrawals", value: "$1.8M", change: "+$95K this month", icon: Wallet, color: "text-orange-600 bg-orange-100" },
 { title: "Today's Donations", value: "$4,520", change: "+12.5% vs yesterday", icon: TrendingUp, color: "text-green-600 bg-green-100" },
 { title: "Monthly Revenue", value: "$72,400", change: "+8.3% vs last month", icon: Calendar, color: "text-indigo-600 bg-indigo-100" },
 { title: "Platform Fees", value: "$24,130", change: "5% of donations", icon: Percent, color: "text-pink-600 bg-pink-100" },
];

const RECENT_ACTIVITY = [
 { id: "1", type: "user", text: "New user registered: Sarah Wilson", time: "5 min ago" },
 { id: "2", type: "campaign", text: "New campaign submitted: School in Kenya", time: "15 min ago" },
 { id: "3", type: "donation", text: "Large donation: $5,000 to Medical Fund", time: "30 min ago" },
 { id: "4", type: "withdrawal", text: "Withdrawal request: $1,000 by John Doe", time: "1 hr ago" },
 { id: "5", type: "report", text: "New report on campaign: Suspicious content", time: "2 hr ago" },
 { id: "6", type: "campaign", text: "Campaign completed: Animal Shelter Fund", time: "3 hr ago" },
];

const PENDING_CAMPAIGNS = [
 { id: "1", title: "Community Tech Hub", organizer: "Alice Brown", submitted: "2 hours ago" },
 { id: "2", title: "Youth Sports Program", organizer: "Bob Smith", submitted: "5 hours ago" },
 { id: "3", title: "Elderly Care Center", organizer: "Carol Davis", submitted: "1 day ago" },
 { id: "4", title: "Environmental Cleanup", organizer: "Dan Wilson", submitted: "1 day ago" },
 { id: "5", title: "Scholarship Fund", organizer: "Eva Martinez", submitted: "2 days ago" },
];

const ACTIVITY_DOT: Record<string, string> = {
 user: "bg-blue-500",
 campaign: "bg-primary",
 donation: "bg-green-500",
 withdrawal: "bg-amber-500",
 report: "bg-red-500",
};

export default function AdminDashboardPage() {
 return (
 <div className="space-y-6">
 <div>
 <h2 className="text-2xl font-bold text-foreground">Admin Dashboard</h2>
 <p className="text-sm text-muted-foreground">Platform overview and management.</p>
 </div>

 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
 {STATS.map((stat) => (
 <Card key={stat.title}>
 <CardContent className="p-4">
 <div className="flex items-center justify-between">
 <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", stat.color)}>
 <stat.icon className="h-5 w-5" />
 </div>
 </div>
 <div className="mt-3">
 <p className="text-2xl font-bold text-foreground">{stat.value}</p>
 <p className="text-xs text-muted-foreground">{stat.title}</p>
 <p className="text-[11px] text-primary mt-0.5">{stat.change}</p>
 </div>
 </CardContent>
 </Card>
 ))}
 </div>

 <div className="grid gap-6 lg:grid-cols-3">
 <Card className="lg:col-span-2">
 <CardHeader>
 <CardTitle>Revenue Overview</CardTitle>
 </CardHeader>
 <CardContent>
 <div className="flex h-[280px] items-end gap-2 p-4">
 {[45, 55, 70, 50, 85, 65, 80, 70, 90, 60, 75, 95].map((height, i) => (
 <div key={i} className="flex flex-1 flex-col items-center gap-1">
 <div
 className="w-full rounded-t-md bg-primary/80 transition-all hover:bg-primary"
 style={{ height: `${height}%` }}
 />
 <span className="text-[10px] text-muted-foreground">
 {["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][i]}
 </span>
 </div>
 ))}
 </div>
 </CardContent>
 </Card>

 <Card>
 <CardHeader>
 <CardTitle>Recent Activity</CardTitle>
 </CardHeader>
 <CardContent>
 <div className="space-y-4">
 {RECENT_ACTIVITY.map((activity) => (
 <div key={activity.id} className="flex gap-3">
 <div className="relative mt-1.5">
 <div className={cn("h-2 w-2 rounded-full", ACTIVITY_DOT[activity.type])} />
 </div>
 <div className="min-w-0 flex-1">
 <p className="text-sm text-foreground line-clamp-2">{activity.text}</p>
 <p className="text-[11px] text-muted-foreground mt-0.5">{activity.time}</p>
 </div>
 </div>
 ))}
 </div>
 </CardContent>
 </Card>
 </div>

 <Card>
 <CardHeader>
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <CardTitle>Pending Campaigns</CardTitle>
 <Badge className="bg-amber-100 text-amber-700">
 {PENDING_CAMPAIGNS.length} pending
 </Badge>
 </div>
 <Link href="/admin/campaigns">
 <Button variant="ghost" size="sm" className="text-primary">
 View All
 <ArrowUpRight className="h-3 w-3" />
 </Button>
 </Link>
 </div>
 </CardHeader>
 <CardContent>
 <div className="space-y-3">
 {PENDING_CAMPAIGNS.map((campaign) => (
 <div key={campaign.id} className="flex items-center justify-between rounded-lg border p-3">
 <div>
 <p className="text-sm font-medium text-foreground">{campaign.title}</p>
 <p className="text-xs text-muted-foreground">
 by {campaign.organizer} &middot; {campaign.submitted}
 </p>
 </div>
 <div className="flex items-center gap-2">
 <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
 Review
 </Button>
 </div>
 </div>
 ))}
 </div>
 </CardContent>
 </Card>
 </div>
 );
}
