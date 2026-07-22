import Link from "next/link";
import {
 DollarSign,
 Users,
 Megaphone,
 Wallet,
 TrendingUp,
 TrendingDown,
 Plus,
 CreditCard,
 ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
 Table,
 TableBody,
 TableCell,
 TableHead,
 TableHeader,
 TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const STATS = [
 {
 title: "Total Raised",
 value: "$24,563",
 change: "+12.5%",
 trend: "up" as const,
 icon: DollarSign,
 color: "text-green-600 bg-green-100",
 },
 {
 title: "Total Donors",
 value: "1,234",
 change: "+8.2%",
 trend: "up" as const,
 icon: Users,
 color: "text-blue-600 bg-blue-100",
 },
 {
 title: "Active Campaigns",
 value: "5",
 change: "+2",
 trend: "up" as const,
 icon: Megaphone,
 color: "text-amber-600 bg-amber-100",
 },
 {
 title: "Wallet Balance",
 value: "$3,240",
 change: "-$500",
 trend: "down" as const,
 icon: Wallet,
 color: "text-purple-600 bg-purple-100",
 },
];

const RECENT_DONATIONS = [
 { id: "1", donor: "Sarah Wilson", avatar: "/avatars/sarah.jpg", campaign: "Help Build a School", amount: 150, date: "2025-07-18", status: "completed" },
 { id: "2", donor: "Anonymous", avatar: null, campaign: "Medical Emergency Fund", amount: 50, date: "2025-07-17", status: "completed" },
 { id: "3", donor: "Mike Johnson", avatar: "/avatars/mike.jpg", campaign: "Clean Water Initiative", amount: 200, date: "2025-07-17", status: "completed" },
 { id: "4", donor: "Emily Chen", avatar: "/avatars/emily.jpg", campaign: "Help Build a School", amount: 75, date: "2025-07-16", status: "completed" },
 { id: "5", donor: "David Brown", avatar: "/avatars/david.jpg", campaign: "Orphanage Support", amount: 300, date: "2025-07-15", status: "pending" },
];

const RECENT_ACTIVITY = [
 { id: "1", type: "donation", text: "Sarah Wilson donated $150 to Help Build a School", time: "2 hours ago" },
 { id: "2", type: "update", text: "Your campaign \"Clean Water Initiative\" reached 65%", time: "5 hours ago" },
 { id: "3", type: "donation", text: "Anonymous donated $50 to Medical Emergency Fund", time: "1 day ago" },
 { id: "4", type: "milestone", text: "Help Build a School reached 100 donors", time: "2 days ago" },
 { id: "5", type: "withdrawal", text: "Withdrawal of $500 processed successfully", time: "3 days ago" },
];

const ACTIVITY_COLORS: Record<string, string> = {
 donation: "bg-green-500",
 update: "bg-blue-500",
 milestone: "bg-amber-500",
 withdrawal: "bg-purple-500",
};

const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
const BAR_HEIGHTS = [65, 45, 80, 55, 90, 70, 85, 60, 75, 95, 50, 88];

export default function DashboardPage() {
 return (
 <div className="space-y-6">
 <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
 <div>
 <h2 className="text-2xl font-bold text-foreground">Welcome back, John!</h2>
 <p className="text-sm text-muted-foreground">
 Here&apos;s what&apos;s happening with your campaigns.
 </p>
 </div>
 <Link href="/create-campaign">
 <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
 <Plus className="h-4 w-4" />
 Create Campaign
 </Button>
 </Link>
 </div>

 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
 {STATS.map((stat) => (
 <Card key={stat.title}>
 <CardContent className="p-4">
 <div className="flex items-center justify-between">
 <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", stat.color)}>
 <stat.icon className="h-5 w-5" />
 </div>
 <div className={cn("flex items-center gap-1 text-xs font-medium", stat.trend === "up" ? "text-green-600" : "text-red-600")}>
 {stat.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
 {stat.change}
 </div>
 </div>
 <div className="mt-3">
 <p className="text-2xl font-bold text-foreground">{stat.value}</p>
 <p className="text-xs text-muted-foreground">{stat.title}</p>
 </div>
 </CardContent>
 </Card>
 ))}
 </div>

 <div className="grid gap-6 lg:grid-cols-3">
 <Card className="lg:col-span-2">
 <CardHeader>
 <CardTitle>Donation Overview</CardTitle>
 </CardHeader>
 <CardContent>
 <div className="flex h-[280px] items-end gap-2 p-4">
 {BAR_HEIGHTS.map((height, i) => (
 <div key={i} className="flex flex-1 flex-col items-center gap-1">
 <div className="w-full rounded-t-md bg-primary/80 transition-all hover:bg-primary" style={{ height: `${height}%` }} />
 <span className="text-[10px] text-muted-foreground">{MONTHS[i]}</span>
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
 <div className="relative mt-1">
 <div className={cn("h-2 w-2 rounded-full", ACTIVITY_COLORS[activity.type])} />
 </div>
 <div className="min-w-0 flex-1">
 <p className="text-sm text-foreground line-clamp-2">{activity.text}</p>
 <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
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
 <CardTitle>Recent Donations</CardTitle>
 <Link href="/dashboard/donations">
 <Button variant="ghost" size="sm" className="text-primary">
 View All
 <ArrowUpRight className="h-3 w-3" />
 </Button>
 </Link>
 </div>
 </CardHeader>
 <CardContent>
 <Table>
 <TableHeader>
 <TableRow>
 <TableHead>Donor</TableHead>
 <TableHead>Campaign</TableHead>
 <TableHead>Amount</TableHead>
 <TableHead>Date</TableHead>
 <TableHead>Status</TableHead>
 </TableRow>
 </TableHeader>
 <TableBody>
 {RECENT_DONATIONS.map((donation) => (
 <TableRow key={donation.id}>
 <TableCell>
 <div className="flex items-center gap-2">
 <Avatar size="sm">
 <AvatarImage src={donation.avatar || undefined} alt={donation.donor} />
 <AvatarFallback>{donation.donor[0]}</AvatarFallback>
 </Avatar>
 <span className="font-medium">{donation.donor}</span>
 </div>
 </TableCell>
 <TableCell className="text-muted-foreground">{donation.campaign}</TableCell>
 <TableCell className="font-semibold text-foreground">${donation.amount}</TableCell>
 <TableCell className="text-muted-foreground">{new Date(donation.date).toLocaleDateString()}</TableCell>
 <TableCell>
 <Badge variant={donation.status === "completed" ? "default" : "secondary"} className={donation.status === "completed" ? "bg-green-100 text-green-700" : ""}>
 {donation.status}
 </Badge>
 </TableCell>
 </TableRow>
 ))}
 </TableBody>
 </Table>
 </CardContent>
 </Card>

 <div className="grid gap-4 sm:grid-cols-2">
 <Card className="cursor-pointer transition-colors hover:bg-muted/50">
 <CardContent className="p-4">
 <div className="flex items-center gap-3">
 <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
 <Plus className="h-5 w-5 text-primary" />
 </div>
 <div>
 <p className="text-sm font-semibold text-foreground">Create Campaign</p>
 <p className="text-xs text-muted-foreground">Start a new fundraiser</p>
 </div>
 </div>
 </CardContent>
 </Card>
 <Card className="cursor-pointer transition-colors hover:bg-muted/50">
 <CardContent className="p-4">
 <div className="flex items-center gap-3">
 <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
 <CreditCard className="h-5 w-5 text-primary" />
 </div>
 <div>
 <p className="text-sm font-semibold text-foreground">View Withdrawals</p>
 <p className="text-xs text-muted-foreground">Manage your funds</p>
 </div>
 </div>
 </CardContent>
 </Card>
 </div>
 </div>
 );
}
