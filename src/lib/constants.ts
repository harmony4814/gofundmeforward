export const CATEGORIES = [
  { id: "1", name: "Medical", slug: "medical", icon: "HeartPulse" },
  { id: "2", name: "Education", slug: "education", icon: "GraduationCap" },
  { id: "3", name: "Emergency", slug: "emergency", icon: "Siren" },
  { id: "4", name: "Family", slug: "family", icon: "Users" },
  { id: "5", name: "Charity", slug: "charity", icon: "HandHeart" },
  { id: "6", name: "Community", slug: "community", icon: "Building2" },
  { id: "7", name: "Environment", slug: "environment", icon: "TreePine" },
  { id: "8", name: "Animals", slug: "animals", icon: "PawPrint" },
  { id: "9", name: "Sports", slug: "sports", icon: "Trophy" },
  { id: "10", name: "Creative", slug: "creative", icon: "Palette" },
  { id: "11", name: "Business", slug: "business", icon: "Briefcase" },
  { id: "12", name: "Travel", slug: "travel", icon: "Plane" },
] as const;

export const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "CAD", symbol: "CA$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
  { code: "KES", symbol: "KSh", name: "Kenyan Shilling" },
  { code: "GHS", symbol: "GH₵", name: "Ghanaian Cedi" },
  { code: "ZAR", symbol: "R", name: "South African Rand" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
] as const;

export const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Nigeria",
  "Kenya",
  "Ghana",
  "South Africa",
  "India",
  "Germany",
  "France",
  "Japan",
  "Brazil",
  "Mexico",
  "Other",
] as const;

export const PAYMENT_METHODS = [
  { id: "stripe", name: "Credit/Debit Card", icon: "CreditCard" },
  { id: "paypal", name: "PayPal", icon: "Wallet" },
  { id: "flutterwave", name: "Flutterwave", icon: "Globe" },
  { id: "paystack", name: "Paystack", icon: "Globe" },
  { id: "bank_transfer", name: "Bank Transfer", icon: "Building" },
  { id: "crypto", name: "Cryptocurrency", icon: "Bitcoin" },
] as const;

export const CAMPAIGN_STATUSES = [
  { value: "draft", label: "Draft", color: "gray" },
  { value: "pending", label: "Pending Review", color: "yellow" },
  { value: "active", label: "Active", color: "green" },
  { value: "completed", label: "Completed", color: "blue" },
  { value: "rejected", label: "Rejected", color: "red" },
  { value: "suspended", label: "Suspended", color: "orange" },
] as const;

export const DONATION_AMOUNTS = [
  { value: 10, label: "$10" },
  { value: 25, label: "$25" },
  { value: 50, label: "$50" },
  { value: 100, label: "$100" },
  { value: 250, label: "$250" },
  { value: 500, label: "$500" },
] as const;

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "most_funded", label: "Most Funded" },
  { value: "ending_soon", label: "Ending Soon" },
  { value: "most_popular", label: "Most Popular" },
] as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/campaigns", label: "Explore" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
] as const;

export const FOOTER_LINKS = {
  platform: [
    { href: "/how-it-works", label: "How It Works" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About Us" },
    { href: "/careers", label: "Careers" },
  ],
  resources: [
    { href: "/blog", label: "Blog" },
    { href: "/help", label: "Help Center" },
    { href: "/guidelines", label: "Guidelines" },
    { href: "/api", label: "API" },
  ],
  legal: [
    { href: "/terms", label: "Terms of Service" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/cookies", label: "Cookie Policy" },
  ],
} as const;
