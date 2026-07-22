"use client";

import { useState } from "react";
import { Search, Eye, Ban, Trash2, Flag, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
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
 Dialog,
 DialogContent,
 DialogHeader,
 DialogTitle,
 DialogDescription,
 DialogFooter,
} from "@/components/ui/dialog";
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

const REPORTS = [
 {
 id: "rpt_1",
 reporter: { name: "Alice Brown", avatar: "/avatars/alice.jpg" },
 type: "campaign",
 target: "Scam Campaign",
 targetId: "camp_6",
 reason: "Fraudulent campaign with fake photos and misleading description",
 status: "pending",
 date: "2025-07-18T10:00:00Z",
 },
 {
 id: "rpt_2",
 reporter: { name: "Bob Smith", avatar: "/avatars/bob.jpg" },
 type: "comment",
 target: "Offensive comment on Medical Fund",
 targetId: "cmt_12",
 reason: "Contains hate speech and personal attacks",
 status: "pending",
 date: "2025-07-17T15:30:00Z",
 },
 {
 id: "rpt_3",
 reporter: { name: "Emily Chen", avatar: "/avatars/emily.jpg" },
 type: "campaign",
 target: "Duplicate Campaign",
 targetId: "camp_8",
 reason: "This is a duplicate of an existing campaign",
 status: "reviewing",
 date: "2025-07-16T09:00:00Z",
 },
 {
 id: "rpt_4",
 reporter: { name: "John Doe", avatar: "/avatars/john.jpg" },
 type: "comment",
 target: "Spam links in campaign comments",
 targetId: "cmt_15",
 reason: "Posting external spam links repeatedly",
 status: "resolved",
 date: "2025-07-15T14:00:00Z",
 },
 {
 id: "rpt_5",
 reporter: { name: "Sarah Wilson", avatar: "/avatars/sarah.jpg" },
 type: "campaign",
 target: "Misleading Fundraiser",
 targetId: "camp_10",
 reason: "Campaign goal far exceeds actual need, suspected personal profit",
 status: "pending",
 date: "2025-07-14T11:00:00Z",
 },
 {
 id: "rpt_6",
 reporter: { name: "Mike Johnson", avatar: "/avatars/mike.jpg" },
 type: "campaign",
 target: "Stolen Images Campaign",
 targetId: "camp_12",
 reason: "Campaign uses stolen images from another fundraiser",
 status: "reviewing",
 date: "2025-07-13T16:00:00Z",
 },
 {
 id: "rpt_7",
 reporter: { name: "Anonymous", avatar: null },
 type: "comment",
 target: "Harassment on Youth Sports",
 targetId: "cmt_20",
 reason: "Targeted harassment of campaign organizer",
 status: "dismissed",
 date: "2025-07-12T08:00:00Z",
 },
 {
 id: "rpt_8",
 reporter: { name: "Lisa Park", avatar: null },
 type: "campaign",
 target: "Underage Organizer",
 targetId: "camp_14",
 reason: "Campaign organizer appears to be under 18",
 status: "resolved",
 date: "2025-07-11T12:00:00Z",
 },
 {
 id: "rpt_9",
 reporter: { name: "Carlos Garcia", avatar: null },
 type: "comment",
 target: "Phishing links comment",
 targetId: "cmt_22",
 reason: "Comment contains phishing links disguised as donation portals",
 status: "pending",
 date: "2025-07-10T09:30:00Z",
 },
];

const STATUS_STYLES: Record<string, string> = {
 pending: "bg-amber-100 text-amber-700",
 reviewing: "bg-blue-100 text-blue-700",
 resolved: "bg-green-100 text-green-700",
 dismissed: "bg-gray-100 text-gray-700",
};

const TYPE_STYLES: Record<string, string> = {
 campaign: "bg-purple-100 text-purple-700",
 comment: "bg-orange-100 text-orange-700",
};

export default function AdminReportsPage() {
 const [activeTab, setActiveTab] = useState("all");
 const [search, setSearch] = useState("");
 const [detailOpen, setDetailOpen] = useState(false);
 const [selectedReport, setSelectedReport] = useState<typeof REPORTS[number] | null>(null);
 const [alertOpen, setAlertOpen] = useState(false);
 const [alertType, setAlertType] = useState<"dismiss" | "remove" | "ban" | null>(null);

 const filtered = REPORTS.filter((r) => {
 const matchesSearch =
 r.reporter.name.toLowerCase().includes(search.toLowerCase()) ||
 r.target.toLowerCase().includes(search.toLowerCase()) ||
 r.reason.toLowerCase().includes(search.toLowerCase());
 const matchesTab = activeTab === "all" || r.status === activeTab;
 return matchesSearch && matchesTab;
 });

 const handleDetail = (report: typeof REPORTS[number]) => {
 setSelectedReport(report);
 setDetailOpen(true);
 };

 const handleAlert = (type: "dismiss" | "remove" | "ban") => {
 setAlertType(type);
 setAlertOpen(true);
 };

 const confirmAlert = () => {
 setAlertOpen(false);
 setAlertType(null);
 setDetailOpen(false);
 };

 const pendingCount = REPORTS.filter((r) => r.status === "pending").length;
 const reviewingCount = REPORTS.filter((r) => r.status === "reviewing").length;
 const resolvedCount = REPORTS.filter((r) => r.status === "resolved").length;
 const dismissedCount = REPORTS.filter((r) => r.status === "dismissed").length;

 return (
 <div className="space-y-6">
 <div>
 <h2 className="text-2xl font-bold text-foreground">Report Management</h2>
 <p className="text-sm text-muted-foreground">Review and handle user-submitted reports.</p>
 </div>

 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
 <Card>
 <CardContent className="p-4">
 <div className="flex items-center gap-3">
 <div className="flex h-10 w-10 items-center justify-center rounded-lg text-red-600 bg-red-100">
 <Flag className="h-5 w-5" />
 </div>
 <div>
 <p className="text-xs text-muted-foreground">Total Reports</p>
 <p className="text-2xl font-bold text-foreground">{REPORTS.length}</p>
 </div>
 </div>
 </CardContent>
 </Card>
 <Card>
 <CardContent className="p-4">
 <div className="flex items-center gap-3">
 <div className="flex h-10 w-10 items-center justify-center rounded-lg text-amber-600 bg-amber-100">
 <AlertTriangle className="h-5 w-5" />
 </div>
 <div>
 <p className="text-xs text-muted-foreground">Pending</p>
 <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
 </div>
 </div>
 </CardContent>
 </Card>
 <Card>
 <CardContent className="p-4">
 <div className="flex items-center gap-3">
 <div className="flex h-10 w-10 items-center justify-center rounded-lg text-green-600 bg-green-100">
 <CheckCircle className="h-5 w-5" />
 </div>
 <div>
 <p className="text-xs text-muted-foreground">Resolved</p>
 <p className="text-2xl font-bold text-foreground">{resolvedCount}</p>
 </div>
 </div>
 </CardContent>
 </Card>
 <Card>
 <CardContent className="p-4">
 <div className="flex items-center gap-3">
 <div className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 bg-gray-100">
 <XCircle className="h-5 w-5" />
 </div>
 <div>
 <p className="text-xs text-muted-foreground">Dismissed</p>
 <p className="text-2xl font-bold text-foreground">{dismissedCount}</p>
 </div>
 </div>
 </CardContent>
 </Card>
 </div>

 <Tabs value={activeTab} onValueChange={setActiveTab}>
 <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
 <TabsList variant="line">
 <TabsTrigger value="all">All ({REPORTS.length})</TabsTrigger>
 <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
 <TabsTrigger value="reviewing">Reviewing ({reviewingCount})</TabsTrigger>
 <TabsTrigger value="resolved">Resolved ({resolvedCount})</TabsTrigger>
 <TabsTrigger value="dismissed">Dismissed ({dismissedCount})</TabsTrigger>
 </TabsList>
 <div className="relative">
 <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
 <Input
 placeholder="Search reports..."
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
 <TableHead>Reporter</TableHead>
 <TableHead>Type</TableHead>
 <TableHead>Target</TableHead>
 <TableHead>Reason</TableHead>
 <TableHead>Status</TableHead>
 <TableHead>Date</TableHead>
 <TableHead className="text-right">Actions</TableHead>
 </TableRow>
 </TableHeader>
 <TableBody>
 {filtered.map((report) => (
 <TableRow key={report.id}>
 <TableCell>
 <div className="flex items-center gap-2">
 <Avatar size="sm">
 <AvatarImage src={report.reporter.avatar || undefined} alt={report.reporter.name} />
 <AvatarFallback>{report.reporter.name[0]}</AvatarFallback>
 </Avatar>
 <span className="text-sm font-medium">{report.reporter.name}</span>
 </div>
 </TableCell>
 <TableCell>
 <Badge className={cn("capitalize", TYPE_STYLES[report.type])}>
 {report.type}
 </Badge>
 </TableCell>
 <TableCell className="text-muted-foreground max-w-[180px] truncate">
 {report.target}
 </TableCell>
 <TableCell className="text-muted-foreground max-w-[200px] truncate">
 {report.reason}
 </TableCell>
 <TableCell>
 <Badge className={cn("capitalize", STATUS_STYLES[report.status])}>
 {report.status}
 </Badge>
 </TableCell>
 <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
 {new Date(report.date).toLocaleDateString()}
 </TableCell>
 <TableCell className="text-right">
 <div className="flex items-center justify-end gap-1">
 <Button
 variant="ghost"
 size="icon-sm"
 onClick={() => handleDetail(report)}
 >
 <Eye className="h-4 w-4" />
 </Button>
 {(report.status === "pending" || report.status === "reviewing") && (
 <>
 <Button
 variant="ghost"
 size="icon-sm"
 onClick={() => handleAlert("dismiss")}
 >
 <XCircle className="h-4 w-4 text-muted-foreground" />
 </Button>
 <Button
 variant="ghost"
 size="icon-sm"
 onClick={() => handleAlert("remove")}
 >
 <Trash2 className="h-4 w-4 text-red-500" />
 </Button>
 <Button
 variant="ghost"
 size="icon-sm"
 onClick={() => handleAlert("ban")}
 >
 <Ban className="h-4 w-4 text-red-600" />
 </Button>
 </>
 )}
 </div>
 </TableCell>
 </TableRow>
 ))}
 {filtered.length === 0 && (
 <TableRow>
 <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
 No reports found.
 </TableCell>
 </TableRow>
 )}
 </TableBody>
 </Table>
 </CardContent>
 </Card>
 </Tabs>

 <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
 <DialogContent className="sm:max-w-md">
 <DialogHeader>
 <DialogTitle>Report Details</DialogTitle>
 <DialogDescription>Review the full report information.</DialogDescription>
 </DialogHeader>
 {selectedReport && (
 <div className="space-y-4">
 <div className="flex items-center gap-3">
 <Avatar size="sm">
 <AvatarImage src={selectedReport.reporter.avatar || undefined} alt={selectedReport.reporter.name} />
 <AvatarFallback>{selectedReport.reporter.name[0]}</AvatarFallback>
 </Avatar>
 <div>
 <p className="text-sm font-medium">{selectedReport.reporter.name}</p>
 <p className="text-xs text-muted-foreground">
 Reported on {new Date(selectedReport.date).toLocaleDateString()}
 </p>
 </div>
 </div>
 <div className="space-y-2">
 <div className="flex items-center gap-2">
 <Badge className={cn("capitalize", TYPE_STYLES[selectedReport.type])}>
 {selectedReport.type}
 </Badge>
 <Badge className={cn("capitalize", STATUS_STYLES[selectedReport.status])}>
 {selectedReport.status}
 </Badge>
 </div>
 </div>
 <div className="space-y-1">
 <p className="text-xs font-medium text-muted-foreground">Target</p>
 <p className="text-sm">{selectedReport.target}</p>
 </div>
 <div className="space-y-1">
 <p className="text-xs font-medium text-muted-foreground">Reason</p>
 <p className="text-sm">{selectedReport.reason}</p>
 </div>
 <div className="space-y-1">
 <p className="text-xs font-medium text-muted-foreground">Report ID</p>
 <p className="font-mono text-xs text-muted-foreground">{selectedReport.id}</p>
 </div>
 </div>
 )}
 <DialogFooter>
 {selectedReport && (selectedReport.status === "pending" || selectedReport.status === "reviewing") && (
 <>
 <Button variant="outline" onClick={() => handleAlert("dismiss")}>
 Dismiss
 </Button>
 <Button
 variant="destructive"
 onClick={() => handleAlert("remove")}
 >
 <Trash2 className="h-4 w-4" />
 Remove Content
 </Button>
 <Button
 className="bg-red-600 text-white hover:bg-red-700"
 onClick={() => handleAlert("ban")}
 >
 <Ban className="h-4 w-4" />
 Ban User
 </Button>
 </>
 )}
 </DialogFooter>
 </DialogContent>
 </Dialog>

 <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
 <AlertDialogContent>
 <AlertDialogHeader>
 <AlertDialogTitle>
 {alertType === "dismiss" && "Dismiss Report"}
 {alertType === "remove" && "Remove Content"}
 {alertType === "ban" && "Ban User"}
 </AlertDialogTitle>
 <AlertDialogDescription>
 {alertType === "dismiss" && "Are you sure you want to dismiss this report? It will be marked as dismissed and no further action will be taken."}
 {alertType === "remove" && "Are you sure you want to remove the reported content? This action cannot be undone."}
 {alertType === "ban" && "Are you sure you want to ban the user who created this content? They will no longer be able to access the platform."}
 </AlertDialogDescription>
 </AlertDialogHeader>
 <AlertDialogFooter>
 <AlertDialogCancel>Cancel</AlertDialogCancel>
 <AlertDialogAction
 onClick={confirmAlert}
 className={cn(
 alertType === "dismiss" && "bg-gray-600 text-white hover:bg-gray-700",
 alertType === "remove" && "bg-destructive text-destructive-foreground hover:bg-destructive/90",
 alertType === "ban" && "bg-red-600 text-white hover:bg-red-700"
 )}
 >
 {alertType === "dismiss" && "Dismiss"}
 {alertType === "remove" && "Remove"}
 {alertType === "ban" && "Ban User"}
 </AlertDialogAction>
 </AlertDialogFooter>
 </AlertDialogContent>
 </AlertDialog>
 </div>
 );
}
