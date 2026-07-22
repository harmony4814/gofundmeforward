"use client";

import { useState, useEffect, useRef } from "react";
import { Save, Upload, Eye, EyeOff, Send, CheckCircle, Loader2, Copy, Check, QrCode, Wallet, DollarSign } from "lucide-react";
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
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

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

  const [siteName, setSiteName] = useState("FundForward");
  const [siteDescription, setSiteDescription] = useState(
    "A crowdfunding platform connecting donors with causes that matter."
  );
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const [smtpHost, setSmtpHost] = useState("smtp.gmail.com");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpUsername, setSmtpUsername] = useState("noreply@fundforward.com");
  const [smtpPassword, setSmtpPassword] = useState("********");
  const [fromEmail, setFromEmail] = useState("noreply@fundforward.com");
  const [showSmtpPassword, setShowSmtpPassword] = useState(false);
  const [templates, setTemplates] = useState(EMAIL_TEMPLATES);

  const [rateLimit, setRateLimit] = useState("100");
  const [maxLoginAttempts, setMaxLoginAttempts] = useState("5");
  const [spamDetection, setSpamDetection] = useState(true);
  const [csrfProtection, setCsrfProtection] = useState(true);
  const [emailVerification, setEmailVerification] = useState(true);

  // Payment settings from Supabase
  const [bitcoinWallet, setBitcoinWallet] = useState("");
  const [cashappCashtag, setCashappCashtag] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [qrCodePreview, setQrCodePreview] = useState("");
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [paymentsSaving, setPaymentsSaving] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const qrInputRef = useRef<HTMLInputElement>(null);

  const toggleTemplate = (id: string) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t))
    );
  };

  // Load payment settings from Supabase
  useEffect(() => {
    async function loadPaymentSettings() {
      const supabase = createClient();
      const { data } = await supabase
        .from("payment_settings")
        .select("key, value");

      if (data) {
        for (const row of data) {
          if (row.key === "bitcoin_wallet") setBitcoinWallet(row.value || "");
          if (row.key === "cashapp_cashtag") setCashappCashtag(row.value || "");
          if (row.key === "payment_qr_code") {
            setQrCodeUrl(row.value || "");
            setQrCodePreview(row.value || "");
          }
        }
      }
      setPaymentsLoading(false);
    }
    loadPaymentSettings();
  }, []);

  const handleSavePayments = async () => {
    setPaymentsSaving(true);
    const supabase = createClient();

    const updates = [
      { key: "bitcoin_wallet", value: bitcoinWallet },
      { key: "cashapp_cashtag", value: cashappCashtag },
      { key: "payment_qr_code", value: qrCodeUrl },
    ];

    for (const update of updates) {
      await supabase
        .from("payment_settings")
        .upsert(update, { onConflict: "key" });
    }

    setPaymentsSaving(false);
    toast.success("Payment settings saved!");
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
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
          <TabsTrigger value="payments">Payment Methods</TabsTrigger>
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
            {paymentsLoading ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </CardContent>
              </Card>
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wallet className="h-5 w-5 text-[#f7931a]" />
                      Bitcoin Payment
                    </CardTitle>
                    <CardDescription>
                      Donors will see your Bitcoin wallet address and QR code when they select Bitcoin.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="btc-wallet">Bitcoin Wallet Address</Label>
                      <div className="flex gap-2">
                        <Input
                          id="btc-wallet"
                          placeholder="bc1q... or 1A1zP1..."
                          value={bitcoinWallet}
                          onChange={(e) => setBitcoinWallet(e.target.value)}
                          className="font-mono"
                        />
                        {bitcoinWallet && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleCopy(bitcoinWallet, "btc")}
                          >
                            {copiedField === "btc" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-[#00d632]" />
                      Cash App Payment
                    </CardTitle>
                    <CardDescription>
                      Donors will see your Cash App cashtag when they select Cash App.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cashtag">Cash App Cashtag</Label>
                      <div className="flex gap-2 max-w-md">
                        <div className="flex items-center rounded-lg border bg-muted px-3 text-sm text-muted-foreground">
                          $
                        </div>
                        <Input
                          id="cashtag"
                          placeholder="YourCashtag"
                          value={cashappCashtag}
                          onChange={(e) => setCashappCashtag(e.target.value)}
                          className="font-mono"
                        />
                        {cashappCashtag && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleCopy(`$${cashappCashtag}`, "cashtag")}
                          >
                            {copiedField === "cashtag" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <QrCode className="h-5 w-5 text-purple-500" />
                      Payment QR Code
                    </CardTitle>
                    <CardDescription>
                      Upload a QR code image (Bitcoin or Cash App). This will be shown to donors above the wallet/cashtag details.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-6">
                      <div className="space-y-3">
                        <Input
                          ref={qrInputRef}
                          type="url"
                          placeholder="Paste image URL (e.g. https://...)"
                          value={qrCodeUrl}
                          onChange={(e) => {
                            setQrCodeUrl(e.target.value);
                            setQrCodePreview(e.target.value);
                          }}
                          className="max-w-md"
                        />
                        <p className="text-xs text-muted-foreground">
                          Paste a URL to your QR code image (from any image hosting service).
                        </p>
                      </div>
                      <div className="shrink-0">
                        {qrCodePreview ? (
                          <div className="relative h-32 w-32 overflow-hidden rounded-lg border bg-white p-2">
                            <img
                              src={qrCodePreview}
                              alt="QR Code Preview"
                              className="h-full w-full object-contain"
                              onError={() => setQrCodePreview("")}
                            />
                          </div>
                        ) : (
                          <div className="flex h-32 w-32 items-center justify-center rounded-lg border border-dashed bg-muted/50">
                            <div className="text-center">
                              <QrCode className="mx-auto h-8 w-8 text-muted-foreground/40" />
                              <p className="mt-1 text-xs text-muted-foreground">No QR</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button onClick={handleSavePayments} disabled={paymentsSaving}>
                    {paymentsSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save Payment Settings
                  </Button>
                </div>
              </>
            )}
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
