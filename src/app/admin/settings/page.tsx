"use client";

import { useState } from "react";
import { Save, Upload, Eye, EyeOff, Send, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const PAYMENT_GATEWAYS = [
 { id: "stripe", name: "Stripe", enabled: true, key: "sk_test_****4a2b", connected: true },
 { id: "paypal", name: "PayPal", enabled: true, key: "****8c3d", connected: true },
 { id: "flutterwave", name: "Flutterwave", enabled: false, key: "FLWSECK_****", connected: false },
 { id: "paystack", name: "Paystack", enabled: true, key: "sk_live_****9f1e", connected: true },
 { id: "bank_transfer", name: "Bank Transfer", enabled: true, key: "N/A", connected: true },
 { id: "crypto", name: "Crypto", enabled: false, key: "****wallet", connected: false },
];

const EMAIL_TEMPLATES = [
 { id: "registration", name: "Welcome / Registration", enabled: true },
 { id: "verification", name: "Email Verification", enabled: true },
 { id: "donation_receipt", name: "Donation Receipt", enabled: true },
 { id: "campaign_approved", name: "Campaign Approved", enabled: true },
 { id: "campaign_rejected", name: "Campaign Rejected", enabled: true },
 { id: "withdrawal_approved", name: "Withdrawal Approved", enabled: true },
 { id: "withdrawal_rejected", name: "Withdrawal Rejected", enabled: true },
 { id: "password_reset", name: "Password Reset", enabled: true },
 { id: "campaign_update", name: "Campaign Update to Donors", enabled: false },
 { id: "monthly_report", name: "Monthly Summary Report", enabled: false },
];

export default function AdminSettingsPage() {
 const [activeTab, setActiveTab] = useState("general");

 const [siteName, setSiteName] = useState("FundRise");
 const [siteDescription, setSiteDescription] = useState(
 "A crowdfunding platform connecting donors with causes that matter."
 );
 const [maintenanceMode, setMaintenanceMode] = useState(false);

 const [gateways, setGateways] = useState(PAYMENT_GATEWAYS);

 const [smtpHost, setSmtpHost] = useState("smtp.gmail.com");
 const [smtpPort, setSmtpPort] = useState("587");
 const [smtpUsername, setSmtpUsername] = useState("noreply@fundrise.com");
 const [smtpPassword, setSmtpPassword] = useState("********");
 const [fromEmail, setFromEmail] = useState("noreply@fundrise.com");
 const [showSmtpPassword, setShowSmtpPassword] = useState(false);
 const [templates, setTemplates] = useState(EMAIL_TEMPLATES);

 const [rateLimit, setRateLimit] = useState("100");
 const [maxLoginAttempts, setMaxLoginAttempts] = useState("5");
 const [spamDetection, setSpamDetection] = useState(true);
 const [csrfProtection, setCsrfProtection] = useState(true);
 const [emailVerification, setEmailVerification] = useState(true);

 const toggleGateway = (id: string) => {
 setGateways((prev) =>
 prev.map((g) => (g.id === id ? { ...g, enabled: !g.enabled } : g))
 );
 };

 const toggleTemplate = (id: string) => {
 setTemplates((prev) =>
 prev.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t))
 );
 };

 return (
 <div className="space-y-6">
 <div>
 <h2 className="text-2xl font-bold text-foreground">Site Settings</h2>
 <p className="text-sm text-muted-foreground">Configure your platform settings and preferences.</p>
 </div>

 <Tabs value={activeTab} onValueChange={setActiveTab}>
 <TabsList variant="line">
 <TabsTrigger value="general">General</TabsTrigger>
 <TabsTrigger value="payments">Payments</TabsTrigger>
 <TabsTrigger value="email">Email</TabsTrigger>
 <TabsTrigger value="security">Security</TabsTrigger>
 </TabsList>

 <TabsContent value="general">
 <div className="space-y-6 mt-4">
 <Card>
 <CardHeader>
 <CardTitle>General Settings</CardTitle>
 <CardDescription>Basic site configuration options.</CardDescription>
 </CardHeader>
 <CardContent className="space-y-6">
 <div className="space-y-2">
 <Label htmlFor="site-name">Site Name</Label>
 <Input
 id="site-name"
 value={siteName}
 onChange={(e) => setSiteName(e.target.value)}
 className="max-w-md"
 />
 </div>
 <div className="space-y-2">
 <Label htmlFor="site-description">Description</Label>
 <Textarea
 id="site-description"
 value={siteDescription}
 onChange={(e) => setSiteDescription(e.target.value)}
 className="max-w-lg"
 />
 </div>
 <div className="space-y-2">
 <Label>Logo</Label>
 <div className="flex items-center gap-4">
 <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-dashed border-border bg-muted/50">
 <Upload className="h-6 w-6 text-muted-foreground" />
 </div>
 <div>
 <Button variant="outline" size="sm">
 <Upload className="h-4 w-4" />
 Upload Logo
 </Button>
 <p className="text-xs text-muted-foreground mt-1">PNG, JPG or SVG. Max 2MB.</p>
 </div>
 </div>
 </div>
 <Separator />
 <div className="flex items-center justify-between max-w-md">
 <div className="space-y-0.5">
 <Label>Maintenance Mode</Label>
 <p className="text-xs text-muted-foreground">
 When enabled, only admins can access the site.
 </p>
 </div>
 <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
 </div>
 </CardContent>
 </Card>
 <div className="flex justify-end">
 <Button>
 <Save className="h-4 w-4" />
 Save Changes
 </Button>
 </div>
 </div>
 </TabsContent>

 <TabsContent value="payments">
 <div className="space-y-6 mt-4">
 <div className="grid gap-4 sm:grid-cols-2">
 {gateways.map((gateway) => (
 <Card key={gateway.id}>
 <CardContent className="p-4">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
 <span className="text-sm font-bold text-foreground">{gateway.name[0]}</span>
 </div>
 <div>
 <p className="text-sm font-medium">{gateway.name}</p>
 <p className="font-mono text-xs text-muted-foreground">{gateway.key}</p>
 </div>
 </div>
 <div className="flex items-center gap-3">
 <Badge
 className={cn(
 gateway.connected
 ? "bg-green-100 text-green-700"
 : "bg-gray-100 text-gray-700"
 )}
 >
 {gateway.connected ? "Connected" : "Not Connected"}
 </Badge>
 <Switch
 checked={gateway.enabled}
 onCheckedChange={() => toggleGateway(gateway.id)}
 />
 </div>
 </div>
 </CardContent>
 </Card>
 ))}
 </div>
 <div className="flex justify-end">
 <Button>
 <Save className="h-4 w-4" />
 Save Changes
 </Button>
 </div>
 </div>
 </TabsContent>

 <TabsContent value="email">
 <div className="space-y-6 mt-4">
 <Card>
 <CardHeader>
 <CardTitle>SMTP Configuration</CardTitle>
 <CardDescription>Configure your outgoing email server.</CardDescription>
 </CardHeader>
 <CardContent className="space-y-4">
 <div className="grid gap-4 sm:grid-cols-2">
 <div className="space-y-2">
 <Label htmlFor="smtp-host">SMTP Host</Label>
 <Input
 id="smtp-host"
 value={smtpHost}
 onChange={(e) => setSmtpHost(e.target.value)}
 />
 </div>
 <div className="space-y-2">
 <Label htmlFor="smtp-port">SMTP Port</Label>
 <Input
 id="smtp-port"
 value={smtpPort}
 onChange={(e) => setSmtpPort(e.target.value)}
 />
 </div>
 </div>
 <div className="space-y-2">
 <Label htmlFor="smtp-username">Username</Label>
 <Input
 id="smtp-username"
 value={smtpUsername}
 onChange={(e) => setSmtpUsername(e.target.value)}
 />
 </div>
 <div className="space-y-2">
 <Label htmlFor="smtp-password">Password</Label>
 <div className="relative">
 <Input
 id="smtp-password"
 type={showSmtpPassword ? "text" : "password"}
 value={smtpPassword}
 onChange={(e) => setSmtpPassword(e.target.value)}
 />
 <Button
 variant="ghost"
 size="icon-sm"
 className="absolute right-1 top-1/2 -translate-y-1/2"
 onClick={() => setShowSmtpPassword(!showSmtpPassword)}
 >
 {showSmtpPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
 </Button>
 </div>
 </div>
 <div className="space-y-2">
 <Label htmlFor="from-email">From Email</Label>
 <Input
 id="from-email"
 value={fromEmail}
 onChange={(e) => setFromEmail(e.target.value)}
 className="max-w-md"
 />
 </div>
 <div className="flex items-center gap-2">
 <Button variant="outline" size="sm">
 <Send className="h-4 w-4" />
 Send Test Email
 </Button>
 </div>
 </CardContent>
 </Card>

 <Card>
 <CardHeader>
 <CardTitle>Email Templates</CardTitle>
 <CardDescription>Enable or disable automated email notifications.</CardDescription>
 </CardHeader>
 <CardContent>
 <div className="space-y-3">
 {templates.map((template) => (
 <div
 key={template.id}
 className="flex items-center justify-between rounded-lg border p-3"
 >
 <div className="flex items-center gap-3">
 <CheckCircle
 className={cn(
 "h-4 w-4",
 template.enabled ? "text-green-500" : "text-muted-foreground"
 )}
 />
 <span className="text-sm font-medium">{template.name}</span>
 </div>
 <Switch
 checked={template.enabled}
 onCheckedChange={() => toggleTemplate(template.id)}
 />
 </div>
 ))}
 </div>
 </CardContent>
 </Card>

 <div className="flex justify-end">
 <Button>
 <Save className="h-4 w-4" />
 Save Changes
 </Button>
 </div>
 </div>
 </TabsContent>

 <TabsContent value="security">
 <div className="space-y-6 mt-4">
 <Card>
 <CardHeader>
 <CardTitle>Security Settings</CardTitle>
 <CardDescription>Configure security policies for the platform.</CardDescription>
 </CardHeader>
 <CardContent className="space-y-6">
 <div className="grid gap-4 sm:grid-cols-2">
 <div className="space-y-2">
 <Label htmlFor="rate-limit">Rate Limit (requests/min)</Label>
 <Input
 id="rate-limit"
 type="number"
 value={rateLimit}
 onChange={(e) => setRateLimit(e.target.value)}
 className="max-w-xs"
 />
 </div>
 <div className="space-y-2">
 <Label htmlFor="max-login">Max Login Attempts</Label>
 <Input
 id="max-login"
 type="number"
 value={maxLoginAttempts}
 onChange={(e) => setMaxLoginAttempts(e.target.value)}
 className="max-w-xs"
 />
 </div>
 </div>
 <Separator />
 <div className="space-y-4">
 <div className="flex items-center justify-between max-w-md">
 <div className="space-y-0.5">
 <Label>Spam Detection</Label>
 <p className="text-xs text-muted-foreground">
 Automatically detect and flag spam content.
 </p>
 </div>
 <Switch checked={spamDetection} onCheckedChange={setSpamDetection} />
 </div>
 <div className="flex items-center justify-between max-w-md">
 <div className="space-y-0.5">
 <Label>CSRF Protection</Label>
 <p className="text-xs text-muted-foreground">
 Enable cross-site request forgery protection.
 </p>
 </div>
 <Switch checked={csrfProtection} onCheckedChange={setCsrfProtection} />
 </div>
 <div className="flex items-center justify-between max-w-md">
 <div className="space-y-0.5">
 <Label>Email Verification Required</Label>
 <p className="text-xs text-muted-foreground">
 Users must verify their email before accessing the platform.
 </p>
 </div>
 <Switch checked={emailVerification} onCheckedChange={setEmailVerification} />
 </div>
 </div>
 </CardContent>
 </Card>
 <div className="flex justify-end">
 <Button>
 <Save className="h-4 w-4" />
 Save Changes
 </Button>
 </div>
 </div>
 </TabsContent>
 </Tabs>
 </div>
 );
}
