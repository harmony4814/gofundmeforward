"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Search, MoreHorizontal, Check, X, Trash2, Ban, Pencil,
  Save, Plus, Eye, Upload, Image as ImageIcon, Share2,
} from "lucide-react";
import { cn, slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCampaignStore } from "@/store/campaign-store";
import { useAuthStore } from "@/store/auth-store";
import { categories, mockCampaigns } from "@/lib/data";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";

const STATUS_STYLES: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  completed: "bg-blue-100 text-blue-700",
  rejected: "bg-red-100 text-red-700",
  suspended: "bg-gray-100 text-gray-700",
};

const countries = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany",
  "France", "Japan", "India", "Brazil", "Nigeria", "Kenya", "South Africa",
];

export default function AdminCampaignsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const userCampaigns = useCampaignStore((s) => s.userCampaigns);
  const addUserCampaign = useCampaignStore((s) => s.addUserCampaign);
  const updateUserCampaign = useCampaignStore((s) => s.updateUserCampaign);
  const deleteUserCampaign = useCampaignStore((s) => s.deleteUserCampaign);
  const user = useAuthStore((s) => s.user);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRaised, setEditRaised] = useState("");
  const [editDonors, setEditDonors] = useState("");

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createdSlug, setCreatedSlug] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newFullStory, setNewFullStory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newCountry, setNewCountry] = useState("United States");
  const [newGoal, setNewGoal] = useState("1000");
  const [newDeadline, setNewDeadline] = useState(
    new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleCoverUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCoverImagePreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleGalleryUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const remaining = 10 - galleryPreviews.length;
    const toProcess = Array.from(files)
      .slice(0, remaining)
      .filter((f) => f.type.startsWith("image/") && f.size <= 5 * 1024 * 1024);
    toProcess.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setGalleryPreviews((prev) => [...prev, ev.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  }, [galleryPreviews.length]);

  const removeCoverImage = useCallback(() => {
    setCoverImagePreview(null);
    if (coverInputRef.current) coverInputRef.current.value = "";
  }, []);

  const removeGalleryImage = useCallback((index: number) => {
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const allCampaigns = [
    ...mockCampaigns.map((c) => ({
      ...c,
      organizer: c.creatorName,
      donorCount: c.donorCount,
    })),
    ...userCampaigns.map((c) => ({
      ...c,
      organizer: c.creatorName,
      donorCount: c.donorCount,
    })),
  ];

  const filtered = allCampaigns.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.organizer.toLowerCase().includes(search.toLowerCase());
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && c.status === activeTab;
  });

  const handleCreateCampaign = () => {
    if (!newTitle || !newCategory || !newGoal) return;
    const goal = Math.max(100, parseInt(newGoal, 10) || 1000);
    const slug = slugify(newTitle) + "-" + Date.now().toString(36);
    const cat = categories.find((c) => c.slug === newCategory);

    addUserCampaign({
      id: `admin-${Date.now()}`,
      slug,
      title: newTitle,
      shortDescription: newDescription || "Campaign created by admin",
      fullStory: newFullStory || newDescription || "Campaign created by admin",
      goal,
      raised: 0,
      currency: "USD",
      category: cat?.name || newCategory,
      categorySlug: newCategory,
      country: newCountry,
      beneficiaryName: user?.name || "Admin",
      coverImage: coverImagePreview || "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=80",
      galleryImages: galleryPreviews,
      videoUrl: newVideoUrl || null,
      deadline: newDeadline || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: "active",
      tags: [],
      donorCount: 0,
      viewCount: 0,
      shareCount: 0,
      featured: false,
      trending: false,
      creatorName: user?.name || "Admin",
      creatorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
      createdAt: new Date().toISOString(),
    });

    setNewTitle("");
    setNewDescription("");
    setNewFullStory("");
    setNewCategory("");
    setNewCountry("United States");
    setNewGoal("1000");
    setNewDeadline(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
    setNewVideoUrl("");
    setCoverImagePreview(null);
    setGalleryPreviews([]);
    setShowCreateForm(false);
    setCreatedSlug(slug);
  };

  const startEditing = (campaign: { id: string; raised: number; donorCount: number }) => {
    setEditingId(campaign.id);
    setEditRaised(String(campaign.raised));
    setEditDonors(String(campaign.donorCount));
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditRaised("");
    setEditDonors("");
  };

  const saveEditing = (id: string) => {
    const raised = Math.max(0, parseInt(editRaised, 10) || 0);
    const donors = Math.max(0, parseInt(editDonors, 10) || 0);
    const userCampaign = userCampaigns.find((c) => c.id === id);
    if (userCampaign) {
      updateUserCampaign(id, { raised, donorCount: donors });
    }
    setEditingId(null);
  };

  const handleApprove = (id: string) => {
    const userCampaign = userCampaigns.find((c) => c.id === id);
    if (userCampaign) {
      updateUserCampaign(id, { status: "active" });
    }
  };

  const handleReject = (id: string) => {
    const userCampaign = userCampaigns.find((c) => c.id === id);
    if (userCampaign) {
      updateUserCampaign(id, { status: "rejected" });
    }
  };

  const handleSuspend = (id: string) => {
    const userCampaign = userCampaigns.find((c) => c.id === id);
    if (userCampaign) {
      updateUserCampaign(id, { status: "suspended" });
    }
  };

  const handleDelete = (id: string) => {
    deleteUserCampaign(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Campaign Management</h2>
          <p className="text-sm text-muted-foreground">
            Review and manage all campaigns on the platform.
          </p>
        </div>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          {showCreateForm ? "Cancel" : "Create Campaign"}
        </Button>
      </div>

      {createdSlug && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <Check className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-green-900">Campaign created successfully!</p>
                <p className="text-sm text-green-700">
                  Your campaign is now live and visible on the website.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/campaigns/${createdSlug}`}>
                <Button variant="outline" size="sm" className="border-green-300 text-green-700 hover:bg-green-100">
                  <Eye className="mr-1 h-4 w-4" />
                  View Campaign
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="border-green-300 text-green-700 hover:bg-green-100"
                onClick={() => {
                  const url = `${window.location.origin}/campaigns/${createdSlug}`;
                  if (navigator.share) {
                    navigator.share({ title: "Check out this campaign", url });
                  } else {
                    navigator.clipboard.writeText(url);
                    alert("Link copied to clipboard!");
                  }
                }}
              >
                <Share2 className="mr-1 h-4 w-4" />
                Share
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCreatedSlug(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Campaign</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="newTitle">Campaign Title *</Label>
              <Input
                id="newTitle"
                placeholder="e.g., Help Build a School"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newDescription">Short Description *</Label>
              <Textarea
                id="newDescription"
                placeholder="Brief description shown in campaign cards and search results..."
                rows={2}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newFullStory">Full Story *</Label>
              <Textarea
                id="newFullStory"
                placeholder="Tell potential donors everything they need to know..."
                rows={5}
                className="min-h-[120px]"
                value={newFullStory}
                onChange={(e) => setNewFullStory(e.target.value)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select
                  value={newCategory}
                  onValueChange={(v) => setNewCategory(v ?? "")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.slug} value={cat.slug}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Country *</Label>
                <Select
                  value={newCountry}
                  onValueChange={(v) => setNewCountry(v ?? "United States")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="newGoal">Fundraising Goal *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    $
                  </span>
                  <Input
                    id="newGoal"
                    type="number"
                    min={100}
                    className="pl-8"
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newDeadline">Deadline</Label>
                <Input
                  id="newDeadline"
                  type="date"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newVideoUrl">Video URL (optional)</Label>
              <Input
                id="newVideoUrl"
                placeholder="https://youtube.com/watch?v=..."
                value={newVideoUrl}
                onChange={(e) => setNewVideoUrl(e.target.value)}
              />
              <p className="text-xs text-gray-500">YouTube or Vimeo URL.</p>
            </div>

            <div className="space-y-2">
              <Label>Cover Image</Label>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleCoverUpload}
              />
              {coverImagePreview ? (
                <div className="relative overflow-hidden rounded-xl border">
                  <img
                    src={coverImagePreview}
                    alt="Cover preview"
                    className="h-48 w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeCoverImage}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-xs text-white">
                    <Check className="h-3 w-3" />
                    Cover image ready
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  className="flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors hover:border-[#22c55e] hover:bg-[#22c55e]/5"
                >
                  <Upload className="h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm font-medium">
                    Click to upload cover image
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, WEBP up to 5MB
                  </p>
                </button>
              )}
            </div>

            <div className="space-y-2">
              <Label>
                Gallery Images
                <span className="ml-1 text-gray-400 font-normal">
                  ({galleryPreviews.length}/10)
                </span>
              </Label>
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                multiple
                className="hidden"
                onChange={handleGalleryUpload}
              />
              {galleryPreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {galleryPreviews.map((preview, i) => (
                    <div
                      key={i}
                      className="relative aspect-square overflow-hidden rounded-lg border"
                    >
                      <img
                        src={preview}
                        alt={`Gallery ${i + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(i)}
                        className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {galleryPreviews.length < 10 && (
                    <button
                      type="button"
                      onClick={() => galleryInputRef.current?.click()}
                      className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors hover:border-[#22c55e] hover:bg-[#22c55e]/5"
                    >
                      <ImageIcon className="h-6 w-6 text-gray-400" />
                      <span className="mt-1 text-[10px] text-gray-500">
                        Add more
                      </span>
                    </button>
                  )}
                </div>
              )}
              {galleryPreviews.length === 0 && (
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors hover:border-[#22c55e] hover:bg-[#22c55e]/5"
                >
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm font-medium">
                    Add additional images
                  </p>
                  <p className="text-xs text-gray-500">Up to 10 images</p>
                </button>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateForm(false);
                  setCoverImagePreview(null);
                  setGalleryPreviews([]);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateCampaign}
                disabled={!newTitle || !newCategory}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Check className="h-4 w-4" />
                Create & Publish
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList variant="line">
            <TabsTrigger value="all">
              All ({allCampaigns.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending (
              {allCampaigns.filter((c) => c.status === "pending").length})
            </TabsTrigger>
            <TabsTrigger value="active">
              Active (
              {allCampaigns.filter((c) => c.status === "active").length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed (
              {allCampaigns.filter((c) => c.status === "completed").length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected (
              {allCampaigns.filter((c) => c.status === "rejected").length})
            </TabsTrigger>
          </TabsList>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search campaigns..."
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
                  <TableHead>Title</TableHead>
                  <TableHead>Organizer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Goal</TableHead>
                  <TableHead>Raised</TableHead>
                  <TableHead>Donors</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((campaign) => {
                  const isEditing = editingId === campaign.id;
                  const isUserCampaign = userCampaigns.some(
                    (c) => c.id === campaign.id
                  );
                  return (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium max-w-[250px] truncate">
                        {campaign.title}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {campaign.organizer}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "capitalize",
                            STATUS_STYLES[campaign.status]
                          )}
                        >
                          {campaign.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        ${campaign.goal.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Input
                            type="number"
                            value={editRaised}
                            onChange={(e) => setEditRaised(e.target.value)}
                            className="h-8 w-28 text-sm"
                            min={0}
                          />
                        ) : (
                          <span className="font-semibold">
                            ${campaign.raised.toLocaleString()}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Input
                            type="number"
                            value={editDonors}
                            onChange={(e) => setEditDonors(e.target.value)}
                            className="h-8 w-20 text-sm"
                            min={0}
                          />
                        ) : (
                          <span>{campaign.donorCount}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(campaign.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => saveEditing(campaign.id)}
                            >
                              <Save className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={cancelEditing}
                            >
                              <X className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              render={<Button variant="ghost" size="icon-sm" />}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {campaign.status === "pending" &&
                                isUserCampaign && (
                                  <>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleApprove(campaign.id)
                                      }
                                    >
                                      <Check className="h-4 w-4 text-green-600" />
                                      Approve
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleReject(campaign.id)
                                      }
                                    >
                                      <X className="h-4 w-4 text-red-600" />
                                      Reject
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                  </>
                                )}
                              {isUserCampaign && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() => startEditing(campaign)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                    Edit Raised & Donors
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleSuspend(campaign.id)
                                    }
                                  >
                                    <Ban className="h-4 w-4" />
                                    Suspend
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    variant="destructive"
                                    onClick={() =>
                                      handleDelete(campaign.id)
                                    }
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </>
                              )}
                              {!isUserCampaign && (
                                <DropdownMenuItem disabled>
                                  <Eye className="h-4 w-4" />
                                  Demo Campaign
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}
