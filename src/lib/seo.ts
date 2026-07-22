import type { Metadata } from "next"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://fundrise.com"
const SITE_NAME = "FundRise"
const DEFAULT_DESCRIPTION = "Help people fund what matters. Start or support crowdfunding campaigns on FundRise."

export function generateMetadata(
  title: string,
  description: string = DEFAULT_DESCRIPTION,
  url?: string,
  image?: string
): Metadata {
  const fullUrl = url ? `${SITE_URL}${url}` : SITE_URL
  const ogImage = image || `${SITE_URL}/og-default.png`

  return {
    title,
    description,
    keywords: [
      "crowdfunding",
      "donation",
      "fundraising",
      "charity",
      "campaign",
      "help others",
      "community funding",
      "crowd funding",
    ],
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: fullUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }
}

interface CampaignSchemaProps {
  id: string
  title: string
  description: string
  image?: string
  goal: number
  raised: number
  creator: string
  startDate?: string
  endDate?: string
  url: string
}

export function generateCampaignSchema(campaign: CampaignSchemaProps) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: campaign.title,
    description: campaign.description,
    image: campaign.image || `${SITE_URL}/og-default.png`,
    url: `${SITE_URL}${campaign.url}`,
    organizer: {
      "@type": "Person",
      name: campaign.creator,
    },
    offers: {
      "@type": "Offer",
      price: campaign.goal,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    startDate: campaign.startDate || new Date().toISOString(),
    endDate: campaign.endDate,
  }
}

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: DEFAULT_DESCRIPTION,
    sameAs: [
      "https://twitter.com/fundrise",
      "https://facebook.com/fundrise",
      "https://instagram.com/fundrise",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "support@fundrise.com",
    },
  }
}
