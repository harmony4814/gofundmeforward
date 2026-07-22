"use client";

import { useState } from "react";
import { Download, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from "@/components/ui/select";
import {
 Table,
 TableBody,
 TableCell,
 TableHead,
 TableHeader,
 TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const DONATIONS = [
 { id: "DON-001", date: "2025-07-18", donor: "Sarah Wilson", avatar: "/avatars/sarah.jpg", campaign: "Help Build a School", amount: 150, status: "completed", method: "stripe" },
 { id: "DON-002", date: "2025-07-17", donor: "Anonymous", avatar: null, campaign: "Medical Emergency Fund", amount: 50, status: "completed", method: "paypal" },
 { id: "DON-003", date: "2025-07-17", donor: "Mike Johnson", avatar: "/avatars/mike.jpg", campaign: "Clean Water Initiative", amount: 200, status: "completed", method: "stripe" },
 { id: "DON-004", date: "2025-07-16", donor: "Emily Chen", avatar: "/avatars/emily.jpg", campaign: "Help Build a School", amount: 75, status: "completed", method: "flutterwave" },
 { id: "DON-005", date: "2025-07-15", donor: "David Brown", avatar: "/avatars/david.jpg", campaign: "Orphanage Support", amount: 300, status: "pending", method: "stripe" },
 { id: "DON-006", date: "2025-07-14", donor: "Lisa Anderson", avatar: "/avatars/lisa.jpg", campaign: "Clean Water Initiative", amount: 100, status: "completed", method: "paystack" },
 { id: "DON-007", date: "2025-07-13", donor: "James Wilson", avatar: "/avatars/james.jpg", campaign: "Help Build a School", amount: 25, status: "completed", method: "crypto" },
 { id: "DON-008", date: "2025-07-12", donor: "Anonymous", avatar: null, campaign: "Medical Emergency Fund", amount: 500, status: "completed", method: "stripe" },
 { id: "DON-009", date: "2025-07-11", donor: "Maria Garcia", avatar: "/avatars/maria.jpg", campaign: "Help Build a School", amount: 200, status: "refunded", method: "paypal" },
 { id: "DON-010", date: "2025-07-10", donor: "Robert Taylor", avatar: "/avatars/robert.jpg", campaign: "Clean Water Initiative", amount: 75, status: "completed", method: "bank_transfer" },
];

const STATUS_STYLES: Record<string, string> = {
 completed: "bg-green-100 text-green-700",
 pending: "bg-amber-100 text-amber-700",
 refunded: "bg-red-100 text-red-700",
 failed: "bg-red-100 text-red-700",
};

const METHOD_LABELS: Record<string, string> = {
 stripe: "Stripe",
 paypal: "PayPal",
 flutterwave: "Flutterwave",
 paystack: "Paystack",
 bank_transfer: "Bank Transfer",
 crypto: "Crypto",
};

export default function DonationsPage() {
 const [search, setSearch] = useState("");
 const [methodFilter, setMethodFilter] = useState("all");

 const filteredDonations = DONATIONS.filter((d) => {
 const matchesSearch =
 d.donor.toLowerCase().includes(search.toLowerCase()) ||
 d.campaign.toLowerCase().includes(search.toLowerCase()) ||
 d.id.toLowerCase().includes(search.toLowerCase());
 const matchesMethod = methodFilter === "all" || d.method === methodFilter;
 return matchesSearch && matchesMethod;
 });

 const totalAmount = filteredDonations
 .filter((d) => d.status === "completed")
 .reduce((sum, d) => sum + d.amount, 0);

 return (
 <div className="space-y-6">
 <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
 <div>
 <h2 className="text-2xl font-bold text-foreground">Donations Received</h2>
 <p className="text-sm text-muted-foreground">Track all donations across your campaigns.</p>
 </div>
 <Button variant="outline">
 <Download className="h-4 w-4" />
 Export CSV
 </Button>
 </div>

 <div className="grid gap-4 sm:grid-cols-3">
 <Card>
 <CardContent className="p-4">
 <p className="text-xs text-muted-foreground">Total Donations</p>
 <p className="text-2xl font-bold text-foreground">${totalAmount.toLocaleString()}</p>
 </CardContent>
 </Card>
 <Card>
 <CardContent className="p-4">
 <p className="text-xs text-muted-foreground">Total Donors</p>
 <p className="text-2xl font-bold text-foreground">{DONATIONS.length}</p>
 </CardContent>
 </Card>
 <Card>
 <CardContent className="p-4">
 <p className="text-xs text-muted-foreground">Average Donation</p>
 <p className="text-2xl font-bold text-foreground">
 ${Math.round(totalAmount / DONATIONS.filter((d) => d.status === "completed").length)}
 </p>
 </CardContent>
 </Card>
 </div>

 <Card>
 <CardHeader>
 <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
 <CardTitle>All Donations</CardTitle>
 <div className="flex items-center gap-2">
 <div className="relative">
 <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
 <Input
 placeholder="Search donations..."
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 className="h-8 w-64 pl-8"
 />
 </div>
 <Select value={methodFilter} onValueChange={(v) => setMethodFilter(v ?? "")}>
 <SelectTrigger size="sm" className="w-[140px]">
 <SelectValue placeholder="All Methods" />
 </SelectTrigger>
 <SelectContent>
 <SelectItem value="all">All Methods</SelectItem>
 <SelectItem value="stripe">Stripe</SelectItem>
 <SelectItem value="paypal">PayPal</SelectItem>
 <SelectItem value="flutterwave">Flutterwave</SelectItem>
 <SelectItem value="paystack">Paystack</SelectItem>
 <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
 <SelectItem value="crypto">Crypto</SelectItem>
 </SelectContent>
 </Select>
 </div>
 </div>
 </CardHeader>
 <CardContent>
 <Table>
 <TableHeader>
 <TableRow>
 <TableHead>Date</TableHead>
 <TableHead>Donor</TableHead>
 <TableHead>Campaign</TableHead>
 <TableHead>Amount</TableHead>
 <TableHead>Status</TableHead>
 <TableHead>Method</TableHead>
 </TableRow>
 </TableHeader>
 <TableBody>
 {filteredDonations.map((donation) => (
 <TableRow key={donation.id}>
 <TableCell className="text-muted-foreground">
 {new Date(donation.date).toLocaleDateString()}
 </TableCell>
 <TableCell>
 <div className="flex items-center gap-2">
 <Avatar size="sm">
 <AvatarImage src={donation.avatar || undefined} alt={donation.donor} />
 <AvatarFallback>{donation.donor[0]}</AvatarFallback>
 </Avatar>
 <span className="font-medium">{donation.donor}</span>
 </div>
 </TableCell>
 <TableCell className="text-muted-foreground max-w-[200px] truncate">
 {donation.campaign}
 </TableCell>
 <TableCell className="font-semibold text-foreground">${donation.amount}</TableCell>
 <TableCell>
 <Badge className={STATUS_STYLES[donation.status]}>
 {donation.status}
 </Badge>
 </TableCell>
 <TableCell className="text-muted-foreground">
 {METHOD_LABELS[donation.method]}
 </TableCell>
 </TableRow>
 ))}
 </TableBody>
 </Table>
 </CardContent>
 </Card>
 </div>
 );
}
