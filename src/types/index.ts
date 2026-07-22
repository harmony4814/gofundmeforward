export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  bio: string | null;
  location: string | null;
  phone: string | null;
  role: "user" | "admin";
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  userId: string;
  displayName: string;
  avatar: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  socialLinks: Record<string, string> | null;
  totalRaised: number;
  totalDonated: number;
  campaignCount: number;
  donationCount: number;
}

export interface Campaign {
  id: string;
  userId: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullStory: string;
  goal: number;
  raised: number;
  currency: string;
  categoryId: string;
  country: string;
  beneficiaryType: string;
  beneficiaryName: string;
  coverImage: string;
  galleryImages: string[];
  videoUrl: string | null;
  deadline: string;
  status: "draft" | "pending" | "active" | "completed" | "rejected" | "suspended";
  tags: string[];
  donorCount: number;
  viewCount: number;
  shareCount: number;
  featured: boolean;
  trending: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  campaignCount: number;
}

export interface Donation {
  id: string;
  campaignId: string;
  userId: string | null;
  amount: number;
  currency: string;
  paymentMethod: "stripe" | "paypal" | "flutterwave" | "paystack" | "bank_transfer" | "crypto";
  paymentStatus: "pending" | "completed" | "failed" | "refunded";
  transactionId: string | null;
  anonymous: boolean;
  message: string | null;
  donorName: string | null;
  donorEmail: string | null;
  createdAt: string;
}

export interface CampaignUpdate {
  id: string;
  campaignId: string;
  userId: string;
  title: string;
  description: string;
  images: string[];
  createdAt: string;
}

export interface Comment {
  id: string;
  campaignId: string;
  userId: string;
  content: string;
  parentId: string | null;
  likes: number;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  link: string | null;
  createdAt: string;
}

export interface Withdrawal {
  id: string;
  userId: string;
  campaignId: string;
  amount: number;
  method: "bank" | "paypal" | "crypto" | "stripe";
  accountDetails: Record<string, string>;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface PaymentTransaction {
  id: string;
  donationId: string;
  campaignId: string;
  amount: number;
  fee: number;
  netAmount: number;
  gateway: string;
  status: string;
  reference: string;
  createdAt: string;
}

export interface Report {
  id: string;
  reporterId: string;
  targetType: "campaign" | "comment";
  targetId: string;
  reason: string;
  description: string;
  status: "pending" | "reviewed" | "resolved";
  createdAt: string;
}

export interface SiteSettings {
  id: string;
  key: string;
  value: string;
  type: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
  active: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  avatar: string | null;
  content: string;
  rating: number;
  active: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  createdAt: string;
}

export interface CampaignWithUser extends Campaign {
  user: Profile;
}

export interface DonationWithCampaign extends Donation {
  campaign: Campaign;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface SearchFilters {
  query: string;
  category: string | null;
  location: string | null;
  goalMin: number | null;
  goalMax: number | null;
  sortBy: "newest" | "oldest" | "most_funded" | "ending_soon" | "most_popular";
  currency: string | null;
  status: string | null;
}
