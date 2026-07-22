"use client";

import { useState } from "react";
import { Wallet, CreditCard, Bitcoin, Building2, ArrowRight, Clock, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Separator } from "@/components/ui/separator";

const WITHDRAWAL_HISTORY = [
 { id: "WD-001", date: "2025-07-15", amount: 500, method: "bank", account: "•••• 4521", status: "approved", campaign: "Help Build a School" },
 { id: "WD-002", date: "2025-07-10", amount: 250, method: "paypal", account: "john@email.com", status: "approved", campaign: "Clean Water Initiative" },
 { id: "WD-003", date: "2025-07-05", amount: 1000, method: "stripe", account: "•••• 7890", status: "pending", campaign: "Help Build a School" },
 { id: "WD-004", date: "2025-06-28", amount: 300, method: "crypto", account: "0x1234...5678", status: "rejected", campaign: "Medical Emergency Fund" },
];

const METHOD_ICONS: Record<string, typeof Wallet> = {
 bank: Building2,
 paypal: CreditCard,
 crypto: Bitcoin,
 stripe: CreditCard,
};

const STATUS_STYLES: Record<string, string> = {
 approved: "bg-green-100 text-green-700",
 pending: "bg-amber-100 text-amber-700",
 rejected: "bg-red-100 text-red-700",
};

export default function WithdrawalsPage() {
 const [method, setMethod] = useState("bank");

 return (
 <div className="space-y-6">
 <div>
 <h2 className="text-2xl font-bold text-foreground">Withdrawals</h2>
 <p className="text-sm text-muted-foreground">Request withdrawals and track your payment history.</p>
 </div>

 <div className="grid gap-6 lg:grid-cols-3">
 <Card className="lg:col-span-1">
 <CardHeader>
 <CardTitle>Request Withdrawal</CardTitle>
 <CardDescription>Transfer funds to your account</CardDescription>
 </CardHeader>
 <CardContent className="space-y-4">
 <div className="rounded-lg border border-dashed border-primary/50 bg-primary/5 p-4 text-center">
 <p className="text-xs text-muted-foreground">Available Balance</p>
 <p className="text-3xl font-bold text-primary">$3,240.00</p>
 </div>

 <div className="space-y-2">
 <Label>Amount</Label>
 <Input type="number" placeholder="Enter amount" min="10" />
 </div>

 <div className="space-y-2">
 <Label>Withdrawal Method</Label>
 <Select value={method} onValueChange={(v) => setMethod(v ?? "")}>
 <SelectTrigger className="w-full">
 <SelectValue />
 </SelectTrigger>
 <SelectContent>
 <SelectItem value="bank">Bank Transfer</SelectItem>
 <SelectItem value="paypal">PayPal</SelectItem>
 <SelectItem value="stripe">Stripe Connect</SelectItem>
 <SelectItem value="crypto">Cryptocurrency</SelectItem>
 </SelectContent>
 </Select>
 </div>

 {method === "bank" && (
 <div className="space-y-2">
 <Label>Bank Account Number</Label>
 <Input placeholder="Enter account number" />
 </div>
 )}
 {method === "paypal" && (
 <div className="space-y-2">
 <Label>PayPal Email</Label>
 <Input type="email" placeholder="your@email.com" />
 </div>
 )}
 {method === "crypto" && (
 <div className="space-y-2">
 <Label>Wallet Address</Label>
 <Input placeholder="0x..." />
 </div>
 )}
 {method === "stripe" && (
 <div className="space-y-2">
 <Label>Stripe Account ID</Label>
 <Input placeholder="acct_..." />
 </div>
 )}

 <div className="space-y-2">
 <Label>Note (optional)</Label>
 <Textarea placeholder="Add a note for this withdrawal..." className="min-h-[60px]" />
 </div>

 <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
 Request Withdrawal
 <ArrowRight className="h-4 w-4" />
 </Button>

 <p className="text-[11px] text-muted-foreground text-center">
 Withdrawals are processed within 2-5 business days. Minimum withdrawal: $10.
 </p>
 </CardContent>
 </Card>

 <Card className="lg:col-span-2">
 <CardHeader>
 <CardTitle>Withdrawal History</CardTitle>
 </CardHeader>
 <CardContent>
 <Table>
 <TableHeader>
 <TableRow>
 <TableHead>Date</TableHead>
 <TableHead>Campaign</TableHead>
 <TableHead>Amount</TableHead>
 <TableHead>Method</TableHead>
 <TableHead>Account</TableHead>
 <TableHead>Status</TableHead>
 </TableRow>
 </TableHeader>
 <TableBody>
 {WITHDRAWAL_HISTORY.map((wd) => {
 const MethodIcon = METHOD_ICONS[wd.method] || Wallet;
 return (
 <TableRow key={wd.id}>
 <TableCell className="text-muted-foreground">
 {new Date(wd.date).toLocaleDateString()}
 </TableCell>
 <TableCell className="max-w-[160px] truncate text-muted-foreground">
 {wd.campaign}
 </TableCell>
 <TableCell className="font-semibold text-foreground">${wd.amount}</TableCell>
 <TableCell>
 <div className="flex items-center gap-1.5">
 <MethodIcon className="h-3.5 w-3.5 text-muted-foreground" />
 <span className="capitalize text-muted-foreground">{wd.method}</span>
 </div>
 </TableCell>
 <TableCell className="text-muted-foreground font-mono text-xs">
 {wd.account}
 </TableCell>
 <TableCell>
 <Badge className={cn(STATUS_STYLES[wd.status])}>
 {wd.status === "approved" && <CheckCircle2 className="h-3 w-3 mr-1" />}
 {wd.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
 {wd.status === "rejected" && <XCircle className="h-3 w-3 mr-1" />}
 {wd.status}
 </Badge>
 </TableCell>
 </TableRow>
 );
 })}
 </TableBody>
 </Table>
 </CardContent>
 </Card>
 </div>
 </div>
 );
}
