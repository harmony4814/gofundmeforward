"use client";

import { useState } from "react";
import { Camera, Save, Trash2, Shield, Bell, User, Lock, Globe, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
 AlertDialog,
 AlertDialogAction,
 AlertDialogCancel,
 AlertDialogContent,
 AlertDialogDescription,
 AlertDialogFooter,
 AlertDialogHeader,
 AlertDialogTitle,
 AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function SettingsPage() {
 const [activeTab, setActiveTab] = useState("profile");

 return (
 <div className="space-y-6">
 <div>
 <h2 className="text-2xl font-bold text-foreground">Settings</h2>
 <p className="text-sm text-muted-foreground">Manage your account settings and preferences.</p>
 </div>

 <Tabs value={activeTab} onValueChange={setActiveTab}>
 <TabsList variant="line">
 <TabsTrigger value="profile">Profile</TabsTrigger>
 <TabsTrigger value="account">Account</TabsTrigger>
 <TabsTrigger value="security">Security</TabsTrigger>
 <TabsTrigger value="notifications">Notifications</TabsTrigger>
 </TabsList>

 <TabsContent value="profile">
 <Card>
 <CardHeader>
 <CardTitle>Profile Information</CardTitle>
 <CardDescription>Update your public profile details.</CardDescription>
 </CardHeader>
 <CardContent className="space-y-6">
 <div className="flex items-center gap-4">
 <Avatar size="lg">
 <AvatarImage src="/avatars/user.jpg" alt="User" />
 <AvatarFallback>JD</AvatarFallback>
 </Avatar>
 <div>
 <Button variant="outline" size="sm">
 <Upload className="h-3.5 w-3.5" />
 Upload Photo
 </Button>
 <p className="mt-1 text-[11px] text-muted-foreground">JPG, PNG or GIF. Max 2MB.</p>
 </div>
 </div>

 <Separator />

 <div className="grid gap-4 sm:grid-cols-2">
 <div className="space-y-2">
 <Label>Display Name</Label>
 <Input defaultValue="John Doe" />
 </div>
 <div className="space-y-2">
 <Label>Website</Label>
 <Input defaultValue="https://johndoe.com" placeholder="https://" />
 </div>
 </div>

 <div className="space-y-2">
 <Label>Bio</Label>
 <Textarea defaultValue="Passionate fundraiser helping communities around the world." className="min-h-[80px]" />
 </div>

 <div className="grid gap-4 sm:grid-cols-2">
 <div className="space-y-2">
 <Label>Location</Label>
 <Input defaultValue="San Francisco, CA" />
 </div>
 </div>

 <Separator />

 <div className="space-y-3">
 <Label>Social Links</Label>
 <div className="grid gap-3 sm:grid-cols-2">
 <div className="flex items-center gap-2">
 <span className="text-sm text-muted-foreground w-20">Twitter</span>
 <Input placeholder="@username" defaultValue="@johndoe" className="flex-1" />
 </div>
 <div className="flex items-center gap-2">
 <span className="text-sm text-muted-foreground w-20">Facebook</span>
 <Input placeholder="Profile URL" className="flex-1" />
 </div>
 <div className="flex items-center gap-2">
 <span className="text-sm text-muted-foreground w-20">Instagram</span>
 <Input placeholder="@username" className="flex-1" />
 </div>
 <div className="flex items-center gap-2">
 <span className="text-sm text-muted-foreground w-20">LinkedIn</span>
 <Input placeholder="Profile URL" className="flex-1" />
 </div>
 </div>
 </div>

 <div className="flex justify-end">
 <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
 <Save className="h-4 w-4" />
 Save Changes
 </Button>
 </div>
 </CardContent>
 </Card>
 </TabsContent>

 <TabsContent value="account">
 <Card>
 <CardHeader>
 <CardTitle>Account Settings</CardTitle>
 <CardDescription>Manage your email, phone, and password.</CardDescription>
 </CardHeader>
 <CardContent className="space-y-6">
 <div className="space-y-2">
 <Label>Email Address</Label>
 <div className="flex items-center gap-2">
 <Input defaultValue="john@example.com" type="email" className="flex-1" />
 <Badge className="bg-green-100 text-green-700">Verified</Badge>
 </div>
 </div>

 <div className="space-y-2">
 <Label>Phone Number</Label>
 <Input defaultValue="+1 (555) 123-4567" type="tel" />
 </div>

 <Separator />

 <div className="space-y-3">
 <Label>Change Password</Label>
 <div className="space-y-3 max-w-sm">
 <div className="space-y-2">
 <Label className="text-muted-foreground text-xs">Current Password</Label>
 <Input type="password" placeholder="Enter current password" />
 </div>
 <div className="space-y-2">
 <Label className="text-muted-foreground text-xs">New Password</Label>
 <Input type="password" placeholder="Enter new password" />
 </div>
 <div className="space-y-2">
 <Label className="text-muted-foreground text-xs">Confirm New Password</Label>
 <Input type="password" placeholder="Confirm new password" />
 </div>
 </div>
 </div>

 <div className="flex justify-end">
 <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
 <Save className="h-4 w-4" />
 Update Account
 </Button>
 </div>
 </CardContent>
 </Card>
 </TabsContent>

 <TabsContent value="security">
 <div className="space-y-6">
 <Card>
 <CardHeader>
 <CardTitle>Two-Factor Authentication</CardTitle>
 <CardDescription>Add an extra layer of security to your account.</CardDescription>
 </CardHeader>
 <CardContent>
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
 <Shield className="h-5 w-5 text-primary" />
 </div>
 <div>
 <p className="text-sm font-medium text-foreground">Authenticator App</p>
 <p className="text-xs text-muted-foreground">Use an authenticator app to generate one-time codes.</p>
 </div>
 </div>
 <Switch />
 </div>
 </CardContent>
 </Card>

 <Card>
 <CardHeader>
 <CardTitle>Active Sessions</CardTitle>
 <CardDescription>Manage your active login sessions.</CardDescription>
 </CardHeader>
 <CardContent className="space-y-3">
 <div className="flex items-center justify-between rounded-lg border p-3">
 <div>
 <p className="text-sm font-medium text-foreground">Chrome on macOS</p>
 <p className="text-xs text-muted-foreground">San Francisco, CA - Active now</p>
 </div>
 <Badge className="bg-green-100 text-green-700">Current</Badge>
 </div>
 <div className="flex items-center justify-between rounded-lg border p-3">
 <div>
 <p className="text-sm font-medium text-foreground">Safari on iPhone</p>
 <p className="text-xs text-muted-foreground">San Francisco, CA - 2 days ago</p>
 </div>
 <Button variant="ghost" size="sm" className="text-destructive">Revoke</Button>
 </div>
 </CardContent>
 </Card>
 </div>
 </TabsContent>

 <TabsContent value="notifications">
 <Card>
 <CardHeader>
 <CardTitle>Notification Preferences</CardTitle>
 <CardDescription>Choose what notifications you receive.</CardDescription>
 </CardHeader>
 <CardContent className="space-y-4">
 {[
 { label: "New donations received", description: "Get notified when someone donates to your campaign", defaultChecked: true },
 { label: "Campaign updates", description: "Notifications about campaign milestones and status changes", defaultChecked: true },
 { label: "Withdrawal updates", description: "Status updates for your withdrawal requests", defaultChecked: true },
 { label: "New messages", description: "Get notified when you receive a new message", defaultChecked: true },
 { label: "Marketing emails", description: "Receive tips, inspiration, and platform updates", defaultChecked: false },
 ].map((pref) => (
 <div key={pref.label} className="flex items-center justify-between rounded-lg border p-3">
 <div>
 <p className="text-sm font-medium text-foreground">{pref.label}</p>
 <p className="text-xs text-muted-foreground">{pref.description}</p>
 </div>
 <Switch defaultChecked={pref.defaultChecked} />
 </div>
 ))}

 <div className="flex justify-end pt-2">
 <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
 <Save className="h-4 w-4" />
 Save Preferences
 </Button>
 </div>
 </CardContent>
 </Card>
 </TabsContent>
 </Tabs>

 <Card className="border-destructive/50">
 <CardHeader>
 <CardTitle className="text-destructive">Danger Zone</CardTitle>
 <CardDescription>Irreversible account actions.</CardDescription>
 </CardHeader>
 <CardContent>
 <AlertDialog>
 <AlertDialogTrigger
 render={
 <Button variant="destructive">
 <Trash2 className="h-4 w-4" />
 Delete Account
 </Button>
 }
 />
 <AlertDialogContent>
 <AlertDialogHeader>
 <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
 <AlertDialogDescription>
 This action cannot be undone. This will permanently delete your account and remove all your data including campaigns and donations.
 </AlertDialogDescription>
 </AlertDialogHeader>
 <AlertDialogFooter>
 <AlertDialogCancel>Cancel</AlertDialogCancel>
 <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
 Delete Account
 </AlertDialogAction>
 </AlertDialogFooter>
 </AlertDialogContent>
 </AlertDialog>
 </CardContent>
 </Card>
 </div>
 );
}
