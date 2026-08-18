"use client";

import { useState } from "react";
import { Search, Check, X, Wallet, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
 Table,
 TableBody,
 TableCell,
 TableHead,
 TableHeader,
 TableRow,
} from "@/components/ui/table";
import {
 AlertDialog,
 AlertDialogAction,
 AlertDialogCancel,
 AlertDialogContent,
 AlertDialogDescription,
 AlertDialogFooter,
 AlertDialogHeader,
 AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const WITHDRAWALS = [
 { id: "wdr_1", user: { name: "John Doe", avatar: "/avatars/john.jpg" }, campaign: "Help Build a School in Rural Kenya", amount: 5000, method: "bank_transfer", accountDetails: "****4521", status: "pending", date: "2025-07-18T10:00:00Z" },
 { id: "wdr_2", user: { name: "Sarah Wilson", avatar: "/avatars/sarah.jpg" }, campaign: "Medical Emergency Fund for Sarah", amount: 3200, method: "paypal", accountDetails: "sarah@paypal.me", status: "pending", date: "2025-07-18T08:30:00Z" },
 { id: "wdr_3", user: { name: "Mike Johnson", avatar: "/avatars/mike.jpg" }, campaign: "Animal Shelter Renovation", amount: 8500, method: "bank_transfer", accountDetails: "****7890", status: "approved", date: "2025-07-17T16:00:00Z" },
 { id: "wdr_4", user: { name: "Alice Brown", avatar: "/avatars/alice.jpg" }, campaign: "Community Tech Hub", amount: 2000, method: "flutterwave", accountDetails: "alice@email.com", status: "approved", date: "2025-07-17T12:00:00Z" },
 { id: "wdr_5", user: { name: "Bob Smith", avatar: "/avatars/bob.jpg" }, campaign: "Youth Sports Program", amount: 1500, method: "paypal", accountDetails: "bob@email.com", status: "rejected", date: "2025-07-16T14:00:00Z" },
 { id: "wdr_6", user: { name: "Emily Chen", avatar: "/avatars/emily.jpg" }, campaign: "Environmental Cleanup", amount: 4000, method: "bank_transfer", accountDetails: "****1234", status: "pending", date: "2025-07-16T10:00:00Z" },
 { id: "wdr_7", user: { name: "Carlos Garcia", avatar: null }, campaign: "Scholarship Fund", amount: 6000, method: "bank_transfer", accountDetails: "****5678", status: "approved", date: "2025-07-15T11:00:00Z" },
 { id: "wdr_8", user: { name: "John Doe", avatar: "/avatars/john.jpg" }, campaign: "Help Build a School in Rural Kenya", amount: 2500, method: "paypal", accountDetails: "john@email.com", status: "approved", date: "2025-07-15T09:00:00Z" },
 { id: "wdr_9", user: { name: "Lisa Park", avatar: null }, campaign: "Medical Emergency Fund for Sarah", amount: 1800, method: "flutterwave", accountDetails: "lisa@email.com", status: "rejected", date: "2025-07-14T15:00:00Z" },
 { id: "wdr_10", user: { name: "Emma White", avatar: null }, campaign: "Community Tech Hub", amount: 3000, method: "bank_transfer", accountDetails: "****9012", status: "pending", date: "2025-07-14T10:00:00Z" },
 { id: "wdr_11", user: { name: "Tom Harris", avatar: null }, campaign: "Animal Shelter Renovation", amount: 1200, method: "paypal", accountDetails: "tom@email.com", status: "approved", date: "2025-07-13T13:00:00Z" },
];

const STATUS_STYLES: Record<string, string> = {
 pending: "bg-amber-100 text-amber-700",
 approved: "bg-[#CDF88D] text-[#CDF88D]",
 rejected: "bg-red-100 text-red-700",
};

const METHOD_STYLES: Record<string, string> = {
 bank_transfer: "bg-purple-100 text-purple-700",
 paypal: "bg-indigo-100 text-indigo-700",
 flutterwave: "bg-orange-100 text-orange-700",
};

const METHOD_LABELS: Record<string, string> = {
 bank_transfer: "Bank Transfer",
 paypal: "PayPal",
 flutterwave: "Flutterwave",
};

export default function AdminWithdrawalsPage() {
 const [activeTab, setActiveTab] = useState("all");
 const [search, setSearch] = useState("");
 const [alertOpen, setAlertOpen] = useState(false);
 const [alertAction, setAlertAction] = useState<"approve" | "reject" | null>(null);
 const [selectedId, setSelectedId] = useState<string | null>(null);

 const filtered = WITHDRAWALS.filter((w) => {
 const matchesSearch =
 w.user.name.toLowerCase().includes(search.toLowerCase()) ||
 w.campaign.toLowerCase().includes(search.toLowerCase());
 const matchesTab = activeTab === "all" || w.status === activeTab;
 return matchesSearch && matchesTab;
 });

 const handleAction = (id: string, action: "approve" | "reject") => {
 setSelectedId(id);
 setAlertAction(action);
 setAlertOpen(true);
 };

 const confirmAction = () => {
 setAlertOpen(false);
 setAlertAction(null);
 setSelectedId(null);
 };

 const pendingCount = WITHDRAWALS.filter((w) => w.status === "pending").length;
 const approvedThisMonth = WITHDRAWALS.filter(
 (w) => w.status === "approved" && new Date(w.date).getMonth() === new Date().getMonth()
 ).length;
 const totalWithdrawn = WITHDRAWALS
 .filter((w) => w.status === "approved")
 .reduce((sum, w) => sum + w.amount, 0);
 const pendingAmount = WITHDRAWALS
 .filter((w) => w.status === "pending")
 .reduce((sum, w) => sum + w.amount, 0);

 return (
 <div className="space-y-6">
 <div>
 <h2 className="text-2xl font-bold text-foreground">Withdrawal Management</h2>
 <p className="text-sm text-muted-foreground">Review and process withdrawal requests.</p>
 </div>

 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
 <Card>
 <CardContent className="p-4">
 <div className="flex items-center gap-3">
 <div className="flex h-10 w-10 items-center justify-center rounded-lg text-amber-600 bg-amber-100">
 <Clock className="h-5 w-5" />
 </div>
 <div>
 <p className="text-xs text-muted-foreground">Pending Withdrawals</p>
 <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
 </div>
 </div>
 </CardContent>
 </Card>
 <Card>
 <CardContent className="p-4">
 <div className="flex items-center gap-3">
 <div className="flex h-10 w-10 items-center justify-center rounded-lg text-[#CDF88D] bg-[#CDF88D]">
 <CheckCircle className="h-5 w-5" />
 </div>
 <div>
 <p className="text-xs text-muted-foreground">Approved This Month</p>
 <p className="text-2xl font-bold text-foreground">{approvedThisMonth}</p>
 </div>
 </div>
 </CardContent>
 </Card>
 <Card>
 <CardContent className="p-4">
 <div className="flex items-center gap-3">
 <div className="flex h-10 w-10 items-center justify-center rounded-lg text-blue-600 bg-blue-100">
 <Wallet className="h-5 w-5" />
 </div>
 <div>
 <p className="text-xs text-muted-foreground">Total Withdrawn</p>
 <p className="text-2xl font-bold text-foreground">${totalWithdrawn.toLocaleString()}</p>
 </div>
 </div>
 </CardContent>
 </Card>
 <Card>
 <CardContent className="p-4">
 <div className="flex items-center gap-3">
 <div className="flex h-10 w-10 items-center justify-center rounded-lg text-orange-600 bg-orange-100">
 <AlertTriangle className="h-5 w-5" />
 </div>
 <div>
 <p className="text-xs text-muted-foreground">Pending Amount</p>
 <p className="text-2xl font-bold text-foreground">${pendingAmount.toLocaleString()}</p>
 </div>
 </div>
 </CardContent>
 </Card>
 </div>

 <Tabs value={activeTab} onValueChange={setActiveTab}>
 <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
 <TabsList variant="line">
 <TabsTrigger value="all">All ({WITHDRAWALS.length})</TabsTrigger>
 <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
 <TabsTrigger value="approved">Approved ({WITHDRAWALS.filter((w) => w.status === "approved").length})</TabsTrigger>
 <TabsTrigger value="rejected">Rejected ({WITHDRAWALS.filter((w) => w.status === "rejected").length})</TabsTrigger>
 </TabsList>
 <div className="relative">
 <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
 <Input
 placeholder="Search withdrawals..."
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 className="h-8 w-64 pl-8"
 />
 </div>
 </div>

 <Card className="mt-4">
 <CardContent className="p-0">
 <Table>
 <TableHeader>
 <TableRow>
 <TableHead>User</TableHead>
 <TableHead>Campaign</TableHead>
 <TableHead>Amount</TableHead>
 <TableHead>Method</TableHead>
 <TableHead>Account</TableHead>
 <TableHead>Status</TableHead>
 <TableHead>Date</TableHead>
 <TableHead className="text-right">Actions</TableHead>
 </TableRow>
 </TableHeader>
 <TableBody>
 {filtered.map((withdrawal) => (
 <TableRow key={withdrawal.id}>
 <TableCell>
 <div className="flex items-center gap-2">
 <Avatar size="sm">
 <AvatarImage src={withdrawal.user.avatar || undefined} alt={withdrawal.user.name} />
 <AvatarFallback>{withdrawal.user.name[0]}</AvatarFallback>
 </Avatar>
 <span className="text-sm font-medium">{withdrawal.user.name}</span>
 </div>
 </TableCell>
 <TableCell className="text-muted-foreground max-w-[200px] truncate">
 {withdrawal.campaign}
 </TableCell>
 <TableCell className="font-semibold">
 ${withdrawal.amount.toLocaleString()}
 </TableCell>
 <TableCell>
 <Badge className={cn("capitalize", METHOD_STYLES[withdrawal.method])}>
 {METHOD_LABELS[withdrawal.method]}
 </Badge>
 </TableCell>
 <TableCell className="font-mono text-xs text-muted-foreground">
 {withdrawal.accountDetails}
 </TableCell>
 <TableCell>
 <Badge className={cn("capitalize", STATUS_STYLES[withdrawal.status])}>
 {withdrawal.status}
 </Badge>
 </TableCell>
 <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
 {new Date(withdrawal.date).toLocaleDateString()}
 </TableCell>
 <TableCell className="text-right">
 {withdrawal.status === "pending" ? (
 <div className="flex items-center justify-end gap-2">
 <Button
 size="sm"
 className="bg-[#CDF88D] text-[#14532d] hover:bg-[#CDF88D]"
 onClick={() => handleAction(withdrawal.id, "approve")}
 >
 <Check className="h-3 w-3" />
 Approve
 </Button>
 <Button
 size="sm"
 variant="destructive"
 onClick={() => handleAction(withdrawal.id, "reject")}
 >
 <X className="h-3 w-3" />
 Reject
 </Button>
 </div>
 ) : (
 <span className="text-xs text-muted-foreground">No actions</span>
 )}
 </TableCell>
 </TableRow>
 ))}
 {filtered.length === 0 && (
 <TableRow>
 <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
 No withdrawals found.
 </TableCell>
 </TableRow>
 )}
 </TableBody>
 </Table>
 </CardContent>
 </Card>
 </Tabs>

 <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
 <AlertDialogContent>
 <AlertDialogHeader>
 <AlertDialogTitle>
 {alertAction === "approve" ? "Approve Withdrawal" : "Reject Withdrawal"}
 </AlertDialogTitle>
 <AlertDialogDescription>
 {alertAction === "approve"
 ? "Are you sure you want to approve this withdrawal? The funds will be transferred to the user's account."
 : "Are you sure you want to reject this withdrawal? The user will be notified of the rejection."}
 </AlertDialogDescription>
 </AlertDialogHeader>
 <AlertDialogFooter>
 <AlertDialogCancel>Cancel</AlertDialogCancel>
 <AlertDialogAction
 onClick={confirmAction}
 className={cn(
 alertAction === "approve"
 ? "bg-[#CDF88D] text-[#14532d] hover:bg-[#CDF88D]"
 : "bg-destructive text-destructive-foreground hover:bg-destructive/90"
 )}
 >
 {alertAction === "approve" ? "Approve" : "Reject"}
 </AlertDialogAction>
 </AlertDialogFooter>
 </AlertDialogContent>
 </AlertDialog>
 </div>
 );
}
