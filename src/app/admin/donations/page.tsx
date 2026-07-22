"use client";

import { useState } from "react";
import { Search, Download, DollarSign, CreditCard, TrendingUp, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {
 Table,
 TableBody,
 TableCell,
 TableHead,
 TableHeader,
 TableRow,
} from "@/components/ui/table";

const DONATIONS = [
 { id: "don_8xk2m9p3", donor: "John Doe", campaign: "Help Build a School in Rural Kenya", amount: 250, fee: 12.50, net: 237.50, method: "card", status: "completed", date: "2025-07-18T14:30:00Z" },
 { id: "don_7yj1n8o2", donor: "Sarah Wilson", campaign: "Medical Emergency Fund for Sarah", amount: 500, fee: 25, net: 475, method: "paypal", status: "completed", date: "2025-07-18T12:15:00Z" },
 { id: "don_6wh0m7n1", donor: "Anonymous", campaign: "Community Tech Hub", amount: 100, fee: 5, net: 95, method: "card", status: "completed", date: "2025-07-18T10:45:00Z" },
 { id: "don_5vg9l6m0", donor: "Mike Johnson", campaign: "Youth Sports Program", amount: 75, fee: 3.75, net: 71.25, method: "flutterwave", status: "completed", date: "2025-07-17T22:00:00Z" },
 { id: "don_4uf8k5l9", donor: "Alice Brown", campaign: "Animal Shelter Renovation", amount: 1000, fee: 50, net: 950, method: "paystack", status: "completed", date: "2025-07-17T18:30:00Z" },
 { id: "don_3te7j4k8", donor: "Bob Smith", campaign: "Help Build a School in Rural Kenya", amount: 200, fee: 10, net: 190, method: "card", status: "pending", date: "2025-07-17T15:20:00Z" },
 { id: "don_2sd6i3j7", donor: "Emily Chen", campaign: "Medical Emergency Fund for Sarah", amount: 350, fee: 17.50, net: 332.50, method: "bank_transfer", status: "completed", date: "2025-07-17T09:10:00Z" },
 { id: "don_1rc5h2i6", donor: "David Lee", campaign: "Community Tech Hub", amount: 50, fee: 2.50, net: 47.50, method: "crypto", status: "failed", date: "2025-07-16T20:45:00Z" },
 { id: "don_0qb4g1h5", donor: "Sarah Wilson", campaign: "Environmental Cleanup", amount: 150, fee: 7.50, net: 142.50, method: "card", status: "completed", date: "2025-07-16T14:30:00Z" },
 { id: "don_zpa3f0g4", donor: "Carlos Garcia", campaign: "Scholarship Fund", amount: 750, fee: 37.50, net: 712.50, method: "paypal", status: "completed", date: "2025-07-16T11:00:00Z" },
 { id: "don_yoz2e9f3", donor: "John Doe", campaign: "Youth Sports Program", amount: 300, fee: 15, net: 285, method: "card", status: "pending", date: "2025-07-15T16:20:00Z" },
 { id: "don_xny1d8e2", donor: "Lisa Park", campaign: "Help Build a School in Rural Kenya", amount: 5000, fee: 250, net: 4750, method: "bank_transfer", status: "completed", date: "2025-07-15T09:00:00Z" },
 { id: "don_wmx0c7d1", donor: "Anonymous", campaign: "Medical Emergency Fund for Sarah", amount: 25, fee: 1.25, net: 23.75, method: "card", status: "failed", date: "2025-07-14T22:10:00Z" },
 { id: "don_vlw9b6c0", donor: "Tom Harris", campaign: "Animal Shelter Renovation", amount: 200, fee: 10, net: 190, method: "flutterwave", status: "completed", date: "2025-07-14T17:45:00Z" },
 { id: "don_ukv8a5b9", donor: "Emma White", campaign: "Community Tech Hub", amount: 500, fee: 25, net: 475, method: "paystack", status: "completed", date: "2025-07-14T13:30:00Z" },
 { id: "don_tju7z4a8", donor: "Bob Smith", campaign: "Environmental Cleanup", amount: 100, fee: 5, net: 95, method: "card", status: "pending", date: "2025-07-13T10:15:00Z" },
 { id: "don_sit6y3z7", donor: "Mike Johnson", campaign: "Scholarship Fund", amount: 250, fee: 12.50, net: 237.50, method: "crypto", status: "completed", date: "2025-07-13T08:00:00Z" },
];

const STATUS_STYLES: Record<string, string> = {
 completed: "bg-green-100 text-green-700",
 pending: "bg-amber-100 text-amber-700",
 failed: "bg-red-100 text-red-700",
};

const METHOD_STYLES: Record<string, string> = {
 card: "bg-blue-100 text-blue-700",
 paypal: "bg-indigo-100 text-indigo-700",
 flutterwave: "bg-orange-100 text-orange-700",
 paystack: "bg-green-100 text-green-700",
 bank_transfer: "bg-purple-100 text-purple-700",
 crypto: "bg-amber-100 text-amber-700",
};

const METHOD_LABELS: Record<string, string> = {
 card: "Card",
 paypal: "PayPal",
 flutterwave: "Flutterwave",
 paystack: "Paystack",
 bank_transfer: "Bank Transfer",
 crypto: "Crypto",
};

const ITEMS_PER_PAGE = 8;

export default function AdminDonationsPage() {
 const [activeTab, setActiveTab] = useState("all");
 const [search, setSearch] = useState("");
 const [dateRange, setDateRange] = useState("all");
 const [page, setPage] = useState(1);

 const filtered = DONATIONS.filter((d) => {
 const matchesSearch =
 d.donor.toLowerCase().includes(search.toLowerCase()) ||
 d.campaign.toLowerCase().includes(search.toLowerCase()) ||
 d.id.toLowerCase().includes(search.toLowerCase());
 const matchesTab = activeTab === "all" || d.status === activeTab;
 return matchesSearch && matchesTab;
 });

 const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
 const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

 const totalAmount = DONATIONS.reduce((sum, d) => sum + d.amount, 0);
 const totalFees = DONATIONS.reduce((sum, d) => sum + d.fee, 0);
 const todayCount = DONATIONS.filter(
 (d) => new Date(d.date).toDateString() === new Date().toDateString()
 ).length;

 return (
 <div className="space-y-6">
 <div>
 <h2 className="text-2xl font-bold text-foreground">Donation Management</h2>
 <p className="text-sm text-muted-foreground">Track and manage all donations on the platform.</p>
 </div>

 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
 <Card>
 <CardContent className="p-4">
 <div className="flex items-center gap-3">
 <div className="flex h-10 w-10 items-center justify-center rounded-lg text-blue-600 bg-blue-100">
 <DollarSign className="h-5 w-5" />
 </div>
 <div>
 <p className="text-xs text-muted-foreground">Total Donations</p>
 <p className="text-2xl font-bold text-foreground">{DONATIONS.length}</p>
 </div>
 </div>
 </CardContent>
 </Card>
 <Card>
 <CardContent className="p-4">
 <div className="flex items-center gap-3">
 <div className="flex h-10 w-10 items-center justify-center rounded-lg text-green-600 bg-green-100">
 <TrendingUp className="h-5 w-5" />
 </div>
 <div>
 <p className="text-xs text-muted-foreground">Total Amount</p>
 <p className="text-2xl font-bold text-foreground">${totalAmount.toLocaleString()}</p>
 </div>
 </div>
 </CardContent>
 </Card>
 <Card>
 <CardContent className="p-4">
 <div className="flex items-center gap-3">
 <div className="flex h-10 w-10 items-center justify-center rounded-lg text-red-600 bg-red-100">
 <CreditCard className="h-5 w-5" />
 </div>
 <div>
 <p className="text-xs text-muted-foreground">Total Fees</p>
 <p className="text-2xl font-bold text-foreground">${totalFees.toLocaleString()}</p>
 </div>
 </div>
 </CardContent>
 </Card>
 <Card>
 <CardContent className="p-4">
 <div className="flex items-center gap-3">
 <div className="flex h-10 w-10 items-center justify-center rounded-lg text-amber-600 bg-amber-100">
 <Calendar className="h-5 w-5" />
 </div>
 <div>
 <p className="text-xs text-muted-foreground">Today&apos;s Donations</p>
 <p className="text-2xl font-bold text-foreground">{todayCount}</p>
 </div>
 </div>
 </CardContent>
 </Card>
 </div>

 <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setPage(1); }}>
 <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
 <TabsList variant="line">
 <TabsTrigger value="all">All ({DONATIONS.length})</TabsTrigger>
 <TabsTrigger value="completed">Completed ({DONATIONS.filter((d) => d.status === "completed").length})</TabsTrigger>
 <TabsTrigger value="pending">Pending ({DONATIONS.filter((d) => d.status === "pending").length})</TabsTrigger>
 <TabsTrigger value="failed">Failed ({DONATIONS.filter((d) => d.status === "failed").length})</TabsTrigger>
 </TabsList>
 <div className="flex items-center gap-2">
 <div className="relative">
 <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
 <Input
 placeholder="Search donations..."
 value={search}
 onChange={(e) => { setSearch(e.target.value); setPage(1); }}
 className="h-8 w-56 pl-8"
 />
 </div>
 <Select value={dateRange} onValueChange={(v) => setDateRange(v ?? "all")}>
 <SelectTrigger size="sm" className="w-[130px]">
 <SelectValue />
 </SelectTrigger>
 <SelectContent>
 <SelectItem value="all">All Time</SelectItem>
 <SelectItem value="today">Today</SelectItem>
 <SelectItem value="week">This Week</SelectItem>
 <SelectItem value="month">This Month</SelectItem>
 </SelectContent>
 </Select>
 <Button variant="outline" size="sm">
 <Download className="h-4 w-4" />
 Export
 </Button>
 </div>
 </div>

 <Card className="mt-4">
 <CardContent className="p-0">
 <Table>
 <TableHeader>
 <TableRow>
 <TableHead>ID</TableHead>
 <TableHead>Donor</TableHead>
 <TableHead>Campaign</TableHead>
 <TableHead>Amount</TableHead>
 <TableHead>Fee</TableHead>
 <TableHead>Net</TableHead>
 <TableHead>Method</TableHead>
 <TableHead>Status</TableHead>
 <TableHead>Date</TableHead>
 </TableRow>
 </TableHeader>
 <TableBody>
 {paginated.map((donation) => (
 <TableRow key={donation.id}>
 <TableCell className="font-mono text-xs text-muted-foreground">
 {donation.id.slice(0, 12)}...
 </TableCell>
 <TableCell className="font-medium">
 {donation.donor}
 </TableCell>
 <TableCell className="text-muted-foreground max-w-[200px] truncate">
 {donation.campaign}
 </TableCell>
 <TableCell className="font-semibold">
 ${donation.amount.toLocaleString()}
 </TableCell>
 <TableCell className="text-muted-foreground">
 ${donation.fee.toFixed(2)}
 </TableCell>
 <TableCell className="font-medium">
 ${donation.net.toLocaleString()}
 </TableCell>
 <TableCell>
 <Badge className={cn("capitalize", METHOD_STYLES[donation.method])}>
 {METHOD_LABELS[donation.method]}
 </Badge>
 </TableCell>
 <TableCell>
 <Badge className={cn("capitalize", STATUS_STYLES[donation.status])}>
 {donation.status}
 </Badge>
 </TableCell>
 <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
 {new Date(donation.date).toLocaleDateString()}{" "}
 {new Date(donation.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
 </TableCell>
 </TableRow>
 ))}
 {paginated.length === 0 && (
 <TableRow>
 <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
 No donations found.
 </TableCell>
 </TableRow>
 )}
 </TableBody>
 </Table>
 </CardContent>
 </Card>

 {totalPages > 1 && (
 <div className="flex items-center justify-between">
 <p className="text-sm text-muted-foreground">
 Showing {(page - 1) * ITEMS_PER_PAGE + 1} to{" "}
 {Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} donations
 </p>
 <div className="flex items-center gap-2">
 <Button
 variant="outline"
 size="sm"
 onClick={() => setPage((p) => Math.max(1, p - 1))}
 disabled={page === 1}
 >
 Previous
 </Button>
 {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
 <Button
 key={p}
 variant={p === page ? "default" : "outline"}
 size="sm"
 onClick={() => setPage(p)}
 className="w-8"
 >
 {p}
 </Button>
 ))}
 <Button
 variant="outline"
 size="sm"
 onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
 disabled={page === totalPages}
 >
 Next
 </Button>
 </div>
 </div>
 )}
 </Tabs>
 </div>
 );
}
