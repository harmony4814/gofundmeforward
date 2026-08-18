import {
  Heart,
  GraduationCap,
  Zap,
  Dog,
  Building2,
  Globe,
  Plane,
  Trophy,
  CalendarDays,
  Leaf,
  Cpu,
  Church,
  Palette,
  HandHeart,
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react"

export interface CategoryData {
  id: string
  name: string
  slug: string
  icon: LucideIcon
  description: string
  campaignCount: number
}

export interface CampaignData {
  id: string
  slug: string
  title: string
  shortDescription: string
  fullStory: string
  goal: number
  raised: number
  currency: string
  category: string
  categorySlug: string
  country: string
  beneficiaryName: string
  coverImage: string
  galleryImages: string[]
  videoUrl: string | null
  deadline: string
  status: "active" | "completed" | "pending" | "draft" | "rejected" | "suspended"
  tags: string[]
  donorCount: number
  viewCount: number
  shareCount: number
  featured: boolean
  trending: boolean
  creatorName: string
  creatorAvatar: string
  createdAt: string
}

export interface TestimonialData {
  id: string
  name: string
  avatar: string
  role: string
  content: string
  campaignTitle: string
  amountRaised: number
}

export interface FAQData {
  id: string
  question: string
  answer: string
  category: string
}

export const categories: CategoryData[] = [
  { id: "1", name: "Health", slug: "health", icon: Heart, description: "Medical bills, treatments, and health-related causes", campaignCount: 2847 },
  { id: "2", name: "Education", slug: "education", icon: GraduationCap, description: "Scholarships, school supplies, and educational programs", campaignCount: 1923 },
  { id: "3", name: "Emergency", slug: "emergency", icon: Zap, description: "Disaster relief, urgent needs, and crisis support", campaignCount: 1456 },
  { id: "4", name: "Animals", slug: "animals", icon: Dog, description: "Animal rescue, shelter support, and pet medical care", campaignCount: 987 },
  { id: "5", name: "Business", slug: "business", icon: Building2, description: "Startup funding, small business, and entrepreneurship", campaignCount: 1654 },
  { id: "6", name: "Community", slug: "community", icon: Globe, description: "Local projects, community development, and civic causes", campaignCount: 1234 },
  { id: "7", name: "Travel", slug: "travel", icon: Plane, description: "Mission trips, study abroad, and travel experiences", campaignCount: 765 },
  { id: "8", name: "Sports", slug: "sports", icon: Trophy, description: "Athletic programs, team funding, and sports equipment", campaignCount: 543 },
  { id: "9", name: "Events", slug: "events", icon: CalendarDays, description: "Conferences, festivals, and special events", campaignCount: 876 },
  { id: "10", name: "Environment", slug: "environment", icon: Leaf, description: "Conservation, sustainability, and eco-friendly projects", campaignCount: 654 },
  { id: "11", name: "Technology", slug: "technology", icon: Cpu, description: "Tech innovations, gadgets, and digital projects", campaignCount: 1098 },
  { id: "12", name: "Faith", slug: "faith", icon: Church, description: "Religious organizations, church projects, and spiritual causes", campaignCount: 543 },
  { id: "13", name: "Creative", slug: "creative", icon: Palette, description: "Art, music, film, and creative endeavors", campaignCount: 876 },
  { id: "14", name: "Volunteer", slug: "volunteer", icon: HandHeart, description: "Volunteer programs, charity work, and social good", campaignCount: 432 },
  { id: "15", name: "Other", slug: "other", icon: MoreHorizontal, description: "Everything else that deserves support", campaignCount: 1567 },
]

const coverImages = [
  "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=80",
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80",
  "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&q=80",
  "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80",
  "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&q=80",
  "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80",
  "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80",
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80",
  "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&q=80",
  "https://images.unsplash.com/photo-1472162072942-cd5147eb3902?w=800&q=80",
  "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80",
  "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=80",
]

export const heroImages = [
 {
  src: coverImages[0],
  alt: "Medical support for a family in need",
  label: "Medical",
  rotate: "-rotate-3",
  offset: "",
  delay: 0,
 },
 {
  src: coverImages[1],
  alt: "Volunteers building a school",
  label: "Education",
  rotate: "rotate-2",
  offset: "sm:mt-12",
  delay: 1.4,
 },
 {
  src: coverImages[6],
  alt: "Volunteers caring for rescued animals",
  label: "Animal Rescue",
  rotate: "-rotate-2",
  offset: "sm:mt-3",
  delay: 2.8,
 },
 {
  src: coverImages[8],
  alt: "Community garden and neighborhood projects",
  label: "Community",
  rotate: "rotate-3",
  offset: "sm:mt-14",
  delay: 0.7,
 },
 {
  src: coverImages[9],
  alt: "Disaster relief and recovery efforts",
  label: "Relief",
  rotate: "-rotate-2",
  offset: "sm:mt-6",
  delay: 2.1,
 },
]

const avatarImages = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
]

export const mockCampaigns: CampaignData[] = [
  {
    id: "1",
    slug: "help-sarah-beat-cancer",
    title: "Help Sarah Beat Cancer",
    shortDescription: "Sarah is a 32-year-old mother of two who has been diagnosed with stage 2 breast cancer. She needs our help to cover her medical expenses.",
    fullStory: `Sarah Johnson has always been the pillar of strength for her family. A devoted mother of two young children, she works tirelessly as a kindergarten teacher at Lincoln Elementary. In January 2026, her world was turned upside down when she was diagnosed with stage 2 breast cancer.

The diagnosis came as a shock to everyone who knows Sarah. She has always been healthy and active, volunteering at her children's school and coaching the local girls' soccer team. But cancer doesn't discriminate.

Sarah has already begun her treatment journey, which includes chemotherapy, radiation, and eventually surgery. While she has health insurance, the out-of-pocket costs are overwhelming. Between co-pays, prescription medications, travel to the treatment center, and the fact that she can no longer work full-time, the financial burden is mounting quickly.

Sarah's husband Mark has been doing his best to hold things together, working extra shifts at the fire station while also taking care of their two children, Emma (8) and Jack (5). But one income isn't enough to cover their regular expenses, let alone the mounting medical bills.

We're asking for your help to raise funds for Sarah's treatment and to help her family stay afloat during this incredibly difficult time. Every dollar raised will go directly toward:

1. Medical expenses not covered by insurance
2. Prescription medications
3. Travel expenses to and from treatment
4. Household expenses while Sarah is unable to work
5. Childcare costs

Sarah has always been there for others. Now it's our turn to be there for her. Any amount you can contribute, no matter how small, will make a difference. And if you can't donate, please share this campaign with your friends and family.

Thank you for your generosity and support. Sarah's fight is our fight, and together, we can help her beat cancer.`,
    goal: 75000,
    raised: 52340,
    currency: "USD",
    category: "Health",
    categorySlug: "health",
    country: "United States",
    beneficiaryName: "Sarah Johnson",
    coverImage: coverImages[0],
    galleryImages: [coverImages[0], coverImages[1]],
    videoUrl: null,
    deadline: "2026-09-15",
    status: "active",
    tags: ["cancer", "medical", "family"],
    donorCount: 847,
    viewCount: 23456,
    shareCount: 1234,
    featured: true,
    trending: true,
    creatorName: "Mark Johnson",
    creatorAvatar: avatarImages[1],
    createdAt: "2026-01-15",
  },
  {
    id: "2",
    slug: "build-a-school-in-rural-kenya",
    title: "Build a School in Rural Kenya",
    shortDescription: "Help us build a primary school in the rural village of Kibera, Kenya, providing education to over 500 children.",
    fullStory: `In the heart of rural Kenya, in a small village called Kibera, children walk miles every day just to attend classes in makeshift shelters. The nearest proper school is over 15 kilometers away, making it impossible for many children to access quality education.

Our organization, Education Without Borders, has been working in East Africa for over a decade. We've seen firsthand how education can transform lives and communities. Now, we're embarking on our most ambitious project yet: building a permanent primary school in Kibera.

The school will serve over 500 children from the surrounding villages. It will include 12 classrooms, a library, a computer lab, a kitchen for providing nutritious meals, and proper sanitation facilities. We've already secured the land through a partnership with the local community, and we have the architectural plans drawn up. What we need now is the funding to make it a reality.

The total cost of the project is estimated at $150,000, which covers construction, furniture, educational materials, and the first year of operational costs. We've already raised $45,000 through grants and private donations, but we need your help to bridge the gap.

Every child deserves access to quality education. By supporting this campaign, you're not just building a school—you're building futures, empowering communities, and breaking the cycle of poverty.`,
    goal: 150000,
    raised: 98750,
    currency: "USD",
    category: "Education",
    categorySlug: "education",
    country: "Kenya",
    beneficiaryName: "Kibera Community",
    coverImage: coverImages[1],
    galleryImages: [coverImages[1], coverImages[2]],
    videoUrl: null,
    deadline: "2026-12-01",
    status: "active",
    tags: ["education", "africa", "children"],
    donorCount: 1234,
    viewCount: 45678,
    shareCount: 3456,
    featured: true,
    trending: true,
    creatorName: "Dr. Amara Osei",
    creatorAvatar: avatarImages[2],
    createdAt: "2025-11-20",
  },
  {
    id: "3",
    slug: "earthquake-relief-for-turkey",
    title: "Earthquake Relief for Turkey",
    shortDescription: "Providing emergency shelter, food, and medical supplies to families affected by the devastating earthquake in southeastern Turkey.",
    fullStory: `A devastating 7.2 magnitude earthquake has struck southeastern Turkey, leaving thousands of families homeless and in desperate need of help. The destruction is catastrophic—entire neighborhoods have been leveled, hospitals are overwhelmed, and basic necessities like clean water and food are in short supply.

Our emergency response team is on the ground, working with local organizations to provide immediate relief. But we need your help to scale our efforts.

The funds raised through this campaign will be used to:
- Provide emergency shelter (tents and temporary housing)
- Distribute food packages and clean water
- Supply medical kits and first aid supplies
- Support search and rescue operations
- Help rebuild homes and infrastructure in the coming months

Time is critical. Every hour that passes, more families are left without shelter in the cold. Your donation, no matter the size, can save a life today.`,
    goal: 200000,
    raised: 167890,
    currency: "USD",
    category: "Emergency",
    categorySlug: "emergency",
    country: "Turkey",
    beneficiaryName: "Earthquake Victims",
    coverImage: coverImages[2],
    galleryImages: [coverImages[2], coverImages[3]],
    videoUrl: null,
    deadline: "2026-08-30",
    status: "active",
    tags: ["earthquake", "emergency", "relief"],
    donorCount: 3456,
    viewCount: 89012,
    shareCount: 5678,
    featured: true,
    trending: true,
    creatorName: "Relief Foundation Turkey",
    creatorAvatar: avatarImages[3],
    createdAt: "2026-03-01",
  },
  {
    id: "4",
    slug: "rescue-dogs-sanctuary",
    title: "Rescue Dogs Sanctuary Expansion",
    shortDescription: "Help us expand our rescue dog sanctuary to save more lives. We need to build new kennels and a veterinary clinic.",
    fullStory: `Paws of Hope Animal Sanctuary has been rescuing abandoned and abused dogs for over 5 years. We currently house 120 dogs, but our facility is at maximum capacity, and we receive requests to take in new dogs every single day.

To save more lives, we need to expand our sanctuary. The expansion project includes:
- 40 new climate-controlled kennels
- A fully equipped veterinary clinic
- A training and socialization area
- An outdoor play area with obstacles
- A grooming station

The total cost for the expansion is $60,000. We've already raised $25,000 through our annual fundraiser, but we need your help to complete the project.

Every dollar you contribute directly impacts the lives of dogs who have nowhere else to go. These animals have been abandoned, abused, and left on the streets. Paws of Hope gives them a second chance at life, and with your help, we can save even more.`,
    goal: 60000,
    raised: 34200,
    currency: "USD",
    category: "Animals",
    categorySlug: "animals",
    country: "United States",
    beneficiaryName: "Paws of Hope Sanctuary",
    coverImage: coverImages[3],
    galleryImages: [coverImages[3], coverImages[4]],
    videoUrl: null,
    deadline: "2026-10-15",
    status: "active",
    tags: ["animals", "dogs", "rescue"],
    donorCount: 567,
    viewCount: 18923,
    shareCount: 890,
    featured: false,
    trending: true,
    creatorName: "Lisa Chen",
    creatorAvatar: avatarImages[4],
    createdAt: "2026-02-10",
  },
  {
    id: "5",
    slug: "tech-startup-for-sustainability",
    title: "GreenTech: AI for Sustainability",
    shortDescription: "Our AI-powered platform helps businesses reduce their carbon footprint by optimizing energy usage in real-time.",
    fullStory: `Climate change is the defining challenge of our generation. Businesses account for over 70% of global carbon emissions, yet most lack the tools to effectively measure and reduce their environmental impact.

GreenTech is building an AI-powered platform that changes that. Our software analyzes real-time energy data from buildings, factories, and offices, providing actionable recommendations to reduce energy consumption and carbon emissions.

In our pilot program with 15 businesses, we've achieved an average 23% reduction in energy costs and a 30% reduction in carbon emissions. Now we need to scale.

The funds will be used to:
- Hire additional AI engineers and data scientists
- Expand our platform to support more building types
- Launch a mobile app for real-time monitoring
- Scale our sales and marketing efforts
- Obtain necessary certifications

Join us in building a greener future. Together, we can make sustainability accessible and profitable for businesses worldwide.`,
    goal: 100000,
    raised: 42150,
    currency: "USD",
    category: "Technology",
    categorySlug: "technology",
    country: "Canada",
    beneficiaryName: "GreenTech Inc.",
    coverImage: coverImages[4],
    galleryImages: [coverImages[4], coverImages[5]],
    videoUrl: null,
    deadline: "2026-11-01",
    status: "active",
    tags: ["technology", "sustainability", "ai"],
    donorCount: 234,
    viewCount: 12345,
    shareCount: 567,
    featured: true,
    trending: false,
    creatorName: "David Park",
    creatorAvatar: avatarImages[5],
    createdAt: "2026-04-01",
  },
  {
    id: "6",
    slug: "community-garden-project",
    title: "Community Garden Project",
    shortDescription: "Transform an abandoned lot into a thriving community garden that provides fresh produce and a gathering space for our neighborhood.",
    fullStory: `Our neighborhood has been classified as a food desert for over a decade. The nearest grocery store is 4 miles away, and many residents rely on convenience stores and fast food for their daily meals.

We want to change that. The Community Garden Project will transform a 1-acre abandoned lot in the heart of our neighborhood into a thriving urban farm and community gathering space.

The garden will feature:
- 50 raised beds for community members to grow their own food
- A greenhouse for year-round growing
- A composting station
- A community kitchen for cooking classes
- A children's education area
- Seating and gathering spaces

We've secured a 10-year lease on the property from the city, and we have a team of volunteers ready to do the work. What we need is the funding for materials and equipment.`,
    goal: 35000,
    raised: 18900,
    currency: "USD",
    category: "Community",
    categorySlug: "community",
    country: "United States",
    beneficiaryName: "Eastside Community Alliance",
    coverImage: coverImages[5],
    galleryImages: [coverImages[5], coverImages[6]],
    videoUrl: null,
    deadline: "2026-09-30",
    status: "active",
    tags: ["community", "garden", "food"],
    donorCount: 345,
    viewCount: 8765,
    shareCount: 432,
    featured: false,
    trending: true,
    creatorName: "Maria Garcia",
    creatorAvatar: avatarImages[0],
    createdAt: "2026-05-01",
  },
  {
    id: "7",
    slug: "americas-most-wanted-tour",
    title: "Band's First National Tour",
    shortDescription: "Indie rock band 'The Echoes' needs funding for their first 20-city national tour to share their music with the world.",
    fullStory: `The Echoes have been playing in local venues for three years, building a passionate fan base one show at a time. Now, we're ready to take the next step: our first national tour.

The tour will cover 20 cities across the United States over 6 weeks. We'll be playing in venues ranging from 200 to 1,000 capacity, with several sold-out shows already confirmed.

The funds will cover:
- Van and trailer rental
- Fuel costs
- Equipment maintenance and backup gear
- Sound and lighting equipment rental for smaller venues
- Food and accommodation for 5 band members
- Marketing and merchandise production

This is a dream we've been working toward since we first picked up our instruments. With your help, we can make it a reality and share our music with fans across the country.`,
    goal: 25000,
    raised: 11200,
    currency: "USD",
    category: "Creative",
    categorySlug: "creative",
    country: "United States",
    beneficiaryName: "The Echoes Band",
    coverImage: coverImages[6],
    galleryImages: [coverImages[6], coverImages[7]],
    videoUrl: null,
    deadline: "2026-08-01",
    status: "active",
    tags: ["music", "tour", "creative"],
    donorCount: 189,
    viewCount: 6543,
    shareCount: 321,
    featured: false,
    trending: false,
    creatorName: "Jake Morrison",
    creatorAvatar: avatarImages[5],
    createdAt: "2026-04-15",
  },
  {
    id: "8",
    slug: "clean-water-for-villages",
    title: "Clean Water for 10 Villages",
    shortDescription: "Install water purification systems and wells in 10 rural villages in Bangladesh, providing clean drinking water to 15,000 people.",
    fullStory: `Access to clean water is a basic human right, yet 15,000 people in 10 rural villages in Bangladesh still don't have it. Contaminated water sources lead to waterborne diseases that claim thousands of lives every year, especially among children.

Our team of engineers and volunteers will install solar-powered water purification systems and drill deep wells in each of the 10 villages. Each system can serve 1,500 people and is designed to last for 20+ years with minimal maintenance.

The total project cost is $80,000, covering:
- Solar-powered purification systems
- Well drilling equipment and labor
- Storage tanks and distribution piping
- Training local maintenance workers
- Water quality testing equipment
- 1-year maintenance supply

Clean water changes everything. It reduces disease, improves nutrition, and frees children—especially girls—to attend school instead of walking miles to collect water.`,
    goal: 80000,
    raised: 62400,
    currency: "USD",
    category: "Community",
    categorySlug: "community",
    country: "Bangladesh",
    beneficiaryName: "10 Rural Villages",
    coverImage: coverImages[7],
    galleryImages: [coverImages[7], coverImages[8]],
    videoUrl: null,
    deadline: "2026-10-30",
    status: "active",
    tags: ["water", "health", "villages"],
    donorCount: 923,
    viewCount: 34567,
    shareCount: 2345,
    featured: true,
    trending: true,
    creatorName: "Aisha Rahman",
    creatorAvatar: avatarImages[2],
    createdAt: "2025-12-15",
  },
  {
    id: "9",
    slug: "youth-soccer-league",
    title: "Youth Soccer League Equipment",
    shortDescription: "Provide jerseys, cleats, balls, and training equipment for 200 underprivileged kids to join the local soccer league.",
    fullStory: `Every Saturday morning, 200 kids from our neighborhood dream of playing organized soccer. They show up to the park in their street clothes, kicking around a deflated ball, watching other teams in their crisp uniforms play on the main fields.

These kids deserve a chance. Many come from single-parent households, some are refugees, and all come from families that can't afford the $200+ registration fee, let alone the equipment costs.

The Youth Soccer League Equipment Fund will:
- Provide full uniforms (jersey, shorts, socks) for 200 kids
- Purchase soccer cleats for every player
- Buy 50 quality soccer balls
- Get training cones, goals, and other equipment
- Cover registration fees for the season
- Provide post-game snacks for every match

Soccer is more than a game. It teaches teamwork, discipline, and gives these kids a sense of belonging and purpose. Help us give them the chance they deserve.`,
    goal: 15000,
    raised: 8900,
    currency: "USD",
    category: "Sports",
    categorySlug: "sports",
    country: "United States",
    beneficiaryName: "Youth Soccer League",
    coverImage: coverImages[8],
    galleryImages: [coverImages[8], coverImages[9]],
    videoUrl: null,
    deadline: "2026-08-15",
    status: "active",
    tags: ["sports", "youth", "soccer"],
    donorCount: 234,
    viewCount: 7890,
    shareCount: 456,
    featured: false,
    trending: false,
    creatorName: "Coach Mike Thompson",
    creatorAvatar: avatarImages[3],
    createdAt: "2026-05-10",
  },
  {
    id: "10",
    slug: "emergency-animal-rescue-hurricane",
    title: "Hurricane Animal Rescue Mission",
    shortDescription: "Rescue and rehabilitate pets and wildlife displaced by Hurricane Elena along the Gulf Coast.",
    fullStory: `Hurricane Elena has left a path of devastation along the Gulf Coast, and thousands of animals—pets and wildlife alike—have been displaced, injured, or stranded.

Our animal rescue team has been deployed to the hardest-hit areas, but the scale of this disaster is overwhelming. We need additional resources to save as many lives as possible.

Funds will be used for:
- Emergency veterinary care for injured animals
- Temporary shelter and housing
- Food and supplies for rescued animals
- Transportation to reunite pets with owners
- Wildlife rehabilitation
- Rebuilding damaged shelter infrastructure

Animals are among the most vulnerable victims of natural disasters. They can't help themselves—they need us. Help us be their voice and their lifeline.`,
    goal: 50000,
    raised: 31200,
    currency: "USD",
    category: "Emergency",
    categorySlug: "emergency",
    country: "United States",
    beneficiaryName: "Gulf Coast Animal Rescue",
    coverImage: coverImages[9],
    galleryImages: [coverImages[9], coverImages[10]],
    videoUrl: null,
    deadline: "2026-09-15",
    status: "active",
    tags: ["emergency", "animals", "hurricane"],
    donorCount: 567,
    viewCount: 19876,
    shareCount: 1234,
    featured: false,
    trending: true,
    creatorName: "Dr. Rachel Kim",
    creatorAvatar: avatarImages[4],
    createdAt: "2026-06-01",
  },
  {
    id: "11",
    slug: "mission-trip-to-guatemala",
    title: "Medical Mission Trip to Guatemala",
    shortDescription: "Fund a team of 15 medical professionals to provide free healthcare in remote Guatemalan villages for 2 weeks.",
    fullStory: `Remote villages in the highlands of Guatemala have little to no access to healthcare. The nearest hospital is hours away by foot, and most families cannot afford the transportation costs, let alone medical treatment.

Our team of 15 doctors, nurses, and medical students is planning a 2-week mission trip to provide free medical care, dental services, and health education in 5 remote villages.

The mission will include:
- General medical consultations
- Pediatric care
- Dental services
- Eye exams and reading glasses distribution
- Prenatal care
- Health education workshops
- Distribution of essential medications

We need funding for flights, medical supplies, medications, transportation within Guatemala, and accommodation. Every dollar helps us bring care to those who need it most.`,
    goal: 40000,
    raised: 15600,
    currency: "USD",
    category: "Travel",
    categorySlug: "travel",
    country: "Guatemala",
    beneficiaryName: "Guatemala Medical Mission",
    coverImage: coverImages[10],
    galleryImages: [coverImages[10], coverImages[11]],
    videoUrl: null,
    deadline: "2026-11-15",
    status: "active",
    tags: ["medical", "mission", "travel"],
    donorCount: 123,
    viewCount: 5432,
    shareCount: 234,
    featured: false,
    trending: false,
    creatorName: "Dr. Sarah Williams",
    creatorAvatar: avatarImages[0],
    createdAt: "2026-04-20",
  },
  {
    id: "12",
    slug: "renovate-community-church",
    title: "Renovate Our Community Church",
    shortDescription: "Our 100-year-old church needs critical renovations to continue serving as a community gathering place and shelter.",
    fullStory: `Grace Community Church has been the heart of our neighborhood for over 100 years. From Sunday services to food drives, from youth programs to emergency shelter during storms, this building has served our community in countless ways.

But time has taken its toll. The roof leaks, the heating system is failing, the electrical wiring is outdated and poses safety risks, and the foundation needs reinforcement. Without these critical repairs, we'll be forced to close our doors.

The renovation project includes:
- New roof installation
- Updated HVAC system
- Electrical rewiring and panel upgrade
- Foundation repair
- ADA accessibility improvements
- Updated restrooms
- New flooring in the main hall

This church is more than a place of worship—it's a community center, a food bank, a shelter, and a safe haven. Help us keep it standing for the next 100 years.`,
    goal: 120000,
    raised: 45300,
    currency: "USD",
    category: "Faith",
    categorySlug: "faith",
    country: "United States",
    beneficiaryName: "Grace Community Church",
    coverImage: coverImages[11],
    galleryImages: [coverImages[11], coverImages[0]],
    videoUrl: null,
    deadline: "2026-12-31",
    status: "active",
    tags: ["faith", "church", "renovation"],
    donorCount: 345,
    viewCount: 8765,
    shareCount: 567,
    featured: false,
    trending: false,
    creatorName: "Pastor James Brown",
    creatorAvatar: avatarImages[1],
    createdAt: "2026-03-15",
  },
]

export const testimonials: TestimonialData[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: avatarImages[0],
    role: "Cancer Survivor",
    content: "Thanks to the incredible generosity of donors, I was able to focus on my recovery without worrying about medical bills. This platform connected me with people who truly cared. I'm now cancer-free and forever grateful.",
    campaignTitle: "Help Sarah Beat Cancer",
    amountRaised: 52340,
  },
  {
    id: "2",
    name: "Dr. Amara Osei",
    avatar: avatarImages[2],
    role: "Education Director",
    content: "We exceeded our fundraising goal and built a school that now educates over 500 children in rural Kenya. The support from donors around the world made this dream a reality. Education truly changes everything.",
    campaignTitle: "Build a School in Rural Kenya",
    amountRaised: 98750,
  },
  {
    id: "3",
    name: "Lisa Chen",
    avatar: avatarImages[4],
    role: "Animal Rescue Founder",
    content: "Our sanctuary has grown from housing 120 dogs to over 200, all thanks to the donations we received. We were able to build a veterinary clinic and expand our kennels. Every dog now has a second chance.",
    campaignTitle: "Rescue Dogs Sanctuary Expansion",
    amountRaised: 34200,
  },
  {
    id: "4",
    name: "David Park",
    avatar: avatarImages[5],
    role: "Tech Entrepreneur",
    content: "The crowdfunding campaign gave us the capital we needed to launch our AI sustainability platform. We've now helped over 100 businesses reduce their carbon footprint. This platform made it all possible.",
    campaignTitle: "GreenTech: AI for Sustainability",
    amountRaised: 42150,
  },
]

export const faqData: FAQData[] = [
  { id: "1", question: "What is gofundme?", answer: "gofundme is a crowdfunding platform that helps people raise money for causes they care about. Whether it's a personal emergency, a community project, or a creative endeavor, we provide the tools and platform to connect campaign creators with generous donors.", category: "General" },
  { id: "2", question: "How does gofundme work?", answer: "Campaign creators set up a page telling their story, setting a fundraising goal, and sharing their campaign. Donors can then contribute any amount they choose. Funds are collected and disbursed to the campaign creator based on the chosen payout schedule.", category: "General" },
  { id: "3", question: "Is gofundme available internationally?", answer: "Yes! gofundme operates in over 200 countries. We support multiple currencies and payment methods to make donating accessible to everyone, everywhere.", category: "General" },
  { id: "4", question: "How do I start a campaign?", answer: "Click the 'Start a Campaign' button and follow our step-by-step guide. You'll need to provide a title, description, story, goal amount, and cover image. Our guided process makes it easy to set up a compelling campaign in minutes.", category: "Campaigns" },
  { id: "5", question: "What makes a successful campaign?", answer: "Successful campaigns typically have a compelling personal story, a clear and realistic funding goal, high-quality photos or videos, regular updates for donors, and active sharing on social media. Being transparent about how funds will be used builds trust with potential donors.", category: "Campaigns" },
  { id: "6", question: "Can I update my campaign after publishing?", answer: "Yes! You can post updates, add new photos, and modify your campaign details at any time. Regular updates keep donors engaged and informed about your progress.", category: "Campaigns" },
  { id: "7", question: "What are the fees?", answer: "gofundme charges a 5% platform fee on all donations, plus standard payment processing fees (typically 2.9% + $0.30 per transaction for credit cards). There are no hidden fees or charges.", category: "Donations" },
  { id: "8", question: "Can I donate anonymously?", answer: "Yes, donors can choose to make their donation anonymous. Your name and profile will not be publicly displayed on the campaign page, though the campaign creator can see it for their records.", category: "Donations" },
  { id: "9", question: "When do campaign creators receive funds?", answer: "Campaign creators can choose between two payout options: immediate payouts (funds are transferred as they're received) or goal-based payouts (funds are released once the campaign reaches its goal). Both options have a standard 3-5 business day processing time.", category: "Donations" },
  { id: "10", question: "Can I get a refund on my donation?", answer: "Donations are generally non-refundable once a campaign has received them. However, if a campaign hasn't reached its goal and you need to request a refund, please contact our support team within 14 days of your donation.", category: "Donations" },
  { id: "11", question: "How do I create an account?", answer: "Click the 'Sign Up' button and fill in your details. You can register with your email address or use Google Sign-In for quick registration. Verify your email address to activate your account.", category: "Account" },
  { id: "12", question: "How do I reset my password?", answer: "Click 'Forgot Password' on the login page, enter your email address, and we'll send you a secure link to reset your password. The link expires after 24 hours for security purposes.", category: "Account" },
  { id: "13", question: "Is my personal information safe?", answer: "Absolutely. We use bank-level encryption to protect your data. We never share your personal information with third parties without your consent. Please review our Privacy Policy for full details.", category: "Technical" },
  { id: "14", question: "What payment methods are accepted?", answer: "We accept all major credit and debit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and bank transfers in select countries. Cryptocurrency donations are also supported.", category: "Technical" },
  { id: "15", question: "Do you have a mobile app?", answer: "Our responsive web platform works great on all devices, and we're currently developing native iOS and Android apps. Sign up for our newsletter to be notified when they launch.", category: "Technical" },
]

export const siteStats = {
  totalRaised: "$2B+",
  totalDonations: "150M+",
  countries: "200+",
  campaignsFunded: "500K+",
}

export const navLinks = [
  { label: "Donate", href: "/categories" },
  { label: "Fundraise", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
]
