"use client";

import { useState } from "react";
import { Search, MoreHorizontal, Eye, Shield, Ban, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
 Table,
 TableBody,
 TableCell,
 TableHead,
 TableHeader,
 TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuSeparator,
 DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const USERS = [
 { id: "1", name: "John Doe", email: "john@example.com", role: "user", campaigns: 3, donations: 12, joined: "2025-01-15", status: "active", avatar: "/avatars/john.jpg" },
 { id: "2", name: "Sarah Wilson", email: "sarah@example.com", role: "user", campaigns: 1, donations: 24, joined: "2025-02-20", status: "active", avatar: "/avatars/sarah.jpg" },
 { id: "3", name: "Mike Johnson", email: "mike@example.com", role: "user", campaigns: 2, donations: 8, joined: "2025-03-10", status: "active", avatar: "/avatars/mike.jpg" },
 { id: "4", name: "Alice Brown", email: "alice@example.com", role: "user", campaigns: 1, donations: 5, joined: "2025-04-05", status: "active", avatar: "/avatars/alice.jpg" },
 { id: "5", name: "Admin User", email: "admin@fundrise.com", role: "admin", campaigns: 0, donations: 0, joined: "2024-12-01", status: "active", avatar: "/avatars/admin.jpg" },
 { id: "6", name: "Spammer Account", email: "spam@bad.com", role: "user", campaigns: 0, donations: 0, joined: "2025-07-10", status: "suspended", avatar: null },
 { id: "7", name: "Emily Chen", email: "emily@example.com", role: "user", campaigns: 1, donations: 15, joined: "2025-05-22", status: "active", avatar: "/avatars/emily.jpg" },
];

const STATUS_STYLES: Record<string, string> = {
 active: "bg-[#CDF88D] text-[#CDF88D]",
 suspended: "bg-red-100 text-red-700",
};

const ROLE_STYLES: Record<string, string> = {
 admin: "bg-primary/10 text-primary",
 user: "bg-secondary text-secondary-foreground",
};

export default function AdminUsersPage() {
 const [search, setSearch] = useState("");

 const filtered = USERS.filter(
 (u) =>
 u.name.toLowerCase().includes(search.toLowerCase()) ||
 u.email.toLowerCase().includes(search.toLowerCase())
 );

 return (
 <div className="space-y-6">
 <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
 <div>
 <h2 className="text-2xl font-bold text-foreground">User Management</h2>
 <p className="text-sm text-muted-foreground">Manage platform users and their roles.</p>
 </div>
 <div className="relative">
 <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
 <Input
 placeholder="Search users..."
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 className="h-8 w-64 pl-8"
 />
 </div>
 </div>

 <div className="grid gap-4 sm:grid-cols-3">
 <Card>
 <CardContent className="p-4">
 <p className="text-xs text-muted-foreground">Total Users</p>
 <p className="text-2xl font-bold text-foreground">{USERS.length}</p>
 </CardContent>
 </Card>
 <Card>
 <CardContent className="p-4">
 <p className="text-xs text-muted-foreground">Active Users</p>
 <p className="text-2xl font-bold text-foreground">{USERS.filter((u) => u.status === "active").length}</p>
 </CardContent>
 </Card>
 <Card>
 <CardContent className="p-4">
 <p className="text-xs text-muted-foreground">Suspended</p>
 <p className="text-2xl font-bold text-foreground">{USERS.filter((u) => u.status === "suspended").length}</p>
 </CardContent>
 </Card>
 </div>

 <Card>
 <CardContent className="p-0">
 <Table>
 <TableHeader>
 <TableRow>
 <TableHead>User</TableHead>
 <TableHead>Role</TableHead>
 <TableHead>Campaigns</TableHead>
 <TableHead>Donations</TableHead>
 <TableHead>Joined</TableHead>
 <TableHead>Status</TableHead>
 <TableHead className="text-right">Actions</TableHead>
 </TableRow>
 </TableHeader>
 <TableBody>
 {filtered.map((user) => (
 <TableRow key={user.id}>
 <TableCell>
 <div className="flex items-center gap-2">
 <Avatar size="sm">
 <AvatarImage src={user.avatar || undefined} alt={user.name} />
 <AvatarFallback>{user.name[0]}</AvatarFallback>
 </Avatar>
 <div>
 <p className="text-sm font-medium">{user.name}</p>
 <p className="text-xs text-muted-foreground">{user.email}</p>
 </div>
 </div>
 </TableCell>
 <TableCell>
 <Badge className={cn("capitalize", ROLE_STYLES[user.role])}>
 {user.role}
 </Badge>
 </TableCell>
 <TableCell className="text-muted-foreground">{user.campaigns}</TableCell>
 <TableCell className="text-muted-foreground">{user.donations}</TableCell>
 <TableCell className="text-muted-foreground">
 {new Date(user.joined).toLocaleDateString()}
 </TableCell>
 <TableCell>
 <Badge className={cn("capitalize", STATUS_STYLES[user.status])}>
 {user.status}
 </Badge>
 </TableCell>
 <TableCell className="text-right">
 <DropdownMenu>
 <DropdownMenuTrigger asChild>
 <Button variant="ghost" size="icon-sm">
 <MoreHorizontal className="h-4 w-4" />
 </Button>
 </DropdownMenuTrigger>
 <DropdownMenuContent align="end">
 <DropdownMenuItem>
 <Eye className="h-4 w-4" />
 View Profile
 </DropdownMenuItem>
 <DropdownMenuItem>
 <Shield className="h-4 w-4" />
 Edit Role
 </DropdownMenuItem>
 <DropdownMenuItem>
 <Ban className="h-4 w-4" />
 Suspend
 </DropdownMenuItem>
 <DropdownMenuSeparator />
 <DropdownMenuItem variant="destructive">
 <Trash2 className="h-4 w-4" />
 Delete
 </DropdownMenuItem>
 </DropdownMenuContent>
 </DropdownMenu>
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
