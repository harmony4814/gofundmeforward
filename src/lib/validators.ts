import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export const registerFormSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerFormSchema>;

export const campaignFormSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be at most 100 characters"),
  shortDescription: z
    .string()
    .min(10, "Short description must be at least 10 characters")
    .max(200, "Short description must be at most 200 characters"),
  fullStory: z
    .string()
    .min(50, "Full story must be at least 50 characters")
    .max(10000, "Full story must be at most 10,000 characters"),
  goal: z
    .number()
    .min(10, "Goal must be at least $10")
    .max(10000000, "Goal must be at most $10,000,000"),
  currency: z.string().min(3, "Please select a currency"),
  categoryId: z.string().min(1, "Please select a category").optional(),
  category: z.string().min(1, "Please select a category").optional(),
  status: z.enum(["pending", "active", "rejected", "suspended", "completed"]).optional(),
  country: z.string().min(1, "Please select a country"),
  beneficiaryType: z.string().min(1, "Please select a beneficiary type"),
  beneficiaryName: z
    .string()
    .min(2, "Beneficiary name must be at least 2 characters"),
  coverImage: z.string().url("Please upload a cover image"),
  galleryImages: z.array(z.string().url()).max(10, "Maximum 10 gallery images"),
  videoUrl: z.string().url().nullable().optional(),
  deadline: z.string().refine((val) => {
    const date = new Date(val);
    const now = new Date();
    return date > now;
  }, "Deadline must be in the future"),
  tags: z.array(z.string()).max(10, "Maximum 10 tags"),
});

export type CampaignFormValues = z.infer<typeof campaignFormSchema>;

export const donationFormSchema = z.object({
  amount: z
    .number()
    .min(1, "Donation amount must be at least $1")
    .max(100000, "Donation amount must be at most $100,000"),
  currency: z.string().min(3),
  paymentMethod: z.enum([
    "stripe",
    "paypal",
    "flutterwave",
    "paystack",
    "bank_transfer",
    "crypto",
  ]),
  anonymous: z.boolean().default(false),
  message: z.string().max(500, "Message must be at most 500 characters").optional(),
  donorName: z.string().min(1, "Name is required").optional(),
  donorEmail: z.string().email("Please enter a valid email").optional(),
});

export type DonationFormValues = z.infer<typeof donationFormSchema>;

export const commentFormSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment must be at most 1,000 characters"),
  parentId: z.string().nullable().optional(),
});

export type CommentFormValues = z.infer<typeof commentFormSchema>;

export const settingsFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  bio: z.string().max(500, "Bio must be at most 500 characters").optional(),
  location: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
  website: z.string().url().optional().or(z.literal("")),
  socialLinks: z
    .object({
      twitter: z.string().optional(),
      facebook: z.string().optional(),
      instagram: z.string().optional(),
      linkedin: z.string().optional(),
    })
    .optional(),
});

export type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export const withdrawalFormSchema = z.object({
  amount: z
    .number()
    .min(10, "Minimum withdrawal is $10")
    .max(100000, "Maximum withdrawal is $100,000"),
  method: z.enum(["bank", "paypal", "crypto", "stripe"]),
  accountDetails: z.record(z.string(), z.string().min(1, "This field is required")),
});

export type WithdrawalFormValues = z.infer<typeof withdrawalFormSchema>;

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be at most 2,000 characters"),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
