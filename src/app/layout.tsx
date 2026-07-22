import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Inter } from "next/font/google"
import { ThemeProvider } from "@/components/shared/ThemeProvider"
import { TooltipProvider } from "@/components/ui/tooltip"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "FundRise - Crowdfunding Platform",
    template: "%s | FundRise",
  },
  description: "Help people fund what matters. Start or support crowdfunding campaigns on FundRise.",
  keywords: [
    "crowdfunding",
    "donation",
    "fundraising",
    "charity",
    "campaign",
    "help others",
    "community funding",
  ],
  authors: [{ name: "FundRise" }],
  openGraph: {
    title: "FundRise - Crowdfunding Platform",
    description: "Help people fund what matters. Start or support crowdfunding campaigns on FundRise.",
    url: "https://fundrise.com",
    siteName: "FundRise",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "FundRise Crowdfunding Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FundRise - Crowdfunding Platform",
    description: "Help people fund what matters. Start or support crowdfunding campaigns on FundRise.",
    images: ["/og-default.png"],
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192.svg",
    apple: "/icons/icon-512.svg",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
